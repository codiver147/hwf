
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

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, c.name as category_name 
      FROM inventory_items i
      LEFT JOIN inventory_categories c ON i.category_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// Get inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, c.name as category_name 
      FROM inventory_items i
      LEFT JOIN inventory_categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

// Create new inventory item
router.post('/', async (req, res) => {
  const { 
    category_id, name, description, condition, quantity, location, is_available, date_received
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO inventory_items 
       (category_id, name, description, condition, quantity, location, is_available, date_received)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, description, condition, quantity, location, is_available, date_received]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Inventory item created successfully' });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  const { 
    category_id, name, description, condition, quantity, location, is_available, date_received
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE inventory_items SET 
       category_id = ?, name = ?, description = ?, condition = ?, 
       quantity = ?, location = ?, is_available = ?, date_received = ?
       WHERE id = ?`,
      [category_id, name, description, condition, quantity, location, is_available, date_received, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM inventory_items WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory_categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
