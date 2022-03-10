const User = require('../models/user');
const { roles } = require("../utils/roles");

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
    try {
        // create new user
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        
        //User.role = roles.User;
        //await User.save()
        // login new user - if error return err
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to oikkis.');
            res.redirect('/admin');
        })
       
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success' , 'Welcome back!' );
    const redirectUrl = req.session.returnTo || '/admin';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success' , 'You have logged out!');
    res.redirect('/');
}

module.exports.showAll = async(req, res, next) => {
    pageTitle = 'oikkis. Manage users';
    const users = await User.find();
    res.render('users/all', { pageTitle, users });
}