const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../../utils/geocoder');

const TrainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more then 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more then 500 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    types: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'Cardio',
        'Calisthenics',
        'Crossfit',
        'Functional',
        'Kickboxing',
        'Pilatis',
        'Weight',
        'Yoga',
        'Zumba',
      ],
    },
    // date: {
    //   type: Date,
    //   required: [true, 'Please add a workout date'],
    // },
    // duration: {
    //   type: Number,
    //   required: [true, 'Please add a workout duration in minutes'],
    // },
    // from: {
    //   type: String,
    //   required: [true, 'Please add a workout start hour'],
    // },
    // to: {
    //   type: String,
    //   required: [true, 'Please add a workout end hour'],
    // },
    // level: {
    //   type: String,
    //   required: [true, 'Please add workout level'],
    // },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

// Create workout slug from the name
TrainerSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
TrainerSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode || loc[0].country,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  // Do not save address in DB
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Trainer', TrainerSchema);
