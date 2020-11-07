const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Trainer = require('./api/trainer/trainer.model');
const Workout = require('./api/workout/workout.model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Read JSON files
const trainers = JSON.parse(
  fs.readFileSync(`${__dirname}/data/trainers.json`, 'utf-8')
);
const workouts = JSON.parse(
  fs.readFileSync(`${__dirname}/data/workouts.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Trainer.create(trainers);
    await Workout.create(workouts);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete Data from DB
const deleteData = async () => {
  try {
    await Trainer.deleteMany();
    await Workout.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') importData();
else if (process.argv[2] === '-d') deleteData();
