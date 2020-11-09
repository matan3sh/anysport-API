const express = require('express');
const asyncHandler = require('../../middleware/async');
const { register, login } = require('./auth.controller');

const router = express.Router();

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
router.post('/register', asyncHandler(register));

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
router.post('/login', asyncHandler(login));

module.exports = router;
