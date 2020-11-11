const express = require('express');
const asyncHandler = require('../../middleware/async');
const { getUsers } = require('./admin.controller');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// @desc Gel all users
// @route PUT /api/v1/admin
// @access Private
router.get('/', protect, asyncHandler(getUsers));

module.exports = router;
