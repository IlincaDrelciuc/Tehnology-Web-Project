const sequelize = require('../database');

const User = require('./User');
const Item = require('./Item');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const GroupInvite = require('./GroupInvite');

User.hasMany(Item, { foreignKey: 'user_id' });
Item.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Group, { foreignKey: 'owner_user_id' });
Group.belongsTo(User, { foreignKey: 'owner_user_id' });

Group.hasMany(GroupMember, { foreignKey: 'group_id' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id' });

User.hasMany(GroupMember, { foreignKey: 'user_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id' });

Group.hasMany(GroupInvite, { foreignKey: 'group_id' });
GroupInvite.belongsTo(Group, { foreignKey: 'group_id' });

User.hasMany(GroupInvite, { foreignKey: 'inviter_user_id' });
User.hasMany(GroupInvite, { foreignKey: 'invited_user_id' });

module.exports = { sequelize, User, Item, Group, GroupMember, GroupInvite };
