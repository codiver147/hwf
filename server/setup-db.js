
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;

  try {
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4', // Add explicit charset
    });
    
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'hwf_donation_system'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${process.env.DB_NAME || 'hwf_donation_system'}' created or already exists`);
    
    // Close connection
    await connection.end();
    
    // Reconnect with database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hwf_donation_system',
      multipleStatements: true, // Allow multiple statements in one query
      charset: 'utf8mb4' // Add explicit charset
    });
    
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'src', 'db', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    console.log('Creating database tables...');
    await connection.query(schemaSQL);
    console.log('Database tables created successfully');
    
    // Ask if we should load sample data
    if (process.argv.includes('--with-sample-data')) {
      const sampleDataPath = path.join(__dirname, '..', 'src', 'db', 'sample-data.sql');
      if (fs.existsSync(sampleDataPath)) {
        const sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8');
        console.log('Loading sample data...');
        await connection.query(sampleDataSQL);
        console.log('Sample data loaded successfully');
      } else {
        console.log('Sample data file not found');
      }
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    
    // More detailed error information
    if (error.code === 'ER_TOO_LONG_KEY') {
      console.error('This error is related to index key length being too long.');
      console.error('Try using a smaller VARCHAR size for indexed columns or specify a shorter key length in the index.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
