
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './app_db.sqlite',
  logging: false
});

module.exports = sequelize;
