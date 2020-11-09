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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get avg of workout price
WorkoutSchema.statics.getAverageCost = async function (trainerId) {
  const obj = await this.aggregate([
    {
      $match: { trainer: trainerId },
    },
    {
      $group: {
        _id: '$trainer',
        averageCost: { $avg: '$price' },
      },
    },
  ]);
  try {
    await this.model('Trainer').findByIdAndUpdate(trainerId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageCost after save
WorkoutSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.trainer);
});

// Call getAverageCost before remove
WorkoutSchema.post('remove', async function () {
  await this.constructor.getAverageCost(this.trainer);
});

module.exports = mongoose.model('Workout', WorkoutSchema);
