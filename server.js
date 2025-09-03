
require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;

// PostgreSQL client setup
// IMPORTANTE: Para Cloud SQL, puede que necesite configurar SSL para una conexión IP directa,
// o usar el Cloud SQL Proxy para conexiones desde servicios como Cloud Run.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  // Para Cloud Run con Cloud SQL Proxy, comente las líneas de host/port y descomente esta:
  // host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});

// Probar la conexión a la base de datos al iniciar
pool.connect()
  .then(client => {
    console.log("Conexión a Postgres exitosa");
    client.release();
  })
  .catch(err => console.error("Error al conectar a Postgres:", err.stack));

// API healthcheck endpoint to verify database connection
app.get('/api/healthcheck', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ 
      status: 'ok', 
      db_time: result.rows[0].now,
      message: 'Backend is running and connected to PostgreSQL.'
    });
  } catch (err) {
    console.error('Database connection error', err.stack);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to connect to the database.',
      error: err.message
    });
  }
});


// Middleware to parse JSON bodies
app.use(express.json()); 

// TODO: Add API routes for patients, staff, etc. here
// Example:
// app.get('/api/patients', async (req, res) => { /* ... query the database ... */ });
// app.post('/api/patients', async (req, res) => { /* ... insert into the database ... */ });

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, serve the index.html file (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});