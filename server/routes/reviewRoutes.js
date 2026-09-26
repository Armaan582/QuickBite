const express = require('express');
const router = express.Router();
const {
  addReview,
  getRestaurantReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.post('/', protect, authorize('user'), addReview);

module.exports = router;
