const ErrorResponse = require('../../utils/errorResponse');
const { _sendTokenResponse } = require('../auth/auth.controller');
const User = require('./user.model');

updateDetails = async (req, res, next) => {
  const fieldsToUpdate = { name: req.body.name, email: req.body.email };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
};

updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  _sendTokenResponse(user, 200, res);
};

module.exports = {
  updateDetails,
  updatePassword,
};
