const Sequelize = require('sequelize');
const sequelize = new Sequelize('techblog_db', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

sequelize.sync()
    .then(() => console.log('user table has been successfully created'))
    .catch(error => console.log('This error occured', error));

module.exports = sequelize;

