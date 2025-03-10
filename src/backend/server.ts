
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '../database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('TunisBus API is running!');
});

// Get all routes
app.get('/api/routes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM voyages ORDER BY date, time');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new route
app.post('/api/routes', async (req, res) => {
  try {
    const { departure, destination, date, time, price, available_seats, duration } = req.body;
    
    const result = await pool.query(
      'INSERT INTO voyages (departure, destination, date, time, price, available_seats, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [departure, destination, date, time, price, available_seats, duration]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a route
app.put('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { departure, destination, date, time, price, available_seats, duration } = req.body;
    
    const result = await pool.query(
      'UPDATE voyages SET departure = $1, destination = $2, date = $3, time = $4, price = $5, available_seats = $6, duration = $7 WHERE id = $8 RETURNING *',
      [departure, destination, date, time, price, available_seats, duration, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a route
app.delete('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM voyages WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
