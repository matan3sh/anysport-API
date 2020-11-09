const ErrorResponse = require('../../utils/errorResponse');
const User = require('../user/user.model');

register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
};

login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse(`Invalid credentials`, 401));
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 401));
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
};

module.exports = {
  register,
  login,
};
