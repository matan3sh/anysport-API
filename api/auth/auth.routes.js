const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  register,
  login,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  logout,
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

// @desc Logout user / clear cookie
// @route GET /api/v1/auth/logout
// @access Private
router.get('/logout', protect, asyncHandler(logout));

// @desc Get logged in user
// @route GET /api/v1/auth/me
// @access Private
router.get('/me', protect, asyncHandler(getLoggedInUser));

// @desc Forgot password
// @route GET /api/v1/auth/forgotpassword
// @access Public
router.post('/forgotpassword', asyncHandler(forgotPassword));

// @desc Reset password
// @route PUT /api/v1/auth/resetpassword/:resetToken
// @access Public
router.put('/resetpassword/:resetToken', asyncHandler(resetPassword));

module.exports = router;
