const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  register,
  login,
  getLoggedInUser,
  forgotPassword,
} = require('./auth.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
router.post('/register', asyncHandler(register));

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
router.post('/login', asyncHandler(login));

// @desc Get logged in user
// @route GET /api/v1/auth/me
// @access Private
router.get('/me', protect, asyncHandler(getLoggedInUser));

// @desc Forgot password
// @route GET /api/v1/auth/forgotpassword
// @access Public
router.post('/forgotpassword', asyncHandler(forgotPassword));

module.exports = router;
