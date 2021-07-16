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

// Register Routes
router
  .route('/register')
  // Render register form
  .get(renderRegister)
  // Register User
  .post(catchAsync(registerUser));

// Login Routes
router
  .route('/login')
  // Render login
  .get(renderLogin)
  // User Login
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    login
  );

// Logout route
router.get('/logout', logout);

module.exports = router;
