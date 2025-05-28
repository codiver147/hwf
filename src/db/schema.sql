
-- MySQL Schema for HWF Donation Management System

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Volunteer Skills (Junction Table)
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
    description TEXT
);

-- Requests Table
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    team_id INT,
    status ENUM('new', 'in progress', 'completed', 'cancelled') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Request Items (Junction Table)
CREATE TABLE request_items (
    request_id INT,
    inventory_item_id INT,
    quantity INT DEFAULT 1,
    status ENUM('requested', 'allocated', 'delivered') DEFAULT 'requested',
    PRIMARY KEY (request_id, inventory_item_id),
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id)
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

-- Users Table (for authentication)
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

-- Add indexes for performance
CREATE INDEX idx_clients_email ON clients(email(191));
CREATE INDEX idx_volunteers_email ON volunteers(email(191));
CREATE INDEX idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX idx_requests_client ON requests(client_id);
CREATE INDEX idx_requests_team ON requests(team_id);
CREATE INDEX idx_requests_status ON requests(status);
