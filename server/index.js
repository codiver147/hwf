
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hwf_donation_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

// Routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/skills', require('./routes/skills'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const path = require('path');

// ✅ Corriger le chemin pour aller dans le dossier parent (../dist)
const distPath = path.join(__dirname, '..', 'dist');

// ✅ Servir les fichiers statiques buildés par Vite
app.use(express.static(distPath));

// ✅ Rediriger toutes les routes (React Router) vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

