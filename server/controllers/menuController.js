const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get all menu items for a restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public
const getMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a menu item
// @route   POST /api/menu
// @access  Private (Owner only)
const addMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, isVeg, popular } = req.body;

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'You need to set up your restaurant profile first before adding dishes.'
      });
    }

    const menuItem = await MenuItem.create({
      restaurant: restaurant._id,
      name,
      description,
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isVeg: isVeg !== undefined ? isVeg : true,
      popular: popular || false
    });

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      item: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (Owner only)
const updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant || menuItem.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this menu item' });
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      item: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (Owner only)
const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant || menuItem.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this menu item' });
    }

    await menuItem.deleteOne();

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item availability (in stock / out of stock)
// @route   PATCH /api/menu/:id/toggle-availability
// @access  Private (Owner only)
const toggleItemAvailability = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant || menuItem.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({
      success: true,
      message: `Item is now marked as ${menuItem.isAvailable ? 'Available' : 'Out of Stock'}`,
      item: menuItem
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability
};
