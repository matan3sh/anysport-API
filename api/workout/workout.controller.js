const Workout = require('./workout.model');

getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res
      .status(200)
      .json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(400).json({ success: false });
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

addWorkout = async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!workout) return res.status(400).json({ success: false });
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(400).json({ success: false });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
};
