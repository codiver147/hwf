
-- Sample data for HWF Donation Management System

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE clients;
TRUNCATE TABLE volunteers;
TRUNCATE TABLE skills;
TRUNCATE TABLE volunteer_skills;
TRUNCATE TABLE inventory_categories;
TRUNCATE TABLE inventory_items;
TRUNCATE TABLE teams;
TRUNCATE TABLE requests;
TRUNCATE TABLE request_items;
TRUNCATE TABLE delivery_assignments;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert sample clients
INSERT INTO clients (first_name, last_name, email, phone, address, city, postal_code, languages_spoken, country_of_origin, status_in_canada, housing_type, has_transportation, number_of_adults, number_of_children, children_ages) VALUES 
('Maria', 'Rodriguez', 'maria.rodriguez@example.com', '(613) 555-1234', '123 Main St', 'Ottawa', 'K1P 1J1', 'Spanish, English', 'Colombia', 'Permanent Resident', 'Apartment', false, 2, 3, '2, 5, 7'),
('Ahmed', 'Hassan', 'ahmed.hassan@example.com', '(613) 555-2345', '456 Elm St', 'Ottawa', 'K2P 2K2', 'Arabic, English', 'Syria', 'Refugee', 'Townhouse', false, 2, 2, '3, 6'),
('Li', 'Wei', 'li.wei@example.com', '(613) 555-3456', '789 Oak St', 'Ottawa', 'K1S 5B5', 'Mandarin, English', 'China', 'Student Visa', 'Basement Apartment', false, 1, 0, ''),
('Olga', 'Petrov', 'olga.petrov@example.com', '(613) 555-4567', '321 Pine St', 'Ottawa', 'K2C 3L3', 'Russian, English', 'Ukraine', 'Temporary Resident', 'Apartment', true, 3, 1, '12');

-- Insert sample volunteers
INSERT INTO volunteers (first_name, last_name, email, phone, address, is_active, join_date, availability) VALUES 
('John', 'Smith', 'john.smith@example.com', '(613) 555-5678', '234 Maple St, Ottawa', true, '2023-01-15', '{"monday": "morning", "wednesday": "afternoon", "saturday": "all-day"}'),
('Sarah', 'Johnson', 'sarah.johnson@example.com', '(613) 555-6789', '567 Cedar St, Ottawa', true, '2023-02-22', '{"tuesday": "evening", "thursday": "morning", "sunday": "all-day"}'),
('Michael', 'Brown', 'michael.brown@example.com', '(613) 555-7890', '890 Birch St, Ottawa', true, '2023-03-10', '{"monday": "evening", "friday": "all-day"}'),
('Emily', 'Davis', 'emily.davis@example.com', '(613) 555-8901', '432 Walnut St, Ottawa', false, '2023-04-05', '{"wednesday": "evening", "saturday": "morning"}');

-- Insert sample skills
INSERT INTO skills (name, description) VALUES 
('Driving', 'Licensed to drive and has access to a vehicle'),
('Translation', 'Ability to translate between multiple languages'),
('Furniture Assembly', 'Experience with assembling furniture'),
('Technology Support', 'Can help set up computers, phones, and other devices'),
('Customer Service', 'Experience in working with people in need');

-- Connect volunteers with skills
INSERT INTO volunteer_skills (volunteer_id, skill_id, proficiency_level) VALUES 
(1, 1, 'expert'),
(1, 3, 'intermediate'),
(2, 2, 'advanced'),
(2, 5, 'expert'),
(3, 3, 'advanced'),
(3, 4, 'intermediate'),
(4, 2, 'intermediate'),
(4, 5, 'advanced');

-- Insert inventory categories
INSERT INTO inventory_categories (name, description) VALUES 
('Furniture', 'Household furniture items like beds, tables, chairs, etc.'),
('Kitchen', 'Kitchen items including appliances, cookware, and utensils'),
('Clothing', 'All types of clothing for adults and children'),
('Electronics', 'Electronic devices like computers, phones, TVs, etc.'),
('Baby Items', 'Items for babies and young children like cribs, strollers, etc.');

-- Insert inventory items
INSERT INTO inventory_items (category_id, name, description, condition, quantity, location, is_available, date_received) VALUES 
(1, 'Double Bed Frame', 'Wooden bed frame for a double mattress', 'good', 2, 'Warehouse A3', true, '2023-06-10'),
(1, 'Dining Table', 'Wooden dining table with 4 chairs', 'excellent', 1, 'Warehouse B2', true, '2023-06-15'),
(2, 'Microwave Oven', 'Standard microwave oven in working condition', 'good', 3, 'Warehouse C1', true, '2023-06-20'),
(2, 'Cooking Pot Set', 'Set of 3 cooking pots with lids', 'excellent', 5, 'Warehouse C2', true, '2023-06-25'),
(3, 'Winter Jackets', 'Adult winter jackets, various sizes', 'good', 10, 'Warehouse D1', true, '2023-07-05'),
(3, 'Children\'s Clothes', 'Assorted children\'s clothing (ages 2-10)', 'excellent', 20, 'Warehouse D2', true, '2023-07-10'),
(4, 'Laptop Computer', 'Used laptop computers in working condition', 'fair', 5, 'Warehouse E1', true, '2023-07-15'),
(5, 'Baby Crib', 'Wooden baby crib with mattress', 'good', 2, 'Warehouse F1', true, '2023-07-20');

-- Insert teams
INSERT INTO teams (name, description) VALUES 
('Delivery Team', 'Responsible for delivering items to clients'),
('Intake Team', 'Handles initial client registration and assessment'),
('Warehouse Team', 'Manages inventory and warehouse operations'),
('Support Team', 'Provides ongoing support to clients after initial setup');

-- Insert sample requests
INSERT INTO requests (client_id, team_id, status, priority, description) VALUES 
(1, 2, 'new', 'medium', 'New arrival family needs basic household items'),
(2, 1, 'in progress', 'high', 'Refugee family needs urgent furniture delivery'),
(3, 4, 'completed', 'low', 'Student needs help setting up computer for online classes'),
(4, 3, 'in progress', 'medium', 'Family needs winter clothing before the cold season');

-- Connect requests with inventory items
INSERT INTO request_items (request_id, inventory_item_id, quantity, status) VALUES 
(1, 2, 1, 'allocated'),
(1, 4, 1, 'allocated'),
(2, 1, 1, 'allocated'),
(2, 7, 1, 'requested'),
(3, 7, 1, 'delivered'),
(4, 5, 3, 'allocated');

-- Insert delivery assignments
INSERT INTO delivery_assignments (request_id, volunteer_id, scheduled_date, status) VALUES 
(1, 1, '2023-08-25', 'scheduled'),
(2, 3, '2023-08-20', 'in progress'),
(3, 4, '2023-08-15', 'completed');

-- Insert admin users
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES 
('admin@hwf.org', '$2b$10$rQmA1YgJQCQ3QYhpAZ7g8ekVwJuLE4Pu2ZebEwJQXNZ5rHbxT5V1y', 'Admin', 'User', 'admin', true),
('volunteer@hwf.org', '$2b$10$rQmA1YgJQCQ3QYhpAZ7g8ekVwJuLE4Pu2ZebEwJQXNZ5rHbxT5V1y', 'Volunteer', 'User', 'volunteer', true);
