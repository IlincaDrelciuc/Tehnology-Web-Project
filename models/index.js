const sequelize = require('../database');
const User = require('./User');
const Item = require('./Item');

User.hasMany(Item, { foreignKey: 'user_id' });
Item.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Item };
