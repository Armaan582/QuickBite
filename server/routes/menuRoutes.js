const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public
router.get('/:restaurantId', getMenuItems);

// Owner protected
router.post('/', protect, authorize('restaurant_owner'), addMenuItem);
router.put('/:id', protect, authorize('restaurant_owner'), updateMenuItem);
router.delete('/:id', protect, authorize('restaurant_owner'), deleteMenuItem);
router.patch('/:id/toggle-availability', protect, authorize('restaurant_owner'), toggleItemAvailability);

module.exports = router;
