/**
 * Group model
 *
 * This model represents a group of friends created by a user.
 * Groups are used to share food items with specific people
 * instead of making them public.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Define the Group table structure
 */
const Group = sequelize.define(
  'Group',
  {
    /**
     * Primary key
     * Unique identifier for each group
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    /**
     * ID of the user who owns the group
     * Only the owner can invite other users
     */
    owner_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * Name of the group (e.g. "Family", "Gym friends")
     */
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    /**
     * Explicit database table name
     */
    tableName: 'groups',

    /**
     * Disable automatic createdAt / updatedAt columns
     */
    timestamps: false
  }
);

module.exports = Group;
