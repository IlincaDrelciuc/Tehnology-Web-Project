const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const GroupMember = sequelize.define(
  'GroupMember',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    preference_label: { type: DataTypes.STRING, allowNull: true }
  },
  {
    tableName: 'group_members',
    timestamps: false
  }
);

module.exports = GroupMember;
