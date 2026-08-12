require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const prisma = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SQL Backend API (Prisma) is running',
    version: '1.0.0',
    orm: 'Prisma',
    endpoints: {
      ac: '/api/ac',
      actions: '/api/actions',
      chqdetails: '/api/chqdetails',
      members: '/api/members',
      transactions: '/api/transactions',
      transDesc: '/api/transDesc',
    },
  });
});

app.get('/health/db', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    res.json({ success: true, database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log('Database connection established successfully.');

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
