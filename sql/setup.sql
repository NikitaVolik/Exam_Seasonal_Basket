-- Выполняй в новой отдельной учебной базе.
CREATE DATABASE IF NOT EXISTS exam_seasonal_basket
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE exam_seasonal_basket;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  quantity INT NOT NULL CHECK (quantity BETWEEN 1 AND 5),
  pickup_date VARCHAR(10) NOT NULL,
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);