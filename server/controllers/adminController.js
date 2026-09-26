const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get admin platform analytics & stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'restaurant_owner' });
    const totalRestaurants = await Restaurant.countDocuments();
    const approvedRestaurants = await Restaurant.countDocuments({ isApproved: true });
    const pendingRestaurants = await Restaurant.countDocuments({ isApproved: false });

    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.find({ orderStatus: 'Delivered' });
    const activeOrders = await Order.countDocuments({
      orderStatus: { $in: ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery'] }
    });

    const totalGrossRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const platformCommission = Math.round(totalGrossRevenue * 0.15 * 100) / 100; // 15% platform commission

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      stats: {
        totalGrossRevenue: Math.round(totalGrossRevenue * 100) / 100,
        platformCommission,
        totalOrders,
        activeOrders,
        totalUsers,
        totalOwners,
        totalRestaurants,
        approvedRestaurants,
        pendingRestaurants,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and role filter
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (active / suspended)
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin status cannot be modified' });
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${user.status}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurants for admin management
// @route   GET /api/admin/restaurants
// @access  Private (Admin only)
const getAllRestaurantsAdmin = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } }
      ];
    }

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject restaurant
// @route   PATCH /api/admin/restaurants/:id/approve
// @access  Private (Admin only)
const approveRestaurant = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    restaurant.isApproved = isApproved !== undefined ? isApproved : !restaurant.isApproved;
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant is now ${restaurant.isApproved ? 'Approved' : 'Pending/Suspended'}`,
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured restaurant
// @route   PATCH /api/admin/restaurants/:id/toggle-featured
// @access  Private (Admin only)
const toggleFeatured = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    restaurant.isFeatured = !restaurant.isFeatured;
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant is now ${restaurant.isFeatured ? 'Featured' : 'Standard'}`,
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders platform-wide for admin
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, restaurantId } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (restaurantId) {
      query.restaurant = restaurantId;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllRestaurantsAdmin,
  approveRestaurant,
  toggleFeatured,
  getAllOrdersAdmin
};
