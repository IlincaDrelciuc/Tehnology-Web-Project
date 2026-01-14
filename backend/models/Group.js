const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Group = sequelize.define(
  'Group',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    owner_user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false }
  },
  {
    tableName: 'groups',
    timestamps: false
  }
);

module.exports = Group;
