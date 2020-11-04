const express = require('express');
const {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
} = require('./workout.controller');
const router = express.Router();

// @desc Get all workouts
// @route GET /api/v1/workouts
// @access Public
router.get('/', getWorkouts);

// @desc Get single workout
// @route GET /api/v1/workout/:id
// @access Public
router.get('/:id', getWorkout);

// @desc Add workout
// @route POST /api/v1/workout
// @access Public
router.post('/', addWorkout);

// @desc Update workout
// @route PUT /api/v1/workout/:id
// @access Public
router.put('/:id', updateWorkout);

// @desc Delete workout
// @route DELETE /api/v1/workout/:id
// @access Public
router.delete('/:id', deleteWorkout);

module.exports = router;
