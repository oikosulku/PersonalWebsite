const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const {isLoggedIn } = require('../middleware');
const admin = require('../controllers/admin');


// Admin index
router.use('/', isLoggedIn, admin.index )

module.exports = router; 