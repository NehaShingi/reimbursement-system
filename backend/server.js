const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Neha@2006", 
  database: "expense_app"
});

// Connect to DB
db.connect(err => {
  if (err) {
    console.log("Database connection failed ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


// ==========================
// 🔐 LOGIN API
// ==========================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.send({ success: false, error: err });
    }

    if (result.length > 0) {
      res.send({
        success: true,
        user: result[0]
      });
    } else {
      res.send({
        success: false,
        message: "Invalid email or password"
      });
    }
  });
});


// ==========================
// 📝 SIGNUP API (Admin only)
// ==========================
app.post("/signup", (req, res) => {
  const { name, email, password, company_name, country } = req.body;

  const sql = `
    INSERT INTO users (name, email, password, company_name, country, role)
    VALUES (?, ?, ?, ?, ?, 'admin')
  `;

  db.query(sql, [name, email, password, company_name, country], (err, result) => {
    if (err) {
      return res.send({
        success: false,
        message: "User already exists or error",
        error: err
      });
    }

    res.send({
      success: true,
      message: "Admin registered successfully ✅"
    });
  });
});


// ==========================
// 🚀 START SERVER
// ==========================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});