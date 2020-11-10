const ErrorResponse = require('../../utils/errorResponse');
const sendEmail = require('../../utils/sendEmail');
const User = require('../user/user.model');

register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  _sendTokenResponse(user, 200, res);
};

login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse(`Invalid credentials`, 401));
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 401));
  _sendTokenResponse(user, 200, res);
};

getLoggedInUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new ErrorResponse('There is no user with that email', 404));
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;
  const message = `You receiveing this email because you (or someone else) has requested to reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
};

// Get token from model, create cookie and send respose
const _sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') options.secure = true;
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

module.exports = {
  register,
  login,
  getLoggedInUser,
  forgotPassword,
};
