const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB =================
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Neha@2006",
  database: "expense_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => { console.log("DB Connected ✅"); conn.release(); })
  .catch(err => console.log("DB Error ❌", err));

// ================= FILE UPLOAD =================
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= CURRENCY =================
const rates = require("./currencyRates.json");

function convert(amount, from, to) {
  const amountParsed = parseFloat(amount);
  if (isNaN(amountParsed)) return 0;
  if (!rates[from] || !rates[to]) return amountParsed;
  const inINR = amountParsed * rates[from];
  return (inINR / rates[to]).toFixed(2);
}

// ================= ROUTES =================

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email=? AND password=?", [email, password]);
    if (rows.length > 0) {
      res.send({ success: true, user: rows[0] });
    } else {
      res.send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.post("/convert", (req, res) => {
  const { amount, from, to } = req.body;
  const result = convert(amount, from, to || 'INR');
  res.send({ converted: result });
});

// UPLOAD RECEIPT (General upload if needed, but we'll combine with submit)
app.post("/upload", upload.single("receipt"), async (req, res) => {
    res.send({ success: true, filePath: req.file.filename });
});

// OCR
app.post("/ocr", upload.single("receipt"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await Tesseract.recognize(filePath, "eng");
    const text = result.data.text;
    
    // Extract Amount (e.g. $12.34 or Total: 12.34)
    const amountMatch = text.match(/(?:TOTAL|Total|Amount|amount|Balance).{0,10}?(\d+\.\d{2})/i) || text.match(/\$?\s?(\d+\.\d{2})/);
    let amount = amountMatch ? (amountMatch[1] || amountMatch[0]) : "";
    amount = amount.replace(/[^\d.]/g, ''); // numbers only

    // Extract Date (MM/DD/YYYY or similar)
    const dateMatch = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/);
    let date = dateMatch ? dateMatch[0] : "";
    if (date) {
        const d = new Date(date);
        if(!isNaN(d.valueOf())) {
            date = d.toISOString().split('T')[0];
        } else {
             date = "";
        }
    }

    res.send({
      success: true,
      amount: amount,
      date: date,
      text: text,
      filePath: req.file.filename
    });
  } catch(err) {
      console.error("OCR Error:", err);
      res.status(500).send({success:false, error: err.message});
  }
});

