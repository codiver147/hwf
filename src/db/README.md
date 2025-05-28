
# Database Integration Guide

This folder contains the schema and instructions for setting up a MySQL database for the HWF Donation Management System.

## MySQL Integration

To use MySQL with this application:

1. Set up a MySQL server (locally or using a cloud provider)
2. Create a database for the application
3. Run the schema.sql file to create all necessary tables
4. Configure your connection in a .env file (see below)

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hwf_donation_system
DB_USER=your_username
DB_PASSWORD=your_password
```

## Supabase Alternative

This application can also be configured to use Supabase instead of MySQL:

1. Create a Supabase project
2. Set up tables following a similar structure to the MySQL schema
3. Configure your Supabase connection in the .env file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

## Switching Between Databases

The application's data service layer is designed to be adaptable. To switch between MySQL and Supabase:

1. Update your .env file with the appropriate credentials
2. Configure the data service to use the desired database provider
