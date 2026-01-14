const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const GroupInvite = sequelize.define(
  'GroupInvite',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: { type: DataTypes.INTEGER, allowNull: false },
    inviter_user_id: { type: DataTypes.INTEGER, allowNull: false },
    invited_user_id: { type: DataTypes.INTEGER, allowNull: false },
    preference_label: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    tableName: 'group_invites',
    timestamps: false
  }
);

module.exports = GroupInvite;
