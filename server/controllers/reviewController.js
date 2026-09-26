const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Add review for a restaurant
// @route   POST /api/reviews
// @access  Private (Customer)
const addReview = async (req, res, next) => {
  try {
    const { restaurantId, rating, comment, orderId } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and review comment' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const review = await Review.create({
      user: req.user.id,
      restaurant: restaurantId,
      order: orderId || null,
      rating: Number(rating),
      comment
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
const getRestaurantReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getRestaurantReviews
};
