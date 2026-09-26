const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please write a review comment']
    }
  },
  {
    timestamps: true
  }
);

// Static method to recalculate average rating for a restaurant
reviewSchema.statics.calculateAverageRating = async function (restaurantId) {
  const stats = await this.aggregate([
    {
      $match: { restaurant: restaurantId }
    },
    {
      $group: {
        _id: '$restaurant',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId, {
      rating: 0,
      numReviews: 0
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.restaurant);
});

reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.restaurant);
});

module.exports = mongoose.model('Review', reviewSchema);
