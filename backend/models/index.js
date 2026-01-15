/**
 * index.js (models)
 *
 * This file centralizes all Sequelize models and defines
 * the relationships between them.
 *
 * Importing models here ensures that associations are
 * properly set up before the database is used.
 */

const sequelize = require('../database');

// Import all models
const User = require('./User');
const Item = require('./Item');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const GroupInvite = require('./GroupInvite');

/**
 * ==========================
 * USER ↔ ITEM RELATIONSHIP
 * ==========================
 * A user can own multiple food items.
 * Each item belongs to exactly one user.
 */
User.hasMany(Item, { foreignKey: 'user_id' });
Item.belongsTo(User, { foreignKey: 'user_id' });

/**
 * ==========================
 * USER ↔ GROUP RELATIONSHIP
 * ==========================
 * A user can create (own) multiple groups.
 * Each group has one owner.
 */
User.hasMany(Group, { foreignKey: 'owner_user_id' });
Group.belongsTo(User, { foreignKey: 'owner_user_id' });

/**
 * ==========================
 * GROUP ↔ GROUP MEMBER
 * ==========================
 * A group can have many members.
 * Each group member entry links a user to a group.
 */
Group.hasMany(GroupMember, { foreignKey: 'group_id' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id' });

/**
 * ==========================
 * USER ↔ GROUP MEMBER
 * ==========================
 * A user can belong to multiple groups.
 * GroupMember acts as a junction table.
 */
User.hasMany(GroupMember, { foreignKey: 'user_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id' });

/**
 * ==========================
 * GROUP ↔ GROUP INVITES
 * ==========================
 * A group can send multiple invitations.
 * Each invite belongs to one group.
 */
Group.hasMany(GroupInvite, { foreignKey: 'group_id' });
GroupInvite.belongsTo(Group, { foreignKey: 'group_id' });

/**
 * ==========================
 * USER ↔ GROUP INVITES (INVITER)
 * ==========================
 * A user can send multiple group invitations.
 */
User.hasMany(GroupInvite, { foreignKey: 'inviter_user_id' });
GroupInvite.belongsTo(User, { foreignKey: 'inviter_user_id', as: 'inviter' });

/**
 * ==========================
 * USER ↔ GROUP INVITES (INVITED)
 * ==========================
 * A user can receive multiple group invitations.
 */
User.hasMany(GroupInvite, { foreignKey: 'invited_user_id' });
GroupInvite.belongsTo(User, { foreignKey: 'invited_user_id', as: 'invited' });

/**
 * Export sequelize instance and all models
 * so they can be used throughout the backend.
 */
module.exports = {
  sequelize,
  User,
  Item,
  Group,
  GroupMember,
  GroupInvite
};
