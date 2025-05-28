
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

// Get all skills
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get volunteer skills - Route qui récupère les compétences par volontaire
router.get('/volunteer', async (req, res) => {
  try {
    console.log('Fetching volunteer skills from database');
    const [rows] = await pool.query(`
      SELECT vs.volunteer_id, vs.skill_id, vs.proficiency_level, s.name AS skill_name 
      FROM volunteer_skills vs
      LEFT JOIN skills s ON vs.skill_id = s.id
    `);
    console.log(`Retrieved ${rows.length} volunteer skill entries`);
    console.log('Sample volunteer skills:', rows.slice(0, 3));
    res.json(rows);
  } catch (error) {
    console.error('Error fetching volunteer skills:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer skills' });
  }
});

// Get skill by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

// Create new skill
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO skills (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Skill created successfully' });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Update skill
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE skills SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

module.exports = router;
