if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

dbURL = process.env.MY_MONGO_URI;

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const Joi = require('joi');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');

const Review = require('./models/Review');
const Campground = require('./models/Campground');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const connectDB = require('./config/db');
const { resolve } = require('path');

// Connect to MongoDB
connectDB();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret';
// MongoDB session store
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret,
  },
  touchAfter: 24 * 3600,
});

store.on('error', (e) => {
  console.log('Session Store Error', e);
});

const oneWeek = 1000 * 60 * 60 * 24 * 7;
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // Secure should be set to true in deployment
    // secure: true,
    expires: Date.now() + oneWeek,
    maxAge: oneWeek,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

// Content Security-Policy
const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com',
  'https://api.tiles.mapbox.com',
  'https://api.mapbox.com',
  'https://kit.fontawesome.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
  'https://source.unsplash.com',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
  'https://fonts.googleapis.com',
  'https://use.fontawesome.com',
  'https://cdn.jsdelivr.net',
  'https://source.unsplash.com',
];
const connectSrcUrls = [
  'https://api.mapbox.com',
  'https://*.tiles.mapbox.com',
  'https://events.mapbox.com',
  'https://source.unsplash.com',
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ['blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        // 'https://res.cloudinary.com/MYACCOUNT/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!,
        'https://source.unsplash.com',
        'https://images.unsplash.com',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Serialize a user - store user in session
passport.serializeUser(User.serializeUser());
// Deserialize a user - get user out of session
passport.deserializeUser(User.deserializeUser());

// Middleware that adds onto res object - every view will have access to success
app.use((req, res, next) => {
  // console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/api/campgrounds', campgroundRoutes);
app.use('/api/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
