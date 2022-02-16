// require needed modules
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {projectSchema} = require('./schemas.js');
const methodOverride = require('method-override');
const Project = require('./models/project');
const catchAsync = require('./utils/catchAsync');
const appError = require('./utils/AppError');
const projectRoutes = require('./routes/projects');

//
// set up session + flash
const flash = require('connect-flash');
const session = require('express-session');

const sessionOptions = { secret: "changethis", resave: false, saveUninitialized: false};
app.use(session(sessionOptions));
app.use(flash());


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
app.engine('ejs' , ejsMate );
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, '/views'));
// define public folder for css + images etc.
app.use(express.static('public'));
// body-parser needed for receive post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//
// Define PROJECT ROUTES
app.use('/admin/projects' , projectRoutes );


//
// middleware
// - set flash message 
// - set global variables
app.use((req, res, next) => {
    res.locals.messages = req.flash('success');
    console.log( res.locals.messages );
    res.locals.pageTitle = "oikkis. web development";
    next();
})


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

// fire up server...
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});