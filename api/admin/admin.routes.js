const express = require('express');
const asyncHandler = require('../../middleware/async');
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} = require('./admin.controller');
const advancedResults = require('../../middleware/advancedResults');
const { protect, authorize } = require('../../middleware/auth');
const User = require('../user/user.model');

const router = express.Router();
router.use(protect);
router.use(authorize('admin'));

// @desc Gel all users
// @route GET /api/v1/admin
// @access Private/Admin
router.get('/', advancedResults(User, 'users'), asyncHandler(getUsers));

// @desc Get single user
// @route GET /api/v1/admin/:id
// @access Private/Admin
router.get('/:id', asyncHandler(getUser));

// @desc Create a user
// @route GET /api/v1/admin
// @access Private/Admin
router.post('/', asyncHandler(addUser));

// @desc Update a user
// @route PUT /api/v1/admin/:id
// @access Private/Admin
router.put('/:id', asyncHandler(updateUser));

// @desc Delete a user
// @route DELETE /api/v1/admin/:id
// @access Private/Admin
router.delete('/:id', asyncHandler(deleteUser));

module.exports = router;
