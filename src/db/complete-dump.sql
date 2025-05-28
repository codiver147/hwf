
-- MySQL Schema and Data Dump for HWF Donation Management System

-- Disable foreign key checks and set default charset
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- Clear existing data
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS volunteer_skills;
DROP TABLE IF EXISTS inventory_categories;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS request_items;
DROP TABLE IF EXISTS delivery_assignments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS team_skills;
DROP TABLE IF EXISTS request_volunteers;

-- Clients Table
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(191) UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    languages_spoken VARCHAR(255),
    country_of_origin VARCHAR(100),
    status_in_canada VARCHAR(50),
    housing_type VARCHAR(50),
    has_transportation BOOLEAN DEFAULT FALSE,
    number_of_adults INT DEFAULT 1,
    number_of_children INT DEFAULT 0,
    children_ages VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Volunteers Table
CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(191) UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    join_date DATE,
    availability JSON,
    emergency_contact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Volunteer Skills Table
CREATE TABLE volunteer_skills (
    volunteer_id INT,
    skill_id INT,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    PRIMARY KEY (volunteer_id, skill_id),
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Inventory Categories Table
CREATE TABLE inventory_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Inventory Items Table
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    `condition` ENUM('new', 'excellent', 'good', 'fair', 'poor'),
    quantity INT DEFAULT 1,
    location VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    date_received DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES inventory_categories(id)
);

-- Teams Table
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active_requests INT DEFAULT 0,
    completed_requests INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team Members Table
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    volunteer_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
);

-- Team Skills Table
CREATE TABLE team_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    skill_id INT,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Requests Table
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    team_id INT,
    status ENUM('new', 'in progress', 'completed', 'cancelled') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    description TEXT,
    location VARCHAR(255),
    scheduled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Request Items Table
CREATE TABLE request_items (
    request_id INT,
    inventory_item_id INT,
    quantity INT DEFAULT 1,
    status ENUM('requested', 'allocated', 'delivered') DEFAULT 'requested',
    PRIMARY KEY (request_id, inventory_item_id),
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
);

-- Request Volunteers Table
CREATE TABLE request_volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    volunteer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
);

-- Delivery Assignments Table
CREATE TABLE delivery_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    volunteer_id INT,
    scheduled_date DATE,
    completed_date DATE,
    notes TEXT,
    status ENUM('scheduled', 'in progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('admin', 'volunteer', 'team_lead', 'viewer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Data Insertion
INSERT INTO skills (name, description) VALUES 
('Driving', 'Licensed to drive and has access to a vehicle'),
('Translation', 'Ability to translate between multiple languages'),
('Furniture Assembly', 'Experience with assembling furniture'),
('Technology Support', 'Can help set up computers, phones, and other devices'),
('Customer Service', 'Experience in working with people in need');

INSERT INTO inventory_categories (name, description) VALUES 
('Furniture', 'Household furniture items'),
('Kitchen', 'Kitchen items and appliances'),
('Clothing', 'All types of clothing'),
('Electronics', 'Electronic devices'),
('Baby Items', 'Items for babies and young children');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

