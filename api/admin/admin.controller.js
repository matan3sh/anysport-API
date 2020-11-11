const ErrorResponse = require('../../utils/errorResponse');
const User = require('../user/user.model');

getUsers = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
};

addUser = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
};

updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
};

deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
};
