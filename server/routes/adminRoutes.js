const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllRestaurantsAdmin,
  approveRestaurant,
  toggleFeatured,
  getAllOrdersAdmin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/restaurants', getAllRestaurantsAdmin);
router.patch('/restaurants/:id/approve', approveRestaurant);
router.patch('/restaurants/:id/toggle-featured', toggleFeatured);
router.get('/orders', getAllOrdersAdmin);

module.exports = router;
