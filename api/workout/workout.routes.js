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

// @desc Add workout
// @route POST /api/v1/workouts
// @access Private
router.post('/', addWorkout);

// @desc Get single workout
// @route GET /api/v1/workouts/:id
// @access Public
router.get('/:id', getWorkout);

// @desc Update workout
// @route PUT /api/v1/workouts/:id
// @access Private
router.put('/:id', updateWorkout);

// @desc Delete workout
// @route DELETE /api/v1/workouts/:id
// @access Private
router.delete('/:id', deleteWorkout);

module.exports = router;
