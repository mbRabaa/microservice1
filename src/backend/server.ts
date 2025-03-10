
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to database');
  release();
});

// Routes
app.get('/api/routes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM voyages ORDER BY date, time');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/routes/search', async (req, res) => {
  const { departure, destination, date } = req.query;
  
  try {
    let query = 'SELECT * FROM voyages WHERE 1=1';
    const params = [];
    
    if (departure) {
      params.push(departure);
      query += ` AND departure = $${params.length}`;
    }
    
    if (destination) {
      params.push(destination);
      query += ` AND destination = $${params.length}`;
    }
    
    if (date) {
      params.push(date);
      query += ` AND date = $${params.length}`;
    }
    
    query += ' ORDER BY date, time';
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
