const User    = require('./User');
const Blog    = require('./Blog');
const Comment = require('./Comment');

User.hasMany(Blog, {
    as: 'blogs',
    foreignKey: 'author_id'
});

Blog.belongsTo(User, {
    as: 'user',
    foreignKey: 'author_id'
});

module.exports = {User, Blog, Comment};