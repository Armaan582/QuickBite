const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');

// @desc    Get all approved restaurants with filtering, search & sorting
// @route   GET /api/restaurants
// @access  Public
const getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, rating, sort, isOpen } = req.query;

    let query = { isApproved: true };

    // Search by name or cuisine
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Cuisine filter
    if (cuisine && cuisine !== 'All') {
      query.cuisines = { $in: [new RegExp(`^${cuisine}$`, 'i')] };
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Open status filter
    if (isOpen !== undefined) {
      query.isOpen = isOpen === 'true';
    }

    let result = Restaurant.find(query);

    // Sorting
    if (sort === 'rating') {
      result = result.sort({ rating: -1 });
    } else if (sort === 'deliveryTime') {
      result = result.sort({ deliveryFee: 1 });
    } else if (sort === 'newest') {
      result = result.sort({ createdAt: -1 });
    } else {
      result = result.sort({ isFeatured: -1, rating: -1 });
    }

    const restaurants = await result.populate('owner', 'name email');

    res.json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant by ID with its menu & reviews
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email phone');

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Fetch menu items
    const menuItems = await MenuItem.find({ restaurant: restaurant._id });

    // Fetch recent reviews
    const reviews = await Review.find({ restaurant: restaurant._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(15);

    // Group menu items by category
    const categoriesMap = {};
    menuItems.forEach((item) => {
      if (!categoriesMap[item.category]) {
        categoriesMap[item.category] = [];
      }
      categoriesMap[item.category].push(item);
    });

    const categorizedMenu = Object.keys(categoriesMap).map((categoryName) => ({
      category: categoryName,
      items: categoriesMap[categoryName]
    }));

    res.json({
      success: true,
      restaurant,
      menuItems,
      categorizedMenu,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current owner's restaurant profile
// @route   GET /api/restaurants/owner/me
// @access  Private (Owner only)
const getMyRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(200).json({
        success: true,
        hasRestaurant: false,
        restaurant: null,
        message: 'No restaurant profile found. Please create one.'
      });
    }

    const menuItems = await MenuItem.find({ restaurant: restaurant._id });

    res.json({
      success: true,
      hasRestaurant: true,
      restaurant,
      menuCount: menuItems.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update owner's restaurant profile
// @route   POST /api/restaurants/owner/profile
// @access  Private (Owner only)
const createOrUpdateMyRestaurant = async (req, res, next) => {
  try {
    const {
      name,
      description,
      cuisines,
      image,
      bannerImage,
      address,
      phone,
      openingHours,
      deliveryTime,
      deliveryFee,
      minOrder,
      isOpen
    } = req.body;

    let restaurant = await Restaurant.findOne({ owner: req.user.id });

    const cuisinesArray = Array.isArray(cuisines)
      ? cuisines
      : (typeof cuisines === 'string' ? cuisines.split(',').map(c => c.trim()) : []);

    const restaurantFields = {
      owner: req.user.id,
      name,
      description,
      cuisines: cuisinesArray,
      image: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      address,
      phone: phone || req.user.phone || '',
      openingHours: openingHours || { open: '09:00 AM', close: '10:00 PM' },
      deliveryTime: deliveryTime || '25-35 min',
      deliveryFee: deliveryFee !== undefined ? Number(deliveryFee) : 2.99,
      minOrder: minOrder !== undefined ? Number(minOrder) : 10.0,
      isOpen: isOpen !== undefined ? isOpen : true
    };

    if (restaurant) {
      // Update existing
      restaurant = await Restaurant.findOneAndUpdate(
        { owner: req.user.id },
        { $set: restaurantFields },
        { new: true, runValidators: true }
      );

      return res.json({
        success: true,
        message: 'Restaurant profile updated successfully',
        restaurant
      });
    }

    // Create new
    restaurant = await Restaurant.create(restaurantFields);

    res.status(201).json({
      success: true,
      message: 'Restaurant registered successfully!',
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle restaurant open/closed status
// @route   PATCH /api/restaurants/owner/toggle-status
// @access  Private (Owner only)
const toggleRestaurantStatus = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant is now ${restaurant.isOpen ? 'OPEN' : 'CLOSED'} for orders`,
      isOpen: restaurant.isOpen
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct cuisines for filter tabs
// @route   GET /api/restaurants/cuisines
// @access  Public
const getCuisinesList = async (req, res, next) => {
  try {
    const cuisines = await Restaurant.distinct('cuisines', { isApproved: true });
    res.json({
      success: true,
      cuisines: ['All', ...cuisines]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createOrUpdateMyRestaurant,
  toggleRestaurantStatus,
  getCuisinesList
};
