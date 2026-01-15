/**
 * Item model
 *
 * This model represents a food item stored in a user's fridge.
 * Items can optionally be marked as shareable and claimed by other users.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Define the Item table structure
 */
const Item = sequelize.define(
  'Item',
  {
    /**
     * Primary key
     * Unique identifier for each item
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    /**
     * ID of the user who currently owns the item
     */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * Name of the food item (e.g. Milk, Bread)
     */
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /**
     * Optional category for grouping items (e.g. Dairy, Vegetables)
     */
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },

    /**
     * Optional quantity or description (e.g. 2 bottles, 500g)
     */
    quantity: {
      type: DataTypes.STRING,
      allowNull: true
    },

    /**
     * Expiration date of the item
     */
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    /**
     * Indicates whether the item is available for sharing
     */
    is_shareable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    /**
     * Optional group ID if the item is shared with a specific group
     * Null means the item is publicly shareable
     */
    shared_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },

    /**
     * ID of the user who claimed the item
     * Null means the item has not been claimed
     */
    claimed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },

    /**
     * Timestamp when the item was claimed
     */
    claimed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    /**
     * Explicit database table name
     */
    tableName: 'items',

    /**
     * Disable automatic createdAt / updatedAt columns
     */
    timestamps: false
  }
);

module.exports = Item;
