/**
 * Global error handler middleware.
 * Catches errors passed via next(error) from any route/controller.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry conflict',
      errors: messages,
    });
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Database error',
      error: err.original ? err.original.message : err.message,
    });
  }

  // Sequelize connection error
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    });
  }

  // Generic server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
