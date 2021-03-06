const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  getTrainers,
  getTrainer,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainersInRadius,
  trainerPhotoUpload,
} = require('./trainer.controller');
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');
const Trainer = require('./trainer.model');

// Include other resource routers
const workoutRouter = require('../workout/workout.routes');
const reviewRouter = require('../review/review.routes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:trainerId/workouts', workoutRouter);
router.use('/:trainerId/reviews', reviewRouter);

// @desc Get all trainers
// @route GET /api/v1/trainers
// @access Public
router.get(
  '/',
  advancedResults(Trainer, 'workouts'),
  asyncHandler(getTrainers)
);

// @desc Add trainer
// @route POST /api/v1/trainers
// @access Private
router.post(
  '/',
  protect,
  authorize('publisher', 'admin'),
  asyncHandler(addTrainer)
);

// @desc Get single trainer
// @route GET /api/v1/trainers/:id
// @access Public
router.get('/:id', asyncHandler(getTrainer));

// @desc Update trainer
// @route PUT /api/v1/trainers/:id
// @access Private
router.put(
  '/:id',
  protect,
  authorize('publisher', 'admin'),
  asyncHandler(updateTrainer)
);

// @desc Delete trainer
// @route DELETE /api/v1/trainers/:id
// @access Private
router.delete(
  '/:id',
  protect,
  authorize('publisher', 'admin'),
  asyncHandler(deleteTrainer)
);

// @desc Get trainers within a radius
// @route GET /api/v1/trainers/radius/:zipcode/:distance
// @access Public
router.get('/radius/:zipcode/:distance', asyncHandler(getTrainersInRadius));

// @desc Upload photo for trainer
// @route PUT /api/v1/trainers/:id/photo
// @access Private
router.put(
  '/:id/photo',
  protect,
  authorize('publisher', 'admin'),
  asyncHandler(trainerPhotoUpload)
);

module.exports = router;
