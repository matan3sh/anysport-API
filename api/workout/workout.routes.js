const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
} = require('./workout.controller');
const Workout = require('./workout.model');
const advancedResults = require('../../middleware/advancedResults');
const { protect } = require('../../middleware/auth');
const router = express.Router({ mergeParams: true });

// @desc Get all workouts
// @route GET /api/v1/workouts
// @route GET /api/v1/trainers/:trainerId/workouts
// @access Public
router.get(
  '/',
  advancedResults(Workout, {
    path: 'trainer',
    select: 'name description',
  }),
  asyncHandler(getWorkouts)
);

// @desc Add workout
// @route POST /api/v1/trainers/:trainerId/workouts
// @access Private
router.post('/', protect, asyncHandler(addWorkout));

// @desc Get single workout
// @route GET /api/v1/workouts/:id
// @access Public
router.get('/:id', asyncHandler(getWorkout));

// @desc Update workout
// @route PUT /api/v1/workouts/:id
// @access Private
router.put('/:id', protect, asyncHandler(updateWorkout));

// @desc Delete workout
// @route DELETE /api/v1/workouts/:id
// @access Private
router.delete('/:id', protect, asyncHandler(deleteWorkout));

module.exports = router;
