const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, 'Please add some text'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
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

// Prevent user from submitting more then one review per trainer
ReviewSchema.index({ trainer: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (trainerId) {
  const obj = await this.aggregate([
    {
      $match: { trainer: trainerId },
    },
    {
      $group: {
        _id: '$trainer',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await this.model('Trainer').findByIdAndUpdate(trainerId, {
      averageRating: obj.length > 0 ? obj[0].averageRating : 0,
    });
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.trainer);
});

// Call getAverageCost before remove
ReviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.trainer);
});

module.exports = mongoose.model('Review', ReviewSchema);
