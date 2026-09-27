const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add your MongoDB Atlas connection string to server/.env.');
  }
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Atlas Connected for Seeding: ${conn.connection.host}`);
};

// This script intentionally clears collections before adding fixtures. It is for a local/demo
// database only—never run it against production data without an explicit backup and approval.
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing demo data...');
    await Promise.all([
      User.deleteMany(), Restaurant.deleteMany(), MenuItem.deleteMany(),
      Order.deleteMany(), Review.deleteMany(), Coupon.deleteMany()
    ]);

    console.log('Creating India-first demo users...');
    const users = await User.create([
      {
        name: 'Rohan Mehta', email: 'admin@quickbite.com', password: 'admin123', role: 'admin',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        addresses: [{ street: 'SCO 17, Sector 17', city: 'Chandigarh', state: 'Chandigarh', zip: '160017', isDefault: true }]
      },
      {
        name: 'Harpreet Singh', email: 'owner.amritsar@quickbite.com', password: 'owner123', role: 'restaurant_owner',
        phone: '+91 98765 43211',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
        addresses: [{ street: 'SCO 28, Sector 17', city: 'Chandigarh', state: 'Chandigarh', zip: '160017', isDefault: true }]
      },
      {
        name: 'Simran Kaur', email: 'owner.biryani@quickbite.com', password: 'owner123', role: 'restaurant_owner',
        phone: '+91 98765 43212',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        addresses: [{ street: 'SCO 42, Phase 7', city: 'Mohali', state: 'Punjab', zip: '160059', isDefault: true }]
      },
      {
        name: 'Priya Sharma', email: 'owner.tandoor@quickbite.com', password: 'owner123', role: 'restaurant_owner',
        phone: '+91 98765 43213',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        addresses: [{ street: 'SCO 12, Sector 11', city: 'Panchkula', state: 'Haryana', zip: '134109', isDefault: true }]
      },
      {
        name: 'Gurpreet Kaur', email: 'owner.chaat@quickbite.com', password: 'owner123', role: 'restaurant_owner',
        phone: '+91 98765 43214',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        addresses: [{ street: 'SCO 8, Sector 22', city: 'Chandigarh', state: 'Chandigarh', zip: '160022', isDefault: true }]
      },
      {
        name: 'Armaan Singh', email: 'user@quickbite.com', password: 'user123', role: 'user',
        phone: '+91 98765 43215',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        addresses: [
          { street: 'House 144, Sector 35', city: 'Chandigarh', state: 'Chandigarh', zip: '160035', isDefault: true },
          { street: 'Flat 8B, Sector 70', city: 'Mohali', state: 'Punjab', zip: '160071', isDefault: false }
        ]
      },
      {
        name: 'Simran Kaur', email: 'simran@quickbite.com', password: 'user123', role: 'user',
        phone: '+91 98765 43216',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        addresses: [{ street: 'House 92, Sector 15', city: 'Panchkula', state: 'Haryana', zip: '134113', isDefault: true }]
      }
    ]);
    const [admin, owner1, owner2, owner3, owner4, customer1, customer2] = users;

    console.log('Creating India-first demo restaurants...');
    const restaurants = await Restaurant.create([
      {
        owner: owner1._id, name: 'Amritsari Zaika',
        description: 'Soulful Punjabi favourites, tandoor-kissed kebabs, buttery curries, and comforting Amritsari classics.',
        cuisines: ['North Indian', 'Punjabi', 'Tandoor', 'Biryani'],
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1400&q=80',
        rating: 4.8, numReviews: 42,
        address: { street: 'SCO 28, Sector 17', city: 'Chandigarh', state: 'Chandigarh', zip: '160017' },
        phone: '+91 98765 43211', openingHours: { open: '11:00 AM', close: '11:00 PM' },
        deliveryTime: '25-35 min', deliveryFee: 29, minOrder: 199, isOpen: true, isApproved: true, isFeatured: true
      },
      {
        owner: owner2._id, name: 'Biryani House',
        description: 'Fragrant dum biryanis layered with basmati rice, slow-cooked meats, vegetarian favourites, and raita.',
        cuisines: ['Biryani', 'Hyderabadi', 'North Indian', 'Mughlai'],
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8b8d?auto=format&fit=crop&w=1400&q=80',
        rating: 4.7, numReviews: 38,
        address: { street: 'SCO 42, Phase 7', city: 'Mohali', state: 'Punjab', zip: '160059' },
        phone: '+91 98765 43212', openingHours: { open: '11:00 AM', close: '11:30 PM' },
        deliveryTime: '20-30 min', deliveryFee: 39, minOrder: 249, isOpen: true, isApproved: true, isFeatured: true
      },
      {
        owner: owner3._id, name: 'Tandoor Tales',
        description: 'Smoky kebabs, creamy North Indian curries, fresh breads, and family-sized tandoor platters.',
        cuisines: ['North Indian', 'Tandoor', 'Kebabs', 'Punjabi'],
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
        rating: 4.9, numReviews: 56,
        address: { street: 'SCO 12, Sector 11', city: 'Panchkula', state: 'Haryana', zip: '134109' },
        phone: '+91 98765 43213', openingHours: { open: '12:00 PM', close: '10:30 PM' },
        deliveryTime: '30-40 min', deliveryFee: 29, minOrder: 199, isOpen: true, isApproved: true, isFeatured: true
      },
      {
        owner: owner4._id, name: 'Chaat Adda',
        description: 'Bright, tangy Chandigarh street-food classics, crisp chaats, stuffed kulchas, and cooling drinks.',
        cuisines: ['Street Food', 'Chaat', 'North Indian', 'Snacks'],
        image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd8?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80',
        rating: 4.6, numReviews: 29,
        address: { street: 'SCO 8, Sector 22', city: 'Chandigarh', state: 'Chandigarh', zip: '160022' },
        phone: '+91 98765 43214', openingHours: { open: '10:30 AM', close: '10:00 PM' },
        deliveryTime: '20-30 min', deliveryFee: 19, minOrder: 149, isOpen: true, isApproved: true, isFeatured: false
      }
    ]);
    const [restaurant1, restaurant2, restaurant3, restaurant4] = restaurants;

    console.log('Creating India-first menu items...');
    const menuGroups = [
      [restaurant1, [
        ['Amritsari Chole Kulche', 'Spiced chickpeas with fluffy kulchas, pickled onions, and green chutney.', 249, 'Mains', true, true, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'],
        ['Paneer Tikka Masala', 'Char-grilled paneer in a silky tomato, cashew, and fenugreek gravy.', 279, 'Main Course', true, true, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80'],
        ['Tandoori Chicken Half', 'Yoghurt-marinated chicken roasted in the tandoor with mint chutney.', 399, 'Tandoor', false, true, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80'],
        ['Dal Makhani', 'Slow-cooked black lentils finished with butter, cream, and gentle spices.', 229, 'Main Course', true, false, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'],
        ['Gulab Jamun (2 pcs)', 'Warm khoya dumplings soaked in fragrant cardamom syrup.', 99, 'Desserts', true, true, 'https://images.unsplash.com/photo-1666190092159-3171cf0f3f0f?auto=format&fit=crop&w=600&q=80'],
        ['Sweet Lassi', 'Chilled Punjabi yoghurt drink with a touch of cardamom.', 109, 'Beverages', true, false, 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80']
      ]],
      [restaurant2, [
        ['Hyderabadi Chicken Dum Biryani', 'Aromatic basmati rice layered with marinated chicken, mint, saffron, and fried onions.', 349, 'Biryani', false, true, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'],
        ['Veg Dum Biryani', 'Long-grain basmati rice, seasonal vegetables, warm spices, and raita.', 279, 'Biryani', true, true, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80'],
        ['Mutton Biryani', 'Tender slow-cooked mutton with aromatic rice and house masala.', 499, 'Biryani', false, true, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80'],
        ['Chicken 65', 'Crisp South Indian-style chicken bites tossed with curry leaves and chillies.', 269, 'Starters', false, false, 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?auto=format&fit=crop&w=600&q=80'],
        ['Raita', 'Cooling whisked yoghurt with cucumber, cumin, and coriander.', 79, 'Sides', true, false, 'https://images.unsplash.com/photo-1619894991209-9f9694be045f?auto=format&fit=crop&w=600&q=80']
      ]],
      [restaurant3, [
        ['Butter Chicken', 'Tandoor-roasted chicken in a rich tomato, butter, and fenugreek gravy.', 399, 'Main Course', false, true, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80'],
        ['Paneer Lababdar', 'Soft paneer simmered in a creamy onion-tomato masala.', 299, 'Main Course', true, true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'],
        ['Chicken Seekh Kebab', 'Smoky minced chicken kebabs served with onions and green chutney.', 329, 'Kebabs', false, true, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80'],
        ['Garlic Naan (2 pcs)', 'Fresh tandoor bread brushed with garlic butter and coriander.', 99, 'Breads', true, true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'],
        ['Masala Chaach', 'Cooling spiced buttermilk with roasted cumin and mint.', 79, 'Beverages', true, false, 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80']
      ]],
      [restaurant4, [
        ['Dahi Bhalla Papdi Chaat', 'Soft lentil dumplings and crisp papdi with yoghurt, chutneys, and sev.', 139, 'Chaat', true, true, 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd8?auto=format&fit=crop&w=600&q=80'],
        ['Pani Puri (8 pcs)', 'Crisp puris with spicy mint water, tamarind chutney, and potato filling.', 99, 'Chaat', true, true, 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd8?auto=format&fit=crop&w=600&q=80'],
        ['Aloo Tikki Chaat', 'Crisp potato tikki topped with chole, yoghurt, chutneys, and sev.', 129, 'Chaat', true, true, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80'],
        ['Chole Bhature', 'Fluffy bhature served with spicy chickpeas, onion salad, and pickle.', 199, 'Mains', true, false, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'],
        ['Kulhad Kesar Milk', 'Warm saffron milk served in a traditional clay cup.', 89, 'Beverages', true, false, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80']
      ]]
    ];

    for (const [restaurant, items] of menuGroups) {
      await MenuItem.create(items.map(([name, description, price, category, isVeg, popular, image]) => ({
        restaurant: restaurant._id, name, description, price, category, image, isVeg, popular
      })));
    }

    console.log('Creating India-first coupons...');
    await Coupon.create([
      { code: 'WELCOME50', description: '50% off on your first order up to ₹150', discountPercent: 50, maxDiscount: 150, minOrderAmount: 499, isActive: true },
      { code: 'TASTY20', description: '20% off on weekend feasts up to ₹100', discountPercent: 20, maxDiscount: 100, minOrderAmount: 399, isActive: true },
      { code: 'FEAST10', description: '10% off on family orders above ₹999', discountPercent: 10, maxDiscount: 250, minOrderAmount: 999, isActive: true }
    ]);

    console.log('Creating sample orders and reviews...');
    const amritsarItems = await MenuItem.find({ restaurant: restaurant1._id });
    const deliveryAddress = { street: 'House 144, Sector 35', city: 'Chandigarh', state: 'Chandigarh', zip: '160035', phone: '+91 98765 43215' };

    await Order.create([
      {
        user: customer1._id, restaurant: restaurant1._id,
        items: [
          { menuItem: amritsarItems[0]._id, name: amritsarItems[0].name, price: amritsarItems[0].price, quantity: 2, image: amritsarItems[0].image },
          { menuItem: amritsarItems[4]._id, name: amritsarItems[4].name, price: amritsarItems[4].price, quantity: 1, image: amritsarItems[4].image }
        ],
        subtotal: 597, deliveryFee: 29, tax: 48, discount: 100, couponCode: 'TASTY20', totalAmount: 574,
        paymentMethod: 'UPI', paymentStatus: 'Paid', deliveryAddress, orderStatus: 'Delivered',
        statusHistory: [
          { status: 'Placed', timestamp: new Date(Date.now() - 7200000), note: 'Order placed' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 6480000), note: 'Restaurant confirmed order' },
          { status: 'Preparing', timestamp: new Date(Date.now() - 5400000), note: 'Kitchen preparing dishes' },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 4320000), note: 'Delivery partner is on the way' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 2880000), note: 'Delivered safely to your doorstep' }
        ]
      },
      {
        user: customer1._id, restaurant: restaurant1._id,
        items: [
          { menuItem: amritsarItems[1]._id, name: amritsarItems[1].name, price: amritsarItems[1].price, quantity: 1, image: amritsarItems[1].image },
          { menuItem: amritsarItems[2]._id, name: amritsarItems[2].name, price: amritsarItems[2].price, quantity: 1, image: amritsarItems[2].image }
        ],
        subtotal: 678, deliveryFee: 29, tax: 54, discount: 0, couponCode: '', totalAmount: 761,
        paymentMethod: 'UPI', paymentStatus: 'Paid', deliveryAddress, orderStatus: 'Preparing',
        statusHistory: [
          { status: 'Placed', timestamp: new Date(Date.now() - 600000), note: 'Order placed by customer' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 400000), note: 'Accepted by Amritsari Zaika' },
          { status: 'Preparing', timestamp: new Date(Date.now() - 120000), note: 'Chef is preparing your order' }
        ]
      }
    ]);

    await Review.create([
      { user: customer1._id, restaurant: restaurant1._id, rating: 5, comment: 'The chole kulche tasted just like a Chandigarh favourite. Fresh, hot, and perfectly packed.' },
      { user: customer2._id, restaurant: restaurant1._id, rating: 5, comment: 'Wonderful paneer tikka masala and a very refreshing lassi.' },
      { user: customer1._id, restaurant: restaurant2._id, rating: 5, comment: 'The chicken dum biryani was fragrant and generous. Will order again.' },
      { user: customer2._id, restaurant: restaurant3._id, rating: 5, comment: 'Excellent kebabs and butter chicken—our family loved the tandoor platter.' }
    ]);

    console.log('✅ India-first demo seeding completed successfully!');
    console.log('DEMO CREDENTIALS:');
    console.log('Admin:              admin@quickbite.com / admin123');
    console.log('Owner (Amritsari):  owner.amritsar@quickbite.com / owner123');
    console.log('Owner (Biryani):    owner.biryani@quickbite.com / owner123');
    console.log('Customer:           user@quickbite.com / user123');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
