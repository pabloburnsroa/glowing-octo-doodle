const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../validateSchemas');
const Campground = require('../models/Campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const { index } = require('../controllers/campgrounds');

// Get all campgrounds
router.get('/', catchAsync(index));

// Render new campground form
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// New Campground
router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    // assign signed in user to new campground
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/api/campgrounds/${campground._id}`);
  })
);

// Find campground by ID
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    // console.log(campground);
    if (!campground) {
      req.flash('error', 'Cannot find that campground');
      return res.redirect('/api/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

// Edit Form
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/api/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

//  Update Campground
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/api/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    req.flash('success', 'Successfully deleted campground');
    await Campground.findByIdAndDelete(id);
    res.redirect('/api/campgrounds/');
  })
);

module.exports = router;
