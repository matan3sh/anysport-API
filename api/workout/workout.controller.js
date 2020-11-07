const ErrorResponse = require('../../utils/errorResponse');
const Workout = require('./workout.model');
const Trainer = require('../trainer/trainer.model');

getWorkouts = async (req, res, next) => {
  let query;
  if (req.params.trainerId)
    query = Workout.find({ trainer: req.params.trainerId });
  else
    query = Workout.find().populate({
      path: 'trainer',
      select: 'name description',
    });
  const workouts = await query;
  if (!workouts.length)
    return next(
      new ErrorResponse(
        `Workouts not found for trainer with an id of ${req.params.trainerId}`,
        404
      )
    );
  res
    .status(200)
    .json({ success: true, count: workouts.length, data: workouts });
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
  const trainer = await Trainer.findById(req.params.trainerId);
  if (!trainer)
    return next(
      new ErrorResponse(
        `No trainer with the id of ${req.params.trainerId}`,
        404
      )
    );
  const workout = await Workout.create(req.body);
  res.status(200).json({ success: true, data: workout });
};

const updateWorkout = async (req, res, next) => {
  let workout = await Workout.findById(req.params.id);
  if (!workout)
    return next(
      new ErrorResponse(`No trainer with the id of ${req.params.id}`, 404)
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
