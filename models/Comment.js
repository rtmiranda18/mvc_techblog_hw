let sequelize = require('./../config/connection');;
let Sequelize = require('sequelize');

const Comment = sequelize.define('comments', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING(250),
        allowNull: false
    },
    authorId: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    }
});

Comment.prototype.create = (comment) => {
    return comment;
};
module.exports = Comment;