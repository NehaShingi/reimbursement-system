const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DB =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Neha@2006",
  database: "expense_app"
});

db.connect(err => {
  if (err) console.log("DB Error ❌", err);
  else console.log("DB Connected ✅");
});

// ================= FILE UPLOAD =================
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================= CURRENCY =================
const rates = require("./currencyRates.json");

function convert(amount, from, to) {
  const inINR = amount * rates[from];
  return (inINR / rates[to]).toFixed(2);
}

// ================= ROUTES =================

// Test
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (result.length > 0) {
        res.send({ success: true, user: result[0] });
      } else {
        res.send({ success: false });
      }
    }
  );
});

// SIGNUP
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, password, "admin"],
    () => {
      res.send({ success: true });
    }
  );
});

// ================= CURRENCY API =================
app.post("/convert", (req, res) => {
  const { amount, from, to } = req.body;
  const result = convert(amount, from, to);
  res.send({ converted: result });
});

// ================= UPLOAD RECEIPT =================
app.post("/upload", upload.single("receipt"), (req, res) => {
  const file = req.file.filename;

  db.query(
    "INSERT INTO receipts (file_path) VALUES (?)",
    [file],
    () => {
      res.send({ success: true, file });
    }
  );
});

// ================= OCR =================
app.post("/ocr", upload.single("receipt"), async (req, res) => {
  const result = await Tesseract.recognize(req.file.path, "eng");

  const text = result.data.text;

  const amountMatch = text.match(/\d+\.\d{2}/);

  res.send({
    amount: amountMatch ? amountMatch[0] : "",
    text
  });
});

// ================= SUBMIT EXPENSE =================
app.post("/submit-expense", (req, res) => {
  const { amount, category, date, desc } = req.body;

  db.query(
    "INSERT INTO expenses (amount,category,date,description,status) VALUES (?,?,?,?,?)",
    [amount, category, date, desc, "pending"],
    () => {
      res.send({ success: true });
    }
  );
});

// ================= APPROVAL =================
app.post("/approve", (req, res) => {
  const { id } = req.body;

  db.query(
    "UPDATE expenses SET status='approved' WHERE id=?",
    [id],
    () => {
      res.send({ success: true });
    }
  );
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on 5000 🚀");
});