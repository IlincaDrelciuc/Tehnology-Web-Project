/**
 * GroupMember model
 *
 * This model represents the membership of a user inside a group.
 * It links users to groups and optionally stores a food preference
 * label for that user (e.g. vegetarian, lactose-free).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Define the GroupMember table structure
 */
const GroupMember = sequelize.define(
  'GroupMember',
  {
    /**
     * Primary key
     * Unique identifier for each group membership
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    /**
     * ID of the group the user belongs to
     */
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * ID of the user who is a member of the group
     */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * Optional label describing the user's food preferences
     * (e.g. "vegetarian", "no sugar", "gluten-free")
     */
    preference_label: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    /**
     * Explicit database table name
     */
    tableName: 'group_members',

    /**
     * Disable automatic createdAt / updatedAt columns
     */
    timestamps: false
  }
);

module.exports = GroupMember;
