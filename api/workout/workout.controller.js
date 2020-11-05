const ErrorResponse = require('../../utils/errorResponse');
const Workout = require('./workout.model');

getWorkouts = async (req, res, next) => {
  const workouts = await Workout.find();
  res
    .status(200)
    .json({ success: true, count: workouts.length, data: workouts });
};

getWorkout = async (req, res, next) => {
  const workout = await Workout.findById(req.params.id);
  if (!workout)
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: workout });
};

addWorkout = async (req, res, next) => {
  const workout = await Workout.create(req.body);
  res.status(201).json({ success: true, data: workout });
};

updateWorkout = async (req, res, next) => {
  const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!workout)
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: workout });
};

deleteWorkout = async (req, res, next) => {
  const workout = await Workout.findByIdAndDelete(req.params.id);
  if (!workout)
    return next(
      new ErrorResponse(`Workout not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: {} });
};

module.exports = {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
};
