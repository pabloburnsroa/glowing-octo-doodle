const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const Joi = require('joi');

const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

// Routes
const campgrounds = require('./routes/campgrounds');

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/api/campgrounds', campgrounds);

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
