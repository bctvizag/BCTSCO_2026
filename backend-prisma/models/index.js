// Prisma replaces Sequelize model definitions.
// Import the shared Prisma Client from this file so controllers can keep
// a model-oriented structure similar to the original Sequelize project.
const prisma = require('../config/database');

module.exports = prisma;
