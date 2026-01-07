const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Item = sequelize.define(
  'Item',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    quantity: { type: DataTypes.STRING },
    expiry_date: { type: DataTypes.DATEONLY, allowNull: false },
    is_shareable: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    tableName: 'items',
    timestamps: false
  }
);

module.exports = Item;
