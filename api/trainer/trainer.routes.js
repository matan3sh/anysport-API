const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  getTrainers,
  getTrainer,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainersInRadius,
} = require('./trainer.controller');
const router = express.Router();

// @desc Get all trainers
// @route GET /api/v1/trainers
// @access Public
router.get('/', asyncHandler(getTrainers));

// @desc Add trainer
// @route POST /api/v1/trainers
// @access Private
router.post('/', asyncHandler(addTrainer));

// @desc Get single trainer
// @route GET /api/v1/trainers/:id
// @access Public
router.get('/:id', asyncHandler(getTrainer));

// @desc Update trainer
// @route PUT /api/v1/trainers/:id
// @access Private
router.put('/:id', asyncHandler(updateTrainer));

// @desc Delete trainer
// @route DELETE /api/v1/trainers/:id
// @access Private
router.delete('/:id', asyncHandler(deleteTrainer));

// @desc Get trainers within a radius
// @route GET /api/v1/trainers/radius/:zipcode/:distance
// @access Private
router.get('/radius/:zipcode/:distance', asyncHandler(getTrainersInRadius));

module.exports = router;
