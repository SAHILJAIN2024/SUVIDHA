-- Municipal Services Portal - Complete MySQL Schema
-- Based on ER Diagram
CREATE DATABASE IF NOT EXISTS municipal_services;
USE municipal_services;
-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  dob DATE,
  gender ENUM('Male', 'Female', 'Other'),
  adhaar_no VARCHAR(12) UNIQUE,
  gas_no VARCHAR(50),
  ivrs_no VARCHAR(50) COMMENT 'IVRS number for Electricity',
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- =============================================
-- 2. USER ADDRESS TABLE
-- =============================================
CREATE TABLE user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  state VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  area_locality VARCHAR(100),
  pincode VARCHAR(10) NOT NULL,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- =============================================
-- 3. AUTHORITIES TABLE (shared across services)
-- =============================================
CREATE TABLE authorities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  service_type ENUM('electricity', 'gas', 'water', 'waste', 'municipal') NOT NULL,
  center_name VARCHAR(150),
  center_address TEXT,
  contact_phone VARCHAR(15),
  contact_email VARCHAR(150),
  zone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =============================================
-- 4. ELECTRICITY DASHBOARD
-- =============================================
CREATE TABLE electricity_connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ivrs_no VARCHAR(50) NOT NULL,
  connection_type ENUM('domestic', 'commercial', 'industrial') DEFAULT 'domestic',
  meter_no VARCHAR(50),
  load_kw DECIMAL(10,2),
  zone VARCHAR(50),
  status ENUM('active', 'disconnected', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE electricity_bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  connection_id INT NOT NULL,
  user_id INT NOT NULL,
  bill_month VARCHAR(7) NOT NULL COMMENT 'YYYY-MM',
  units_consumed DECIMAL(10,2),
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE,
  status ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (connection_id) REFERENCES electricity_connections(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE electricity_power_cuts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone VARCHAR(50) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  reason TEXT,
  status ENUM('scheduled', 'ongoing', 'resolved') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =============================================
-- 5. GAS DASHBOARD
-- =============================================
CREATE TABLE gas_connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  gas_no VARCHAR(50) NOT NULL,
  connection_type ENUM('domestic', 'commercial') DEFAULT 'domestic',
  supplier VARCHAR(100),
  status ENUM('active', 'disconnected', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE gas_bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  connection_id INT NOT NULL,
  user_id INT NOT NULL,
  bill_month VARCHAR(7) NOT NULL,
  usage_units DECIMAL(10,2),
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE,
  status ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (connection_id) REFERENCES gas_connections(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE gas_leak_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone VARCHAR(50),
  location TEXT,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  reported_by INT,
  status ENUM('reported', 'investigating', 'resolved') DEFAULT 'reported',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL
);
-- =============================================
-- 6. WATER DASHBOARD (same fields as electricity/gas)
-- =============================================
CREATE TABLE water_connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  connection_no VARCHAR(50) NOT NULL,
  connection_type ENUM('domestic', 'commercial', 'industrial') DEFAULT 'domestic',
  meter_no VARCHAR(50),
  zone VARCHAR(50),
  status ENUM('active', 'disconnected', 'pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE water_bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  connection_id INT NOT NULL,
  user_id INT NOT NULL,
  bill_month VARCHAR(7) NOT NULL,
  units_consumed DECIMAL(10,2),
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE,
  status ENUM('unpaid', 'paid', 'overdue') DEFAULT 'unpaid',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (connection_id) REFERENCES water_connections(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE water_supply_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone VARCHAR(50) NOT NULL,
  supply_status ENUM('normal', 'low_pressure', 'no_supply', 'leakage') DEFAULT 'normal',
  details TEXT,
  start_time DATETIME,
  end_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =============================================
-- 7. WASTE MANAGEMENT
-- =============================================
CREATE TABLE waste_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone_name VARCHAR(50) NOT NULL,
  ward_no VARCHAR(20),
  collection_schedule JSON COMMENT 'e.g. {"monday":"wet","wednesday":"dry","friday":"all"}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE waste_collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  zone_id INT NOT NULL,
  waste_type ENUM('wet', 'dry', 'hazardous', 'e-waste') NOT NULL,
  pickup_date DATE NOT NULL,
  status ENUM('scheduled', 'collected', 'missed') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES waste_zones(id) ON DELETE CASCADE
);
-- =============================================
-- 8. SERVICE REQUESTS (shared for all services)
-- =============================================
CREATE TABLE service_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_type ENUM('electricity', 'gas', 'water', 'waste', 'municipal') NOT NULL,
  request_type ENUM('new_connection', 'maintenance', 'disconnection', 'update', 'other') NOT NULL,
  subject VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  assigned_authority_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_authority_id) REFERENCES authorities(id) ON DELETE SET NULL
);
-- =============================================
-- 9. DOCUMENT VERIFICATION
-- =============================================
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_request_id INT,
  document_type ENUM('adhaar', 'address_proof', 'identity', 'ownership', 'other') NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  original_name VARCHAR(255),
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  remarks TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL
);
-- =============================================
-- 10. COMPLAINTS (Civic Problems)
-- =============================================
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ticket_id VARCHAR(20) UNIQUE NOT NULL,
  category ENUM('street_light', 'pothole', 'broken_road', 'drainage', 'garbage', 'water_leakage', 'other') NOT NULL,
  complaint_type ENUM('personal', 'global') DEFAULT 'personal',
  subject VARCHAR(200) NOT NULL,
  description TEXT,
  location TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_path VARCHAR(500),
  status ENUM('open', 'assigned', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  assigned_authority_id INT,
  assigned_station VARCHAR(150) COMMENT 'Geo-fenced nearest station',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_authority_id) REFERENCES authorities(id) ON DELETE SET NULL
);
CREATE TABLE complaint_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  updated_by INT,
  status ENUM('open', 'assigned', 'in_progress', 'resolved', 'closed') NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);
-- =============================================
-- 11. PAYMENTS (Razorpay)
-- =============================================
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_type ENUM('electricity', 'gas', 'water', 'waste', 'municipal') NOT NULL,
  bill_id INT COMMENT 'References the specific bill table',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('created', 'paid', 'failed', 'refunded') DEFAULT 'created',
  receipt_no VARCHAR(50) UNIQUE,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_service_requests_user ON service_requests(user_id);
CREATE INDEX idx_service_requests_type ON service_requests(service_type);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_ticket ON complaints(ticket_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_order ON payments(razorpay_order_id);
CREATE INDEX idx_electricity_bills_user ON electricity_bills(user_id);
CREATE INDEX idx_gas_bills_user ON gas_bills(user_id);
CREATE INDEX idx_water_bills_user ON water_bills(user_id);
