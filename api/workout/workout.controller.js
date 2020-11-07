const ErrorResponse = require('../../utils/errorResponse');
const Workout = require('./workout.model');

getWorkouts = async (req, res, next) => {
  let query;
  if (req.params.trainerId)
    query = Workout.find({ trainer: req.params.trainerId });
  else query = Workout.find();
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

module.exports = {
  getWorkouts,
  // getWorkout,
  // addWorkout,
  // updateWorkout,
  // deleteWorkout,
};
