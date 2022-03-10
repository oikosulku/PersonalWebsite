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

// Show all users
module.exports.showAll = async(req, res, next) => {
    pageTitle = 'oikkis. Manage users';
    const users = await User.find();
    res.render('users/all', { pageTitle, users });
}

// render update User form
module.exports.renderUpdateUser = async(req, res, next) => {
    pageTitle = 'oikkis. Edit your user details ';
    const {id} = req.params;
    const user = await User.findById(id);
    res.render('users/edit', { pageTitle, user });
}

// update user form action
module.exports.updateUser = async (req, res) => {
    const{ id } = req.params;
    console.log(req.body);
    await User.findByIdAndUpdate(id, {...req.body})
    req.flash('success', `User Info Edited Succesfully!`);
    //res.redirect(`/pages/show/${id}` )
    res.redirect(`/users`);
}

// delete user
module.exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    // confirm that user cannot delete own account
    if( id === res.locals.currentUser._id.valueOf() ) {
        req.flash('error', `You can't delete your own user account`);
        res.redirect(`/users`);
    } else {
        await User.findByIdAndDelete(id)
        req.flash('success', `User Deleted Succesfully!`);
        res.redirect(`/users`);
    }
}