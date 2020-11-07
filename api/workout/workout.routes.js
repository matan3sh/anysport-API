const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
} = require('./workout.controller');
const router = express.Router({ mergeParams: true });

// @desc Get all workouts
// @route GET /api/v1/workouts
// @route GET /api/v1/trainers/:trainerId/workouts
// @access Public
router.get('/', asyncHandler(getWorkouts));

// // @desc Add workout
// // @route POST /api/v1/workouts
// // @access Private
// router.post('/', asyncHandler(addWorkout));

// // @desc Get single workout
// // @route GET /api/v1/workouts/:id
// // @access Public
// router.get('/:id', asyncHandler(getWorkout));

// // @desc Update workout
// // @route PUT /api/v1/workouts/:id
// // @access Private
// router.put('/:id', asyncHandler(updateWorkout));

// // @desc Delete workout
// // @route DELETE /api/v1/workouts/:id
// // @access Private
// router.delete('/:id', asyncHandler(deleteWorkout));

module.exports = router;
