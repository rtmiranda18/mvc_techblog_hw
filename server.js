const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/dashboard', function (req, res) {
    res.render('dashboard');
})

sequelize.sync({ force: false }).then(() => {
    app.listen(3000);
});
