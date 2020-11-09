const ErrorResponse = require('../../utils/errorResponse');
const Workout = require('./workout.model');
const Trainer = require('../trainer/trainer.model');

getWorkouts = async (req, res, next) => {
  if (req.params.trainerId) {
    const workouts = await Workout.find({ trainer: req.params.trainerId });
    return res
      .status(200)
      .json({ success: true, count: workouts.length, data: workouts });
  } else {
    res.status(200).json(res.advancedResults);
  }
};

const getWorkout = async (req, res, next) => {
  const workout = await Workout.findById(req.params.id).populate({
    path: 'trainer',
    select: 'name description',
  });
  if (!workout)
    return next(
      new ErrorResponse(
        `No workout with the id of ${req.params.trainerId}`,
        404
      )
    );
  res.status(200).json({ success: true, data: workout });
};

const addWorkout = async (req, res, next) => {
  req.body.trainer = req.params.trainerId;
  req.body.user = req.user.id;
  const trainer = await Trainer.findById(req.params.trainerId);
  if (!trainer)
    return next(
      new ErrorResponse(
        `No trainer with the id of ${req.params.trainerId}`,
        404
      )
    );
  if (trainer.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a workout to this trainer ${trainer._id}`,
        401
      )
    );
  const workout = await Workout.create(req.body);
  res.status(200).json({ success: true, data: workout });
};

const updateWorkout = async (req, res, next) => {
  let workout = await Workout.findById(req.params.id);
  if (!workout)
    return next(
      new ErrorResponse(`No workout with the id of ${req.params.id}`, 404)
    );
  if (workout.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update a workout ${workout._id}`,
        401
      )
    );
  workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: workout });
};

const deleteWorkout = async (req, res, next) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout)
    return next(
      new ErrorResponse(`No workout with the id of ${req.params.id}`, 404)
    );
  if (workout.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete a workout ${workout._id}`,
        401
      )
    );
  await Workout.deleteOne();
  res.status(200).json({ success: true, data: {} });
};

module.exports = {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
};
