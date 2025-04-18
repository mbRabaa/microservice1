import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import promClient from 'prom-client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'db-host',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'tunisbus',
  password: process.env.DB_PASSWORD || '0000',
  database: process.env.DB_NAME || 'gestion_trajet_db'
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database successfully');
    release();
  }
});

// Routes
app.get('/api/routes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routes');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'An error occurred while fetching routes' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end('Error generating metrics');
  }
});

// Endpoint de santé simplifié
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});