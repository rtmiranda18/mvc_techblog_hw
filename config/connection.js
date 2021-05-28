const Sequelize = require('sequelize');
var sequelize;
if (process.env.NODE_ENV !== 'production') {
    sequelize = new Sequelize('techblog_db', 'root', 'password', {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql'
    });
} else {
    sequelize = new Sequelize(process.env.JAWSDB_URL)
}
 

sequelize.sync()
    .then(() => console.log('user table has been successfully created'))
    .catch(error => console.log('This error occured', error));

module.exports = sequelize;

