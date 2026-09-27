const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Coupon = require('../models/Coupon');

// @desc    Create new food order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      couponCode,
      customerNote
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (!restaurant.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'This restaurant is currently closed and not accepting orders.'
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const itemTotal = Number(item.price) * Number(item.quantity);
      subtotal += itemTotal;
      return {
        menuItem: item._id || item.menuItem,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image
      };
    });

    if (subtotal < restaurant.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this restaurant is ₹${restaurant.minOrder.toFixed(0)}`
      });
    }

    const deliveryFee = Number(restaurant.deliveryFee) || 0;
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax

    // Calculate coupon discount
    let discount = 0;
    let appliedCoupon = '';
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true
      });
      if (coupon && subtotal >= coupon.minOrderAmount) {
        const rawDiscount = (subtotal * coupon.discountPercent) / 100;
        discount = Math.min(rawDiscount, coupon.maxDiscount);
        discount = Math.round(discount * 100) / 100;
        appliedCoupon = coupon.code;
      }
    }

    const totalAmount = Math.max(0, Math.round((subtotal + deliveryFee + tax - discount) * 100) / 100);

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      couponCode: appliedCoupon,
      paymentMethod: paymentMethod || 'CARD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      deliveryAddress,
      customerNote: customerNote || '',
      estimatedDeliveryTime: restaurant.deliveryTime || '30-40 mins',
      orderStatus: 'Placed',
      statusHistory: [
        {
          status: 'Placed',
          timestamp: new Date(),
          note: 'Order placed successfully by customer.'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name image address phone')
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

// @desc    Get single order details & tracking
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name image address phone cuisines rating');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check: User who placed it, Owner of the restaurant, or Admin
    const isCustomer = order.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    let isOwner = false;
    if (req.user.role === 'restaurant_owner') {
      const ownerRestaurant = await Restaurant.findOne({ owner: req.user.id });
      if (ownerRestaurant && ownerRestaurant._id.toString() === order.restaurant._id.toString()) {
        isOwner = true;
      }
    }

    if (!isCustomer && !isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant owner's incoming and past orders
// @route   GET /api/orders/restaurant/orders
// @access  Private (Owner only)
const getRestaurantOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found for this owner' });
    }

    const { status } = req.query;
    let query = { restaurant: restaurant._id };

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone email')
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

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Owner / Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If owner, ensure they own this restaurant
    if (req.user.role === 'restaurant_owner') {
      const restaurant = await Restaurant.findOne({ owner: req.user.id });
      if (!restaurant || restaurant._id.toString() !== order.restaurant.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
      }
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner analytics / sales stats
// @route   GET /api/orders/restaurant/analytics
// @access  Private (Owner only)
const getOwnerAnalytics = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant profile not found' });
    }

    const orders = await Order.find({ restaurant: restaurant._id });

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');
    const activeOrders = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.orderStatus));
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled');

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

    // Group items sold
    const itemSalesMap = {};
    completedOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!itemSalesMap[item.name]) {
          itemSalesMap[item.name] = { name: item.name, count: 0, revenue: 0 };
        }
        itemSalesMap[item.name].count += item.quantity;
        itemSalesMap[item.name].revenue += item.price * item.quantity;
      });
    });

    const popularDishes = Object.values(itemSalesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        completedCount: completedOrders.length,
        activeCount: activeOrders.length,
        cancelledCount: cancelledOrders.length,
        popularDishes,
        restaurantName: restaurant.name,
        rating: restaurant.rating,
        numReviews: restaurant.numReviews
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getOwnerAnalytics
};
