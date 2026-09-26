const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getOwnerAnalytics
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, authorize('user'), createOrder);
router.get('/my-orders', protect, authorize('user'), getMyOrders);

// Owner routes
router.get('/restaurant/orders', protect, authorize('restaurant_owner'), getRestaurantOrders);
router.get('/restaurant/analytics', protect, authorize('restaurant_owner'), getOwnerAnalytics);

// Shared/Role-checked routes
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorize('restaurant_owner', 'admin'), updateOrderStatus);

module.exports = router;
