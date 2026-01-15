/**
 * GroupInvite model
 *
 * This model represents an invitation sent to a user to join a group.
 * It stores who sent the invite, who received it, the target group,
 * and the current status of the invitation.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Define the GroupInvite table structure
 */
const GroupInvite = sequelize.define(
  'GroupInvite',
  {
    /**
     * Primary key
     * Unique identifier for each invite
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    /**
     * ID of the group the user is invited to
     */
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * ID of the user who sent the invitation
     */
    inviter_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * ID of the user who is invited to join the group
     */
    invited_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /**
     * Optional preference label provided by the inviter
     * (e.g. food restrictions or preferences)
     */
    preference_label: {
      type: DataTypes.STRING,
      allowNull: true
    },

    /**
     * Current status of the invitation
     * Possible values: 'pending', 'accepted', 'declined'
     */
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },

    /**
     * Date when the invitation was created
     */
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    /**
     * Explicit database table name
     */
    tableName: 'group_invites',

    /**
     * Disable automatic Sequelize timestamps
     */
    timestamps: false
  }
);

module.exports = GroupInvite;
