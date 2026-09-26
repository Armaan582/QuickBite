const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set. Add your MongoDB Atlas connection string to server/.env.');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Atlas Connected for Seeding: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();

    console.log('Creating demo users...');

    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@foodie.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '100 Tech Blvd, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          zip: '94107',
          isDefault: true
        }
      ]
    });

    const owner1 = await User.create({
      name: 'Mario Rossi',
      email: 'owner.pizza@foodie.com',
      password: 'owner123',
      role: 'restaurant_owner',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '124 Little Italy Way',
          city: 'New York',
          state: 'NY',
          zip: '10013',
          isDefault: true
        }
      ]
    });

    const owner2 = await User.create({
      name: 'Jake Miller',
      email: 'owner.burger@foodie.com',
      password: 'owner123',
      role: 'restaurant_owner',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '450 Downtown Grill Ave',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          isDefault: true
        }
      ]
    });

    const owner3 = await User.create({
      name: 'Kenji Sato',
      email: 'owner.sushi@foodie.com',
      password: 'owner123',
      role: 'restaurant_owner',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '780 Sakura Way',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          isDefault: true
        }
      ]
    });

    const owner4 = await User.create({
      name: 'Priya Sharma',
      email: 'owner.curry@foodie.com',
      password: 'owner123',
      role: 'restaurant_owner',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '920 Spice Garden Rd',
          city: 'Chicago',
          state: 'IL',
          zip: '60611',
          isDefault: true
        }
      ]
    });

    const customer1 = await User.create({
      name: 'Alex Johnson',
      email: 'user@foodie.com',
      password: 'user123',
      role: 'user',
      phone: '+1 (555) 890-1234',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zip: '97477',
          isDefault: true
        },
        {
          street: '55 2nd Street, Apt 8B',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          isDefault: false
        }
      ]
    });

    const customer2 = await User.create({
      name: 'Sarah Parker',
      email: 'sarah@foodie.com',
      password: 'user123',
      role: 'user',
      phone: '+1 (555) 901-2345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          street: '320 Sunset Boulevard',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90028',
          isDefault: true
        }
      ]
    });

    console.log('Creating restaurants...');

    const restaurant1 = await Restaurant.create({
      owner: owner1._id,
      name: 'Bella Italia Trattoria',
      description: 'Authentic stone-baked woodfired pizzas, handmade pasta, and classic Italian antipasti crafted with imported Italian ingredients.',
      cuisines: ['Italian', 'Pizza', 'Pasta', 'Mediterranean'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      numReviews: 42,
      address: {
        street: '124 Little Italy Way',
        city: 'New York',
        state: 'NY',
        zip: '10013'
      },
      phone: '+1 (555) 234-5678',
      openingHours: { open: '11:00 AM', close: '11:00 PM' },
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      minOrder: 15.00,
      isOpen: true,
      isApproved: true,
      isFeatured: true
    });

    const restaurant2 = await Restaurant.create({
      owner: owner2._id,
      name: 'The Burger Craft & Grills',
      description: 'Gourmet smashed beef burgers, crispy buttermilk fried chicken, golden waffle fries, and thick decadent milkshakes.',
      cuisines: ['Burgers', 'American', 'Fast Food', 'Wings'],
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1400&q=80',
      rating: 4.7,
      numReviews: 38,
      address: {
        street: '450 Downtown Grill Ave',
        city: 'Austin',
        state: 'TX',
        zip: '78701'
      },
      phone: '+1 (555) 345-6789',
      openingHours: { open: '10:30 AM', close: '11:30 PM' },
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      minOrder: 12.00,
      isOpen: true,
      isApproved: true,
      isFeatured: true
    });

    const restaurant3 = await Restaurant.create({
      owner: owner3._id,
      name: 'Sakura Japanese & Sushi Bar',
      description: 'Artisanal nigiri, fresh sashimi platters, specialty maki rolls, and rich 24-hour slow-simmered tonkotsu ramen broth.',
      cuisines: ['Japanese', 'Sushi', 'Asian', 'Ramen'],
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      numReviews: 56,
      address: {
        street: '780 Sakura Way',
        city: 'Seattle',
        state: 'WA',
        zip: '98101'
      },
      phone: '+1 (555) 456-7890',
      openingHours: { open: '12:00 PM', close: '10:00 PM' },
      deliveryTime: '30-45 min',
      deliveryFee: 3.49,
      minOrder: 20.00,
      isOpen: true,
      isApproved: true,
      isFeatured: true
    });

    const restaurant4 = await Restaurant.create({
      owner: owner4._id,
      name: 'Spice Route Indian Bistro',
      description: 'Rich aromatic butter chicken, fragrant dum biryanis, crispy garlic naans, and fiery tandoori sizzling platters.',
      cuisines: ['Indian', 'Curry', 'Biryani', 'Vegetarian'],
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1400&q=80',
      rating: 4.6,
      numReviews: 29,
      address: {
        street: '920 Spice Garden Rd',
        city: 'Chicago',
        state: 'IL',
        zip: '60611'
      },
      phone: '+1 (555) 567-8901',
      openingHours: { open: '11:30 AM', close: '10:30 PM' },
      deliveryTime: '25-40 min',
      deliveryFee: 2.49,
      minOrder: 15.00,
      isOpen: true,
      isApproved: true,
      isFeatured: false
    });

    console.log('Creating menu items...');

    // Bella Italia Menu
    await MenuItem.create([
      {
        restaurant: restaurant1._id,
        name: 'Margherita Burrata Pizza',
        description: 'San Marzano tomato sauce, fresh buffalo burrata, sweet basil, and extra virgin olive oil.',
        price: 16.99,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: true
      },
      {
        restaurant: restaurant1._id,
        name: 'Truffle Mushroom Fettuccine',
        description: 'Fresh handmade pasta ribbons tossed in creamy black truffle butter sauce with wild porcini mushrooms.',
        price: 19.50,
        category: 'Pastas',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810d4?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: true
      },
      {
        restaurant: restaurant1._id,
        name: 'Diavola Spicy Pepperoni Pizza',
        description: 'Spicy Calabrian salami, crushed red pepper flakes, smoked provolone, and fresh mozzarella.',
        price: 18.50,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant1._id,
        name: 'Crispy Calamari Fritti',
        description: 'Tender golden squid rings served with house spicy marinara and lemon garlic aioli.',
        price: 12.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: false
      },
      {
        restaurant: restaurant1._id,
        name: 'Classic Espresso Tiramisu',
        description: 'Ladyfingers soaked in dark espresso and marsala wine, layered with mascarpone cream and cocoa powder.',
        price: 8.50,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: true
      },
      {
        restaurant: restaurant1._id,
        name: 'San Pellegrino Sparkling Blood Orange',
        description: 'Chilled Italian sparkling beverage made with real Mediterranean blood orange juice.',
        price: 3.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: false
      }
    ]);

    // Burger Craft Menu
    await MenuItem.create([
      {
        restaurant: restaurant2._id,
        name: 'Double Smokehouse Bacon Cheeseburger',
        description: 'Two smashed Angus beef patties, aged cheddar, applewood smoked bacon, crispy onion straws, and BBQ aioli.',
        price: 14.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant2._id,
        name: 'Nashville Hot Crispy Chicken Sandwich',
        description: 'Buttermilk fried chicken breast drenched in cayenne chili glaze, dill pickles, and creamy coleslaw on brioche.',
        price: 13.50,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant2._id,
        name: 'Truffle Parmesan Loaded Fries',
        description: 'Crispy skin-on fries tossed with white truffle oil, shaved parmesan cheese, and fresh parsley.',
        price: 7.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: true
      },
      {
        restaurant: restaurant2._id,
        name: 'Buffalo Chicken Wings (10 pcs)',
        description: 'Jumbo crispy chicken wings tossed in fiery classic Buffalo sauce, served with celery and ranch dip.',
        price: 13.99,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: false
      },
      {
        restaurant: restaurant2._id,
        name: 'Salted Caramel Milkshake',
        description: 'Hand-spun vanilla bean ice cream blended with homemade salted caramel and topped with whipped cream.',
        price: 6.50,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: false
      }
    ]);

    // Sakura Sushi Menu
    await MenuItem.create([
      {
        restaurant: restaurant3._id,
        name: 'Dragon Roll (8 pcs)',
        description: 'Tempura shrimp and cucumber inside, layered with sliced avocado, grilled unagi eel, and sweet kabayaki sauce.',
        price: 17.50,
        category: 'Special Rolls',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant3._id,
        name: 'Spicy Salmon & Tuna Poke Bowl',
        description: 'Sashimi-grade salmon and ahi tuna, edamame, cucumber, wakame seaweed, spicy mayo over sushi rice.',
        price: 16.99,
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant3._id,
        name: 'Tokyo Tonkotsu Ramen',
        description: 'Rich slow-simmered pork broth, springy ramen noodles, chashu pork belly, ajitsuke egg, nori, and scallions.',
        price: 15.99,
        category: 'Ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant3._id,
        name: 'Crispy Vegetable Gyoza (6 pcs)',
        description: 'Pan-seared Japanese dumplings filled with cabbage, mushrooms, and ginger, served with ponzu dipping sauce.',
        price: 7.99,
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: false
      },
      {
        restaurant: restaurant3._id,
        name: 'Matcha Green Tea Cheesecake',
        description: 'Japanese style creamy baked cheesecake infused with ceremonial grade Uji matcha green tea.',
        price: 7.50,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: false
      }
    ]);

    // Spice Route Menu
    await MenuItem.create([
      {
        restaurant: restaurant4._id,
        name: 'Old Delhi Butter Chicken',
        description: 'Tender tandoor-roasted chicken simmered in a velvet tomato, butter, and fenugreek cashew cream gravy.',
        price: 16.50,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant4._id,
        name: 'Hyderabadi Chicken Dum Biryani',
        description: 'Fragrant long-grain basmati rice layered with marinated chicken, saffron, mint, and fried onions. Served with raita.',
        price: 15.99,
        category: 'Biryani & Rice',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        isVeg: false,
        popular: true
      },
      {
        restaurant: restaurant4._id,
        name: 'Paneer Tikka Masala',
        description: 'Char-grilled cottage cheese cubes cooked in rich spiced onion-tomato masala sauce.',
        price: 14.99,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: true
      },
      {
        restaurant: restaurant4._id,
        name: 'Butter Garlic Naan (2 pcs)',
        description: 'Tandoor-baked leavened flatbread brushed with garlic butter and fresh coriander.',
        price: 4.50,
        category: 'Breads & Sides',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: true
      },
      {
        restaurant: restaurant4._id,
        name: 'Mango Cardamom Lassi',
        description: 'Refreshing chilled yogurt drink blended with Alphonso mango pulp and fragrant green cardamom.',
        price: 4.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        popular: false
      }
    ]);

    console.log('Creating coupons...');

    await Coupon.create([
      {
        code: 'WELCOME50',
        description: '50% off on your first order up to $15',
        discountPercent: 50,
        maxDiscount: 15,
        minOrderAmount: 20,
        isActive: true
      },
      {
        code: 'TASTY20',
        description: '20% off on all weekend feasts up to $10',
        discountPercent: 20,
        maxDiscount: 10,
        minOrderAmount: 15,
        isActive: true
      },
      {
        code: 'FEAST10',
        description: '10% off on bulk orders over $30',
        discountPercent: 10,
        maxDiscount: 25,
        minOrderAmount: 30,
        isActive: true
      }
    ]);

    console.log('Creating sample orders...');

    const pizzaItems = await MenuItem.find({ restaurant: restaurant1._id });

    // Delivered Order
    await Order.create({
      user: customer1._id,
      restaurant: restaurant1._id,
      items: [
        {
          menuItem: pizzaItems[0]._id,
          name: pizzaItems[0].name,
          price: pizzaItems[0].price,
          quantity: 2,
          image: pizzaItems[0].image
        },
        {
          menuItem: pizzaItems[4]._id,
          name: pizzaItems[4].name,
          price: pizzaItems[4].price,
          quantity: 1,
          image: pizzaItems[4].image
        }
      ],
      subtotal: 42.48,
      deliveryFee: 2.99,
      tax: 3.40,
      discount: 10.00,
      couponCode: 'TASTY20',
      totalAmount: 38.87,
      paymentMethod: 'CARD',
      paymentStatus: 'Paid',
      deliveryAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        phone: '+1 (555) 890-1234'
      },
      orderStatus: 'Delivered',
      statusHistory: [
        { status: 'Placed', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Order placed' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 1.8), note: 'Restaurant confirmed order' },
        { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 1.5), note: 'Kitchen preparing dishes' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 1.2), note: 'Rider is on the way' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 3600000 * 0.8), note: 'Delivered safely to door' }
      ]
    });

    // Active Live Order (In preparation stage for demo live tracking)
    await Order.create({
      user: customer1._id,
      restaurant: restaurant1._id,
      items: [
        {
          menuItem: pizzaItems[1]._id,
          name: pizzaItems[1].name,
          price: pizzaItems[1].price,
          quantity: 1,
          image: pizzaItems[1].image
        },
        {
          menuItem: pizzaItems[2]._id,
          name: pizzaItems[2].name,
          price: pizzaItems[2].price,
          quantity: 1,
          image: pizzaItems[2].image
        }
      ],
      subtotal: 38.00,
      deliveryFee: 2.99,
      tax: 3.04,
      discount: 0,
      couponCode: '',
      totalAmount: 44.03,
      paymentMethod: 'CARD',
      paymentStatus: 'Paid',
      deliveryAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        phone: '+1 (555) 890-1234'
      },
      orderStatus: 'Preparing',
      statusHistory: [
        { status: 'Placed', timestamp: new Date(Date.now() - 600000), note: 'Order placed by customer' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 400000), note: 'Accepted by Bella Italia Trattoria' },
        { status: 'Preparing', timestamp: new Date(Date.now() - 120000), note: 'Chef is baking your pizzas' }
      ]
    });

    console.log('Creating sample reviews...');

    await Review.create([
      {
        user: customer1._id,
        restaurant: restaurant1._id,
        rating: 5,
        comment: 'Best woodfired pizza in town! The burrata was ultra creamy and the crust had the perfect char.'
      },
      {
        user: customer2._id,
        restaurant: restaurant1._id,
        rating: 5,
        comment: 'The Truffle Fettuccine is absolutely out of this world! Arrived steaming hot in 20 minutes.'
      },
      {
        user: customer1._id,
        restaurant: restaurant2._id,
        rating: 5,
        comment: 'Juicy burgers and the truffle fries are super addictive! Will definitely reorder.'
      },
      {
        user: customer2._id,
        restaurant: restaurant3._id,
        rating: 5,
        comment: 'Freshest sushi grade fish ever! The dragon roll and ramen broth were pure perfection.'
      }
    ]);

    console.log('✅ Seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('DEMO CREDENTIALS:');
    console.log('Admin:            admin@foodie.com / admin123');
    console.log('Owner (Pizza):    owner.pizza@foodie.com / owner123');
    console.log('Owner (Burger):   owner.burger@foodie.com / owner123');
    console.log('Customer:         user@foodie.com / user123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
