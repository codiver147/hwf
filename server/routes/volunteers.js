
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

// Middleware to verify authentication token
const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    // Extract token from "Bearer <token>"
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    // Verify token (in a real app, you would validate JWT or other token format)
    if (token) {
      req.token = token;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token format' });
    }
  } else {
    // If no auth header
    console.log('No auth header provided');
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Get all volunteers with skills - apply auth middleware
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Fetching all volunteers from database');
    // First get volunteers
    const [volunteers] = await pool.query(`
      SELECT * FROM volunteers
    `);

    // Get skills for each volunteer
    for (const volunteer of volunteers) {
      const [skills] = await pool.query(`
        SELECT s.name 
        FROM volunteer_skills vs
        JOIN skills s ON vs.skill_id = s.id
        WHERE vs.volunteer_id = ?
      `, [volunteer.id]);
      
      // Add skills array to volunteer object
      volunteer.skills = skills.map(skill => skill.name);
      
      // Parse availability JSON if it exists
      if (volunteer.availability && typeof volunteer.availability === 'string') {
        try {
          volunteer.availability = JSON.parse(volunteer.availability);
        } catch (e) {
          console.error('Error parsing availability JSON:', e);
          volunteer.availability = {};
        }
      }
    }
    
    console.log(`Retrieved ${volunteers.length} volunteers with their skills`);
    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// Get volunteer by ID with skills - apply auth middleware
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // First get volunteer
    const [volunteerRows] = await pool.query('SELECT * FROM volunteers WHERE id = ?', [req.params.id]);
    
    if (volunteerRows.length === 0) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    
    const volunteer = volunteerRows[0];
    
    // Then get skills
    const [skills] = await pool.query(`
      SELECT s.name, s.id
      FROM volunteer_skills vs
      JOIN skills s ON vs.skill_id = s.id
      WHERE vs.volunteer_id = ?
    `, [volunteer.id]);
    
    // Add skills array to volunteer object
    volunteer.skills = skills.map(skill => skill.name);
    volunteer.skill_ids = skills.map(skill => skill.id);
    
    // Parse availability JSON if it exists
    if (volunteer.availability && typeof volunteer.availability === 'string') {
      try {
        volunteer.availability = JSON.parse(volunteer.availability);
      } catch (e) {
        console.error('Error parsing availability JSON:', e);
        volunteer.availability = {};
      }
    }
    
    res.json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer' });
  }
});

// Create new volunteer with skills
router.post('/', verifyToken, async (req, res) => {
  const { 
    first_name, last_name, email, phone, address, is_active, join_date, availability, skills
  } = req.body;

  // Start transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Insert volunteer
    const [result] = await connection.query(
      `INSERT INTO volunteers 
       (first_name, last_name, email, phone, address, is_active, join_date, availability)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, address, is_active, join_date, 
       availability ? JSON.stringify(availability) : null]
    );
    
    const volunteerId = result.insertId;
    
    // If skills provided, insert into volunteer_skills
    if (skills && Array.isArray(skills) && skills.length > 0) {
      // Get all skill IDs from names
      const skillValues = skills.map(name => [volunteerId, name]);
      
      // Insert skills for volunteer
      for (const [volunteer_id, skill_name] of skillValues) {
        // First, find the skill ID from the name
        const [skillRows] = await connection.query(
          'SELECT id FROM skills WHERE name = ?',
          [skill_name]
        );
        
        if (skillRows.length > 0) {
          const skill_id = skillRows[0].id;
          // Insert into volunteer_skills
          await connection.query(
            'INSERT INTO volunteer_skills (volunteer_id, skill_id) VALUES (?, ?)',
            [volunteer_id, skill_id]
          );
        }
      }
    }
    
    await connection.commit();
    res.status(201).json({ id: volunteerId, message: 'Volunteer created successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating volunteer:', error);
    res.status(500).json({ error: 'Failed to create volunteer' });
  } finally {
    connection.release();
  }
});

// Update volunteer with skills
router.put('/:id', verifyToken, async (req, res) => {
  const { 
    first_name, last_name, email, phone, address, is_active, join_date, availability, skills
  } = req.body;

  // Start transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update volunteer
    const [result] = await connection.query(
      `UPDATE volunteers SET 
       first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, 
       is_active = ?, join_date = ?, availability = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone, address, is_active, join_date, 
       availability ? JSON.stringify(availability) : null, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    
    // If skills provided, update volunteer_skills
    if (skills && Array.isArray(skills)) {
      // First, delete all existing skills for this volunteer
      await connection.query(
        'DELETE FROM volunteer_skills WHERE volunteer_id = ?',
        [req.params.id]
      );
      
      // Then insert new skills
      if (skills.length > 0) {
        for (const skill_name of skills) {
          // Find the skill ID from the name
          const [skillRows] = await connection.query(
            'SELECT id FROM skills WHERE name = ?',
            [skill_name]
          );
          
          if (skillRows.length > 0) {
            const skill_id = skillRows[0].id;
            // Insert into volunteer_skills
            await connection.query(
              'INSERT INTO volunteer_skills (volunteer_id, skill_id) VALUES (?, ?)',
              [req.params.id, skill_id]
            );
          }
        }
      }
    }
    
    await connection.commit();
    res.json({ message: 'Volunteer updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating volunteer:', error);
    res.status(500).json({ error: 'Failed to update volunteer' });
  } finally {
    connection.release();
  }
});

// Delete volunteer
router.delete('/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // First delete from volunteer_skills
    await connection.query('DELETE FROM volunteer_skills WHERE volunteer_id = ?', [req.params.id]);
    
    // Then delete volunteer
    const [result] = await connection.query('DELETE FROM volunteers WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    
    await connection.commit();
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ error: 'Failed to delete volunteer' });
  } finally {
    connection.release();
  }
});

module.exports = router;
