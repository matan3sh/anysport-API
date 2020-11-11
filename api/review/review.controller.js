const ErrorResponse = require('../../utils/errorResponse');
const Review = require('./review.model');
const Trainer = require('../trainer/trainer.model');

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

addReview = async (req, res, next) => {
  req.body.trainer = req.params.trainerId;
  req.body.user = req.user.id;
  const trainer = await Trainer.findById(req.params.trainerId);
  if (!trainer)
    return next(
      new ErrorResponse(`Trainer not found with id of ${req.params.id}`, 404)
    );
  const publishedReview = await Review.findOne({ user: req.user.id });
  if (
    publishedReview &&
    publishedReview.trainer.toString() === req.params.trainerId &&
    req.user.role !== 'admin'
  )
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a review for this trainer`,
        400
      )
    );
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
};

module.exports = {
  getReviews,
  getReview,
  addReview,
};
