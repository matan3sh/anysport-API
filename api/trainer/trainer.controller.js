const ErrorResponse = require('../../utils/errorResponse');
const geocoder = require('../../utils/geocoder');
const Trainer = require('./trainer.model');

getTrainers = async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finiding resource
  let query = Trainer.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else query = query.sort('-updatedAt');

  // Executing query
  const trainers = await query;

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

getTrainersInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;
  const trainers = await Trainer.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: trainers.length, data: trainers });
};

module.exports = {
  getTrainers,
  getTrainer,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainersInRadius,
};
