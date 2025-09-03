import 'dotenv/config';
import express from 'express';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 8080;

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  // Para Cloud SQL con conexión privada:
  // host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});

// Verificar conexión a la base de datos
pool.connect()
  .then(client => {
    console.log('Conexión a Postgres exitosa');
    client.release();
  })
  .catch(err => console.error('Error al conectar a Postgres:', err.stack));

// Endpoint de prueba
app.get('/api/healthcheck', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({
      status: 'ok',
      db_time: result.rows[0].now,
      message: 'Backend conectado a PostgreSQL',
    });
  } catch (err) {
    console.error('Error en healthcheck:', err.stack);
    res.status(500).json({ status: 'error', message: 'No se pudo conectar a la base de datos' });
  }
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'build')));

// Para cualquier otra ruta, devolver index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
