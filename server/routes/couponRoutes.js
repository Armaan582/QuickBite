const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/validate', validateCoupon);
router.get('/', getCoupons);
router.post('/', protect, authorize('admin'), createCoupon);
router.patch('/:id/toggle', protect, authorize('admin'), toggleCouponStatus);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

module.exports = router;
