const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);

module.exports = router;
