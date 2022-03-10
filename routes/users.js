const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, isAdminUser } = require('../middleware');

// SHOW REGISTER FORM
router.get('/register', users.renderRegisterForm);
// REGISTER NEW USER
router.post('/register', catchAsync(users.register));
// SHOW LOGIN
router.get('/login', users.renderLoginForm);
// LOGIN ACTION
router.post('/login', 
    passport.authenticate('local', {failureFlash: true, failureRedirect: 'login'}), 
    users.login
);
// LOGOUT
router.get('/logout', users.logout);

/*
/* USER ADMIN/MANAGE
**/

// show all users
router.get('/' , isLoggedIn, isAdminUser, catchAsync(users.showAll));
// render user edit form
router.get('/:id/edit', isLoggedIn, catchAsync(users.renderUpdateUser));
// edit user put/save action
router.put('/:id', isLoggedIn,  catchAsync(users.updateUser));
// delete user
router.delete('/:id', isLoggedIn, isAdminUser, catchAsync(users.deleteUser));


module.exports = router; 