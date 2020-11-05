const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Initialize app
const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Routes
const workoutRoutes = require('./api/workout/workout.routes');
app.use('/api/v1/workouts', workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode in port ${PORT}`)
);
