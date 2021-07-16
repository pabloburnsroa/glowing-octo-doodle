const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');
const Campground = require('../models/Campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

// Create Review
router.post('/', isLoggedIn, validateReview, catchAsync(createReview));

// Delete Review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(deleteReview)
);

module.exports = router;
