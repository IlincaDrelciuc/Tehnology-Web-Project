/**
 * User model
 *
 * This model represents application users.
 * Each user can:
 *  - own food items
 *  - create groups
 *  - join groups
 *  - send and receive group invitations
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Define the User table structure
 */
const User = sequelize.define(
  'User',
  {
    /**
     * Primary key
     * Auto-incremented unique identifier for each user
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    /**
     * User email
     * Must be unique and is used for authentication
     */
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    /**
     * User password
     * Stored as a hashed value (never plain text)
     */
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    /**
     * Explicit database table name
     */
    tableName: 'users',

    /**
     * Disable automatic createdAt / updatedAt columns
     */
    timestamps: false
  }
);

module.exports = User;
