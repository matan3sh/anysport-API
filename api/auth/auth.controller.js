const ErrorResponse = require('../../utils/errorResponse');
const User = require('../user/user.model');

register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
};

module.exports = {
  register,
};
