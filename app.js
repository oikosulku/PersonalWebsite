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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");


//
// Require models
const User = require('./models/user');
const Page = require('./models/pages');

//
// require utils + other code
const catchAsync = require('./utils/catchAsync');
const appError = require('./utils/AppError'); // same as express error
 


//
// require routes
const pageRoutes = require('./routes/pages');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');


/*
* SET UP DATABASE CONNECTION
*/
mongoose.connect('mongodb://localhost:27017/oikkisdb')
.then(()=> {
    console.log("MONGO CONNECTION OPEN");
})
.catch(err => {
    console.log("OH NO MONGO ERROR!!!")
    console.log(err)
})

/*
* DEBUG
*/

// just for remember - this could be usefull for debug
// https://github.com/expressjs/morgan
// app.use(morgan('tiny));

/*
* SET UP 
*/
const app = express());
app.engine('ejs' , ejsMate );
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, '/views'));
// define public folder for css + images etc.
app.use(express.static('public'));
// body-parser needed for receive post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//sanitize post/get/ etc.
app.use(mongoSanitize());

/*
/ set up session + flash
*/
const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // hhtp only give exra layer security
         // secure: true, // need https
        expires: Date.now() + 1000 * 60 * 60 * 7, // cookie expires after one week
        maxAge:  1000 * 60 * 60 * 7, // max age is one week
    }
}
app.use(session(sessionConfig));
app.use(flash());


/*
/ set up passport
*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Give some xtra security for attacks etc..
app.use(helmet());

/*
/ MIDDLEWARE
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
    //console.log(currentUser);
    next();
})


/*
* GET MENU
*/
app.use(catchAsync(async (req, res, next) => {
    res.locals.menu = await Page.find({isPublished: true} ).select('title url').sort('order');
    next();
}))


/*
* ROUTES
*/

app.use('/projects' , projectRoutes );
app.use('/users' , userRoutes );
app.use('/admin' , adminRoutes );
app.use('/' , pageRoutes );


/*
* ERRORS
*/

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