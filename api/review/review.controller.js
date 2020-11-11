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

getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'trainer',
    select: 'name description',
  });
  if (!review)
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: review });
};

addReview = async (req, res, next) => {};

module.exports = {
  getReviews,
  getReview,
  addReview,
};
