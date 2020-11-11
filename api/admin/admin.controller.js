const ErrorResponse = require('../../utils/errorResponse');
const User = require('./user.model');

getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ success: true, data: user });
};

module.exports = {
  getUsers,
};
