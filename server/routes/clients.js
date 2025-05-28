
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

// Get all clients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  const { 
    first_name, last_name, email, phone, address, city, postal_code, 
    languages_spoken, country_of_origin, status_in_canada, housing_type,
    has_transportation, number_of_adults, number_of_children, children_ages
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO clients 
       (first_name, last_name, email, phone, address, city, postal_code, 
        languages_spoken, country_of_origin, status_in_canada, housing_type,
        has_transportation, number_of_adults, number_of_children, children_ages)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, address, city, postal_code, 
       languages_spoken, country_of_origin, status_in_canada, housing_type,
       has_transportation, number_of_adults, number_of_children, children_ages]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Client created successfully' });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    // Log received data
    console.log('Update client request body:', req.body);
    
    // First get current client data
    const [currentClientRows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    
    if (currentClientRows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const currentClient = currentClientRows[0];
    
    // Extract fields from request body, using current values as fallbacks
    const { 
      first_name = currentClient.first_name, 
      last_name = currentClient.last_name, 
      email = currentClient.email, 
      phone = currentClient.phone, 
      address = currentClient.address, 
      city = currentClient.city, 
      postal_code = currentClient.postal_code, 
      languages_spoken = currentClient.languages_spoken, 
      country_of_origin = currentClient.country_of_origin, 
      status_in_canada = currentClient.status_in_canada, 
      housing_type = currentClient.housing_type,
      has_transportation = currentClient.has_transportation, 
      number_of_adults = currentClient.number_of_adults, 
      number_of_children = currentClient.number_of_children, 
      children_ages = currentClient.children_ages
    } = req.body;

    // Log what will be updated
    console.log('Updating client with data:', {
      first_name, last_name, email, phone, address, city, postal_code,
      languages_spoken, country_of_origin, status_in_canada, housing_type,
      has_transportation, number_of_adults, number_of_children, children_ages
    });

    const [result] = await pool.query(
      `UPDATE clients SET 
       first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, city = ?, postal_code = ?,
       languages_spoken = ?, country_of_origin = ?, status_in_canada = ?, housing_type = ?,
       has_transportation = ?, number_of_adults = ?, number_of_children = ?, children_ages = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone, address, city, postal_code, 
       languages_spoken, country_of_origin, status_in_canada, housing_type,
       has_transportation, number_of_adults, number_of_children, children_ages, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;
