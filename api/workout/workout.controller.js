getWorkouts = async (req, res) => {
  res.status(200).json({ success: true, msg: 'Display all workouts' });
};

getWorkout = async (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Display single workout ${req.params.id}` });
};

addWorkout = async (req, res) => {
  res.status(200).json({ success: true, msg: 'Create new workout' });
};

updateWorkout = async (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update workout ${req.params.id}` });
};

deleteWorkout = async (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete workout ${req.params.id}` });
};

module.exports = {
  getWorkouts,
  getWorkout,
  addWorkout,
  updateWorkout,
  deleteWorkout,
};