// SUBMIT EXPENSE
app.post("/submit-expense", async (req, res) => {
  try {
    const { user_id, amount, currency, category, date, desc, receipt_path } = req.body;
    
    // Convert to INR as base for record keeping
    const converted_amount = convert(amount, currency, 'INR');

    await pool.query(
      "INSERT INTO expenses (user_id, amount, currency, converted_amount, category, date, description, receipt_path, current_level, status) VALUES (?,?,?,?,?,?,?,?,'Manager','pending')",
      [user_id, amount, currency, converted_amount, category, date, desc, receipt_path]
    );

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// GET EXPENSES
app.get("/expenses", async (req, res) => {
    try {
        const userId = req.query.user_id;
        if (!userId) {
             return res.send({success:false, message: "user_id required"});
        }
        const [users] = await pool.query("SELECT * FROM users WHERE id=?", [userId]);
        if(users.length === 0) return res.send({success:false, message: "User not found"});
        const user = users[0];

        let query = "";
        let params = [];

        if (user.role === 'Employee') {
            query = "SELECT e.*, u.name as employee_name FROM expenses e JOIN users u ON e.user_id = u.id WHERE e.user_id = ? ORDER BY e.created_at DESC";
            params = [userId];
        } else if (user.role === 'Manager') {
            query = "SELECT e.*, u.name as employee_name FROM expenses e JOIN users u ON e.user_id = u.id WHERE u.manager_id = ? AND e.status = 'pending' AND e.current_level = 'Manager' ORDER BY e.created_at DESC";
            params = [userId];
        } else if (user.role === 'Finance') {
            query = "SELECT e.*, u.name as employee_name FROM expenses e JOIN users u ON e.user_id = u.id WHERE e.status = 'pending' AND e.current_level = 'Finance' ORDER BY e.created_at DESC";
        } else if (user.role === 'Director') {
            query = "SELECT e.*, u.name as employee_name FROM expenses e JOIN users u ON e.user_id = u.id WHERE e.status = 'pending' AND e.current_level = 'Director' ORDER BY e.created_at DESC";
        } else if (user.role === 'CFO' || user.role === 'Admin') {
            // CFO can override any pending expense
            query = "SELECT e.*, u.name as employee_name FROM expenses e JOIN users u ON e.user_id = u.id WHERE e.status = 'pending' ORDER BY e.created_at DESC";
        } else {
             return res.send({success: true, expenses: []});
        }

        const [results] = await pool.query(query, params);
        res.send({ success: true, expenses: results, role: user.role });

    } catch(err) {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
    }
});

// APPROVAL ENGINE
app.post("/approve", async (req, res) => {
  try {
    const { expense_id, approver_id, action, comments } = req.body; // action: 'approve' or 'reject'
    
    const [expenses] = await pool.query("SELECT * FROM expenses WHERE id=?", [expense_id]);
    if(expenses.length === 0) return res.send({success:false, message:"Expense not found"});
    const expense = expenses[0];

    const [users] = await pool.query("SELECT * FROM users WHERE id=?", [approver_id]);
    const user = users[0];

    const conn = await pool.getConnection();

    if(action === 'reject') {
        await conn.query("INSERT INTO expense_approvals (expense_id, approver_id, level, status, comments) VALUES (?, ?, ?, 'rejected', ?)", [expense_id, approver_id, user.role, comments || '']);
        await conn.query("UPDATE expenses SET status='rejected' WHERE id=?", [expense_id]);
        conn.release();
        return res.send({success: true, status: 'rejected'});
    }

    // Rules logic for approval
    await conn.query("INSERT INTO expense_approvals (expense_id, approver_id, level, status, comments) VALUES (?, ?, ?, 'approved', ?)", [expense_id, approver_id, user.role, comments || '']);
    
    let nextLevel = expense.current_level;
    let finalStatus = expense.status;

    // RULE 1: CFO Override
    if (user.role === 'CFO') {
        const [rules] = await conn.query("SELECT rule_value FROM system_rules WHERE rule_name='cfo_override_enabled'");
        let overrideEnabled = rules.length > 0 ? (rules[0].rule_value === 'true') : true;
        
        if (overrideEnabled) {
            nextLevel = 'Completed';
            finalStatus = 'approved';
        }
    } 
    // Sequential: Manager -> Finance
    else if (expense.current_level === 'Manager' && user.role === 'Manager') {
        nextLevel = 'Finance';
    }
    // Sequential + Percentage: Finance -> Director
    else if (expense.current_level === 'Finance' && user.role === 'Finance') {
        const [financeUsers] = await conn.query("SELECT COUNT(*) as total FROM users WHERE role='Finance'");
        const [financeApprovers] = await conn.query("SELECT COUNT(DISTINCT approver_id) as total FROM expense_approvals WHERE expense_id=? AND level='Finance' AND status='approved'", [expense_id]);
        
        const totalFinance = financeUsers[0].total || 1;
        const totalApproved = financeApprovers[0].total || 0;
        
        let threshold = 60; // default 60%
        const [rules] = await conn.query("SELECT rule_value FROM system_rules WHERE rule_name='finance_approval_threshold_percent'");
        if(rules.length > 0) threshold = parseInt(rules[0].rule_value);

        const currentPct = (totalApproved / totalFinance) * 100;
        
        if (currentPct >= threshold) {
            nextLevel = 'Director';
        }
    }
    // Sequential: Director -> Finalize
    else if (expense.current_level === 'Director' && user.role === 'Director') {
         nextLevel = 'Completed';
         finalStatus = 'approved';
    }

    // Update expense
    await conn.query("UPDATE expenses SET current_level=?, status=? WHERE id=?", [nextLevel, finalStatus, expense_id]);
    conn.release();

    res.send({ success: true, nextLevel, status: finalStatus });

  } catch(err) {
      console.error(err);
      res.status(500).send({ success: false, error: err.message });
  }
});

// GET My Expenses (Employee specifically seeing all theirs)
app.get("/my-expenses", async (req, res) => {
    try {
        const userId = req.query.user_id;
        const [results] = await pool.query("SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC", [userId]);
        res.send({ success: true, expenses: results });
    } catch(err) {
        res.status(500).send({ success: false, error: err.message });
    }
});


app.listen(5000, () => {
  console.log("Server running on 5000 🚀");
});