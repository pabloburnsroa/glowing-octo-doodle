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

// Get all campgrounds
router.get('/', catchAsync(index));

// Render new campground form
router.get('/new', isLoggedIn, renderNewForm);

// New Campground
router.post('/', isLoggedIn, validateCampground, catchAsync(createCampground));

// Find campground by ID
router.get('/:id', catchAsync(findCampground));

// Edit Form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editForm));

//  Update Campground
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(updateCampground)
);

// Delete Campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCampground));

module.exports = router;
