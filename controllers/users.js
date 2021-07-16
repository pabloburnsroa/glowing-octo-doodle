const User = require('../models/User');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome Back!');
  const redirectUrl = req.session.returnTo || '/api/campgrounds/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out!');
  res.redirect('/api/campgrounds');
};
