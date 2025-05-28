
const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

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

// Get all teams
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teams');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Create new team
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO teams (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Team created successfully' });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE teams SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({ message: 'Team updated successfully' });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

module.exports = router;

