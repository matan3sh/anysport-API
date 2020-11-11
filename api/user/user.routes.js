const express = require('express');
const asyncHandler = require('../../middleware/async');
const { updateDetails, updatePassword } = require('./user.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// @desc Update user details
// @route PUT /api/v1/users/updatedetails
// @access Private
router.put('/updatedetails', protect, asyncHandler(updateDetails));

// @desc Update user password
// @route PUT /api/v1/users/updatepassword
// @access Private
router.put('/updatepassword', protect, asyncHandler(updatePassword));

module.exports = router;
