require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SQL Backend API is running',
    version: '1.0.0',
    endpoints: {
      ac: '/api/ac',
      actions: '/api/actions',
      chqdetails: '/api/chqdetails',
      members: '/api/members',
      transactions: '/api/transactions',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (use { alter: true } in dev to auto-update schema)
    // await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();
