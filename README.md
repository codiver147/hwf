
# HWF Donation Management System

This application helps manage donations for the HWF organization, including client, volunteer, and inventory management.

## Setup Instructions

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the frontend application:
   ```
   npm run dev
   ```

### Database Setup

1. Install MySQL on your system if you haven't already
   - For Windows: Download and install from [MySQL website](https://dev.mysql.com/downloads/installer/)
   - For Mac: `brew install mysql`
   - For Ubuntu: `sudo apt install mysql-server`

2. Start MySQL service:
   - Windows: It usually starts automatically after installation
   - Mac: `brew services start mysql`
   - Ubuntu: `sudo systemctl start mysql`

3. Create the database and tables:
   ```
   mysql -u root -p
   ```
   
   Then in the MySQL prompt:
   ```
   CREATE DATABASE hwf_donation_system;
   USE hwf_donation_system;
   ```

4. Run the SQL schema script to create tables:
   ```
   mysql -u root -p hwf_donation_system < src/db/schema.sql
   ```

5. (Optional) Load sample data:
   ```
   mysql -u root -p hwf_donation_system < src/db/sample-data.sql
   ```

### Backend Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install server dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=hwf_donation_system
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Application Structure

- Frontend: React with TypeScript, Tailwind CSS, and Shadcn UI
- Backend: Node.js with Express
- Database: MySQL

## Available API Endpoints

### Clients
- GET /api/clients - Get all clients
- GET /api/clients/:id - Get client by ID
- POST /api/clients - Create new client
- PUT /api/clients/:id - Update client
- DELETE /api/clients/:id - Delete client

### Volunteers
- GET /api/volunteers - Get all volunteers
- GET /api/volunteers/:id - Get volunteer by ID
- POST /api/volunteers - Create new volunteer
- PUT /api/volunteers/:id - Update volunteer
- DELETE /api/volunteers/:id - Delete volunteer

### Inventory
- GET /api/inventory - Get all inventory items
- GET /api/inventory/:id - Get inventory item by ID
- POST /api/inventory - Create new inventory item
- PUT /api/inventory/:id - Update inventory item
- DELETE /api/inventory/:id - Delete inventory item
- GET /api/inventory/categories/all - Get all categories

### Teams
- GET /api/teams - Get all teams
- GET /api/teams/:id - Get team by ID
- POST /api/teams - Create new team
- PUT /api/teams/:id - Update team
- DELETE /api/teams/:id - Delete team

### Requests
- GET /api/requests - Get all requests
- GET /api/requests/:id - Get request by ID
- POST /api/requests - Create new request
- PUT /api/requests/:id - Update request
- DELETE /api/requests/:id - Delete request

### Database Testing
- GET /api/test-db - Test database connection

## Data Models

### Client
- id: Unique identifier
- first_name: Client's first name
- last_name: Client's last name
- email: Client's email address
- phone: Client's phone number
- address: Client's street address
- city: Client's city
- postal_code: Client's postal code
- languages_spoken: Languages client can speak
- country_of_origin: Client's country of origin
- status_in_canada: Immigration status
- housing_type: Type of housing
- has_transportation: Whether client has transportation
- number_of_adults: Number of adults in household
- number_of_children: Number of children in household
- children_ages: Ages of children (comma-separated)

### Volunteer
- id: Unique identifier
- first_name: Volunteer's first name
- last_name: Volunteer's last name
- email: Volunteer's email address
- phone: Volunteer's phone number
- address: Volunteer's address
- is_active: Whether volunteer is currently active
- join_date: When volunteer joined
- availability: JSON object with volunteer's availability
- skills: Skills the volunteer has (through junction table)

### Inventory Item
- id: Unique identifier
- category_id: Category of the item
- name: Item name
- description: Item description
- condition: Condition of the item
- quantity: Number of this item available
- location: Where the item is stored
- is_available: Whether the item is available
- date_received: When the item was received
