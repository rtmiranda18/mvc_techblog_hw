const { User, Blog }    = require('./models');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let express = require('express');
let exphbs  = require('express-handlebars');
let moment = require('moment');
let path = require('path');
let app     = express();
let hbsContent = {
    userName: '',
    loggedin: false,
    title: 'You are not logged in today',
    body: 'Hello World',
    blogs: []
};

let hbsEngine = exphbs.create({
    helpers: {
        formatDate: function (date, format) {
            return moment(date).format(format);
        }
    }
});

// support parsing of application/json type post data
app.use(express.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/')));
app.engine('handlebars', hbsEngine.engine);
app.set('view engine', 'handlebars');

app.use(session({
    key: 'user_sid',
    secret: 'Super secret secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000
    }
}));

app.use((req, res, next) => {
    if(req.cookies.user_sid && !req.session.user){
        res.clearCookie('user_sid');
    }
    next();
});

// middleware function to check for logged-in users
let sessionChecker = (req, res, next) => {
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/home');
    }else{
        next();
    }
};

app.get('/', sessionChecker, (req, res) => {
    if(!req.session.user && !req.cookies.user_sid){ 
        res.redirect('/login');
    }
});

// Route for User's Login
app.route('/login')
    .get((req, res) => {
        if(!req.session.user && !req.cookies.user_sid){   
            res.render('login', hbsContent);
        }else{
            res.redirect('/');
        }
    })
    .post(async (req, res, next) => {
        try {
            let username = req.body.username;
            let password = req.body.password;
            await User.findOne({ where: {username: username} }).then(user => {
                if(!user || !user.validPassword(password)){
                    res.redirect('/login');
                }else{
                    req.session.user = user.dataValues;
                    res.redirect('/home');
                }
            })
        } catch (err) {
            next(err);
        }
    });

// Route for User's Signup
app.route('/signup')
    .get((req, res) => {
        if(!req.session.user && !req.cookies.user_sid){   
            res.render('signup', hbsContent);
        }else{
            res.redirect('/home');
        }
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            password: req.body.password
        }).then(user => {
            req.session.user = user.dataValues;
            res.redirect('/home');
        }).catch(error => {
            console.log(error);
            res.redirect('/signup');
        })
    });

// Route for User's Homepage
app.route('/home').get(async (req, res) => {
    if(req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = true;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = "You are logged in";
        const blogs_ = await Blog.findAll();
        hbsContent.blogs = JSON.parse(JSON.stringify(blogs_));
        res.render('home', hbsContent);
    }else{
        res.redirect('/login');
    }
})

app.route('/blog/:id').get(async (req, res) => {
    if(req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = true;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = "You are logged in";
        const blog = await Blog.findOne({
            where: {
                id: req.params.id
            },
            include: [
                { model: User, as: 'user' }
            ]
        });
        console.log(JSON.parse(JSON.stringify(blog)));
        hbsContent.blog = JSON.parse(JSON.stringify(blog));
        res.render('blog', hbsContent);
    }else{
        hbsContent.loggedin = false;
        hbsContent.userName = '';
        res.redirect('/login');
    }
})

// Route for User's Dashboard
app.route('/dashboard').get((req, res) => {
    if(req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = true;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = "You are logged in";
        res.render('dashboard', hbsContent);
    }else{
        res.redirect('/login');
    }
}).post(async (req, res) => {
    const createdBlog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        author_id: req.session.user.id
    }).then(blog => {
        // console.log(blog.dataValues);
        res.redirect('/home');
    }).catch(error => {
        console.log(error);
    })
    createdBlog.create();
});

// Route for User's Logout
app.get('/logout', (req, res) => {
    if(req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = false;
        hbsContent.userName = '';
        hbsContent.title = "You are logged out";
        res.clearCookie('user_sid');
        res.redirect('/');
    }else{
        res.redirect('/login');
    }
});

app.use((req, res, next) => {
    res.status(404).send("Error 404, Page not found!");
})
app.listen(3000);