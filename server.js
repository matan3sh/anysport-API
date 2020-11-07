const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Connect to database
connectDB();

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Routes
const trainersRoutes = require('./api/trainer/trainer.routes');
app.use('/api/v1/trainers', trainersRoutes);
const workoutsRoutes = require('./api/workout/workout.routes');
app.use('/api/v1/workouts', workoutsRoutes);

// Custom ErrorHandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode in port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
