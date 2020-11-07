const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a workout title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    duration: {
      type: Number,
      required: [true, 'Please add a workout duration in minutes'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a workout price'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    zoomLink: String,
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trainer',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workout', WorkoutSchema);
