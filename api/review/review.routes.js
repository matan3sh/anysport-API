const express = require('express');
const asyncHandler = require('../../middleware/async');
const { getReviews, getReview, addReview } = require('./review.controller');

const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');

const Review = require('./review.model');

const router = express.Router({ mergeParams: true });

// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/trainers/:trainerId/reviews
// @access Public
router.get(
  '/',
  advancedResults(Review, { path: 'trainer', select: 'name description' }),
  asyncHandler(getReviews)
);

// @desc Get single review
// @route GET /api/v1/reviews/:id
// @access Public
router.get('/:id', asyncHandler(getReview));

// @desc Add review
// @route POST /api/v1/trainers/:trainerId/reviews
// @access Private
router.post('/', protect, authorize('user', 'admin'), asyncHandler(addReview));

module.exports = router;
