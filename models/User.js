let Sequelize = require('sequelize');
let bcrypt = require('bcryptjs');

const sequelize = new Sequelize('techblog_db', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

let User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(250),
        allowNull: false
    }
});

User.beforeCreate((user) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
})

User.prototype.validPassword = (password) => {
    const hash = bcrypt.hashSync(password, 10);
    return bcrypt.compare(password, hash);
};

sequelize.sync()
    .then(() => console.log('user table has been successfully created'))
    .catch(error => console.log('This error occured', error));

module.exports = User;