import express from 'express';
import cors from 'cors';
import mssql from 'mssql';

const app = express();

app.use(cors());
app.use(express.json());

// MSSQL Configuration
// MSSQL Configuration
const mssqlConfig = {
  server: 'localhost\\SQLEXPRESS',
  database: 'SOCRJY',
  user: 'sa',
  password: 'pcsc@2024',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await mssql.connect(mssqlConfig);
  }
  return pool;
}

// Execute SQL Query endpoint
app.post('/execute', async (req, res) => {
  const { sql } = req.body;

  if (!sql || sql.trim() === '') {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  try {
    const pool = await getPool();
    const result = await pool.request().query(sql);

    const rows = result.recordset;
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    res.json({
      success: true,
      columns,
      rows,
      rowCount: rows.length,
    });
  } catch (error) {
    console.error('SQL execution error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR',
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test connection endpoint
app.get('/test-connection', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 as test');
    res.json({
      success: true,
      message: 'Connected to MS SQL Server successfully',
      server: mssqlConfig.server,
      database: mssqlConfig.database
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to connect to MS SQL Server'
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`SQL Query Server running on port ${PORT}`);
  console.log(`MSSQL Target: ${mssqlConfig.server}/${mssqlConfig.database}`);
});

export default app;
