// 
//require needed depencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//
// Require models
const Project = require('./models/project');
const User = require('./models/user');

//
// require utils + other code
const catchAsync = require('./utils/catchAsync');
const appError = require('./utils/AppError');


//
// require routes
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');


/*
* SET UP 
*/


//
// set up session + flash


//
// connect to database
mongoose.connect('mongodb://localhost:27017/oikkisdb')
.then(()=> {
    console.log("MONGO CONNECTION OPEN");
})
.catch(err => {
    console.log("OH NO MONGO ERROR!!!")
    console.log(err)
})

// just for remember - this could be usefull for debug
// https://github.com/expressjs/morgan
// app.use(morgan('tiny));

//
// setup things...
const app = express();
app.engine('ejs' , ejsMate );
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, '/views'));
// define public folder for css + images etc.
app.use(express.static('public'));
// body-parser needed for receive post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// cookie expires after one week
// max age is
// hhtp only give exra layer security
const sessionConfig = {
    secret: 'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 7,
        maxAge:  1000 * 60 * 60 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());


//set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*
* MIDDLEWARE
*/

//
// middleware
// - set flash message 
// - set global variables
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.pageTitle = "oikkis. web development";
    res.locals.currentUser = req.user;
    next();
})


/*
* ROUTES
*/

app.use('/admin/projects' , projectRoutes );
app.use('/users' , userRoutes );


//
// check admin login here...
app.use('/admin' , (req, res, next) => {
    //console.log('ADMIN AREA!');
    return next();
})

//
// routes
app.get('/', catchAsync(async (req, res) => {
    // get all projects
    const projects = await Project.find()
    res.render('home', {projects});
}))

// content pages
app.get('/page', (req, res) => {

    // ADD SOME FUNCTIONALITY HERE
    res.render('page');
});

// contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});

//
// contact form POST
app.post('/contact', (req, res) => {
    const{ yourName, yourEmail, yourMsg } = req.body;
    // POST ACTION NEED TO BE DONE
    // set up flash message!
    req.flash('success', `Thank you ${yourName}, your message has sended! Will respond soonest!`);
    res.redirect('contact');
});


//
// ADMIN SECTION - PROJECTS
// 

app.get('/admin', (req, res) => {
    pageTitle = 'oikkis. Admin - Dashboard';
    isAdmin = true;
    res.render('admin/index' , {pageTitle});
});



//
// handling errors
//

// no route found - render 404
app.all('*', (req, res, next) => {
    next(new appError('Page Not Found', 404));
})

// something else show error page
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    pageTitle = `oikkis. ${statusCode} !`;
    if( !err.message) err.message = "Oh no something went wrong!";
    res.status(statusCode).render( 'error', {err, pageTitle}  );
})


/*
* SERVER
*/
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});