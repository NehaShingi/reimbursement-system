CREATE DATABASE expense_app;
USE expense_app;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  company_name VARCHAR(100),
  country VARCHAR(50),
  role VARCHAR(20)
);