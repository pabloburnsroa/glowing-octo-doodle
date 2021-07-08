const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
  res.render('users/register');
});

// Register User
router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      // Login newUser once registered
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp');
        res.redirect('/api/campgrounds/');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/api/campgrounds/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out!');
  res.redirect('/api/campgrounds');
});

module.exports = router;
