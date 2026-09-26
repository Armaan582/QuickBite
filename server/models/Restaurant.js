const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    cuisines: [
      {
        type: String,
        required: true
      }
    ],
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true }
    },
    phone: {
      type: String,
      default: ''
    },
    openingHours: {
      open: { type: String, default: '09:00 AM' },
      close: { type: String, default: '10:00 PM' }
    },
    deliveryTime: {
      type: String,
      default: '25-35 min'
    },
    deliveryFee: {
      type: Number,
      default: 2.99
    },
    minOrder: {
      type: Number,
      default: 10.00
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
