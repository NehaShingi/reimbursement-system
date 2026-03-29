CREATE DATABASE expense_app;
USE expense_app;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(50), -- employee / manager / admin
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Expenses Table
CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  description VARCHAR(255),
  category VARCHAR(100),
  expense_date DATE,
  amount DECIMAL(10,2),
  paid_by VARCHAR(50),
  receipt_url VARCHAR(255),
  status VARCHAR(50), -- draft / pending / approved / rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Approvals Table
CREATE TABLE approvals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expense_id INT,
  approver_id INT,
  status VARCHAR(50), -- pending / approved / rejected
  step_number INT,
  comments VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expense_id) REFERENCES expenses(id),
  FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Approval_rules Table
CREATE TABLE approval_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rule_name VARCHAR(100),
  category VARCHAR(100),
  min_amount DECIMAL(10,2),
  max_amount DECIMAL(10,2),
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Rule_Approvers Table
CREATE TABLE rule_approvers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rule_id INT,
  approver_id INT,
  step_number INT,
  is_required BOOLEAN,
  FOREIGN KEY (rule_id) REFERENCES approval_rules(id),
  FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Reciepts Table
CREATE TABLE receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  expense_id INT,
  file_url VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expense_id) REFERENCES expenses(id)
);