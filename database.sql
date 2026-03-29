CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(100),
  role VARCHAR(20)
);

CREATE TABLE receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_path VARCHAR(255)
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount FLOAT,
  category VARCHAR(50),
  date DATE,
  description TEXT,
  status VARCHAR(20)
);