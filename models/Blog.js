let sequelize = require('./../config/connection');
let Sequelize = require('sequelize');

const Blog = sequelize.define('blogs', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    content: {
        type: Sequelize.STRING(250),
        allowNull: false
    },
    author_id: {
        type: Sequelize.INTEGER(2),
        allowNull: false
    }
});

Blog.prototype.create = (blog) => {
    return blog;
};
module.exports = Blog;