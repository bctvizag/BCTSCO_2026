const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry conflict',
        error: err.meta?.target || err.message,
      });
    }

    if (['P2003', 'P2014'].includes(err.code)) {
      return res.status(409).json({
        success: false,
        message: 'Related record constraint failed',
        error: err.message,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        error: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Database error',
      error: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
