const ErrorResponse = require('../../utils/errorResponse');
const Trainer = require('./trainer.model');

getTrainers = async (req, res, next) => {
  const trainers = await Trainer.find();
  res
    .status(200)
    .json({ success: true, count: trainers.length, data: trainers });
};

getTrainer = async (req, res, next) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer)
    return next(
      new ErrorResponse(`Trainer not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: workout });
};

addTrainer = async (req, res, next) => {
  const trainer = await Trainer.create(req.body);
  res.status(201).json({ success: true, data: trainer });
};

updateTrainer = async (req, res, next) => {
  const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!trainer)
    return next(
      new ErrorResponse(`Trainer not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: trainer });
};

deleteTrainer = async (req, res, next) => {
  const trainer = await Trainer.findByIdAndDelete(req.params.id);
  if (!trainer)
    return next(
      new ErrorResponse(`Trainer not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: {} });
};

module.exports = {
  getTrainers,
  getTrainer,
  addTrainer,
  updateTrainer,
  deleteTrainer,
};
