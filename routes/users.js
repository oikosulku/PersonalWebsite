const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

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

router.get('/' ,catchAsync(users.showAll));

module.exports = router; 