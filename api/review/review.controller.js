const ErrorResponse = require('../../utils/errorResponse');
const Review = require('./review.model');

getReviews = async (req, res, next) => {
  if (req.params.trainerId) {
    const reviews = await Review.find({ trainer: req.params.trainerId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
};

module.exports = {
  getReviews,
};
