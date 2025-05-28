
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

// Get all requests with client and team information
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, 
        CONCAT(c.first_name, ' ', c.last_name) AS client_name,
        t.name AS team_name
      FROM requests r
      LEFT JOIN clients c ON r.client_id = c.id
      LEFT JOIN teams t ON r.team_id = t.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get request by ID with details
router.get('/:id', async (req, res) => {
  try {
    // Get request info
    const [requestRows] = await pool.query(`
      SELECT r.*, 
        CONCAT(c.first_name, ' ', c.last_name) AS client_name,
        t.name AS team_name 
      FROM requests r
      LEFT JOIN clients c ON r.client_id = c.id
      LEFT JOIN teams t ON r.team_id = t.id
      WHERE r.id = ?
    `, [req.params.id]);
    
    if (requestRows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Get requested items
    const [itemRows] = await pool.query(`
      SELECT ri.*, i.name AS item_name, i.description, i.condition, 
        ic.name AS category_name
      FROM request_items ri
      JOIN inventory_items i ON ri.inventory_item_id = i.id
      LEFT JOIN inventory_categories ic ON i.category_id = ic.id
      WHERE ri.request_id = ?
    `, [req.params.id]);
    
    // Get delivery assignments
    const [deliveryRows] = await pool.query(`
      SELECT da.*, CONCAT(v.first_name, ' ', v.last_name) AS volunteer_name
      FROM delivery_assignments da
      LEFT JOIN volunteers v ON da.volunteer_id = v.id
      WHERE da.request_id = ?
    `, [req.params.id]);
    
    // Combine all data
    const requestData = {
      ...requestRows[0],
      items: itemRows,
      deliveries: deliveryRows
    };
    
    res.json(requestData);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Create new request
router.post('/', async (req, res) => {
  const { client_id, team_id, status, priority, description, items = [] } = req.body;

  // Start transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Create request
    const [requestResult] = await connection.query(
      `INSERT INTO requests (client_id, team_id, status, priority, description)
       VALUES (?, ?, ?, ?, ?)`,
      [client_id, team_id, status, priority, description]
    );
    
    const requestId = requestResult.insertId;
    
    // Add requested items
    if (items.length > 0) {
      const itemValues = items.map(item => [
        requestId, 
        item.inventory_item_id, 
        item.quantity || 1, 
        item.status || 'requested'
      ]);
      
      await connection.query(
        `INSERT INTO request_items (request_id, inventory_item_id, quantity, status)
         VALUES ?`,
        [itemValues]
      );
    }
    
    await connection.commit();
    res.status(201).json({ 
      id: requestId, 
      message: 'Request created successfully' 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  } finally {
    connection.release();
  }
});

// Update request
router.put('/:id', async (req, res) => {
  const { status, priority, description, team_id } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE requests 
       SET status = ?, priority = ?, description = ?, team_id = ?
       WHERE id = ?`,
      [status, priority, description, team_id, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Delete request
router.delete('/:id', async (req, res) => {
  // Start transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Delete associated delivery assignments
    await connection.query('DELETE FROM delivery_assignments WHERE request_id = ?', [req.params.id]);
    
    // Delete associated request items
    await connection.query('DELETE FROM request_items WHERE request_id = ?', [req.params.id]);
    
    // Delete the request
    const [result] = await connection.query('DELETE FROM requests WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Request not found' });
    }
    
    await connection.commit();
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  } finally {
    connection.release();
  }
});

module.exports = router;
