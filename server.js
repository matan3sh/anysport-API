const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Initialize app
const app = express();

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Connect to database
connectDB();

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //  10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const trainersRoutes = require('./api/trainer/trainer.routes');
app.use('/api/v1/trainers', trainersRoutes);
const workoutsRoutes = require('./api/workout/workout.routes');
app.use('/api/v1/workouts', workoutsRoutes);
const authRoutes = require('./api/auth/auth.routes');
app.use('/api/v1/auth', authRoutes);
const userRoutes = require('./api/user/user.routes');
app.use('/api/v1/users', userRoutes);
const adminRoutes = require('./api/admin/admin.routes');
app.use('/api/v1/admin', adminRoutes);
const reviewRoutes = require('./api/review/review.routes');
app.use('/api/v1/reviews', reviewRoutes);

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
