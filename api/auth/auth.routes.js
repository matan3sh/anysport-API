const express = require('express');
const asyncHandler = require('../../middleware/async');
const { register } = require('./auth.controller');

const router = express.Router();

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
router.post('/register', asyncHandler(register));

module.exports = router;
