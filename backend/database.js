/**
 * database.js
 * This file configures and exports the Sequelize database connection.
 * The application uses SQLite as a relational database for simplicity.
 */

const { Sequelize } = require('sequelize');

/**
 * Create a new Sequelize instance.
 * - dialect: specifies the type of database (SQLite)
 * - storage: path to the SQLite database file
 * - logging: disabled to keep console output clean
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './app_db.sqlite',
  logging: false
});

// Export the Sequelize instance so it can be used by models
module.exports = sequelize;
