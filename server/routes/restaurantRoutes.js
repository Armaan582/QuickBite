const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createOrUpdateMyRestaurant,
  toggleRestaurantStatus,
  getCuisinesList
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllRestaurants);
router.get('/cuisines', getCuisinesList);

// Owner-specific routes
router.get('/owner/me', protect, authorize('restaurant_owner'), getMyRestaurant);
router.post('/owner/profile', protect, authorize('restaurant_owner'), createOrUpdateMyRestaurant);
router.patch('/owner/toggle-status', protect, authorize('restaurant_owner'), toggleRestaurantStatus);

// Single restaurant by ID (keep at bottom to avoid catching subpaths)
router.get('/:id', getRestaurantById);

module.exports = router;
