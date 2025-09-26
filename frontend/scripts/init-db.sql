-- AutoFina Database Initialization Script
-- Run this script in your MySQL database

-- Create database
CREATE DATABASE IF NOT EXISTS autofina;
USE autofina;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  short_description TEXT,
  technical_spec TEXT,
  timeline VARCHAR(100),
  telegram VARCHAR(100) NOT NULL,
  promo VARCHAR(100),
  email VARCHAR(255),
  message TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_telegram ON orders(telegram);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_created_at ON orders(created_at);

-- Insert sample data (optional)
INSERT INTO orders (
  project_name, 
  short_description, 
  technical_spec, 
  timeline, 
  telegram, 
  promo, 
  email, 
  message,
  status
) VALUES (
  'Sample Project',
  'A sample project description',
  'Technical specifications for the sample project',
  '1 week',
  '@sample_user',
  'PROMO123',
  'sample@example.com',
  'This is a sample message',
  'pending'
);
