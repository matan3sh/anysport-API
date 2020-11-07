const path = require('path');
const ErrorResponse = require('../../utils/errorResponse');
const geocoder = require('../../utils/geocoder');
const Trainer = require('./trainer.model');

getTrainers = async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

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
  let query = Trainer.find(JSON.parse(queryStr)).populate('workouts');

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

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Trainer.countDocuments();
  query = query.skip(startIndex).limit(limit);

  // Pagination result
  const pagination = {};
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  // Executing query
  const trainers = await query;

  res.status(200).json({
    success: true,
    count: trainers.length,
    pagination,
    data: trainers,
  });
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
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer)
    return next(
      new ErrorResponse(`Trainer not found with id of ${req.params.id}`, 404)
    );
  trainer.remove();
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

trainerPhotoUpload = async (req, res, next) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer)
    return next(
      new ErrorResponse(`Trainer not found with id of ${req.params.id}`, 404)
    );
  if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));
  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image'))
    return next(new ErrorResponse(`Please upload an image file`, 400));

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload an image less then ${process.env.MAX_FILE_UPLOAD}bytes`,
        400
      )
    );

  // Create custom filename
  file.name = `${trainer._id}_photo${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Trainer.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
};

module.exports = {
  getTrainers,
  getTrainer,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainersInRadius,
  trainerPhotoUpload,
};
