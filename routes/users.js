const express = require('express');
const passport = require('passport');
const {
  renderRegister,
  registerUser,
  renderLogin,
  login,
  logout,
} = require('../controllers/users');
const router = express.Router({ mergeParams: true });
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// Render register form
router.get('/register', renderRegister);

// Register User
router.post('/register', catchAsync(registerUser));

// Render login
router.get('/login', renderLogin);

// User Login
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  login
);

// Logout route
router.get('/logout', logout);

module.exports = router;
