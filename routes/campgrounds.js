const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../validateSchemas');
const Campground = require('../models/Campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const {
  index,
  renderNewForm,
  createCampground,
  findCampground,
  editForm,
  updateCampground,
  deleteCampground,
} = require('../controllers/campgrounds');

// '/' route
router
  .route('/')
  // Get all campgrounds
  .get(catchAsync(index))
  // New Campground
  .post(isLoggedIn, validateCampground, catchAsync(createCampground));

// Render new campground form
router.get('/new', isLoggedIn, renderNewForm);

// '/:id' route
router
  .route('/:id')
  // Find campground by ID
  .get(catchAsync(findCampground))
  //  Update Campground
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground))
  // Delete Campground
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

// Edit Form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editForm));

module.exports = router;
