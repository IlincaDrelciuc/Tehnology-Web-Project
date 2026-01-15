// backend/database.js
// This file creates the Sequelize database connection.
//
// ✅ Locally: we use SQLite (easy, no setup needed).
// ✅ On Render: we use Postgres via DATABASE_URL (data persists without a paid disk).

const { Sequelize } = require('sequelize');

// If DATABASE_URL exists, we assume we are running in production (Render with Postgres).
const isProduction = Boolean(process.env.DATABASE_URL);

let sequelize;

if (isProduction) {
  // Render Postgres uses a connection string in DATABASE_URL.
  // Render also requires SSL, so we enable it here.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local development database (SQLite file)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './app_db.sqlite',
    logging: false
  });
}

module.exports = sequelize;
