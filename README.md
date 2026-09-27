# 🍔 QuickBite — India-First Food Delivery Web Application

A modern, full-stack Food Delivery web application built with **React (Vite) + Tailwind CSS** on the frontend, **Express.js + Node.js** on the backend, and **MongoDB (Mongoose)** for the database.

Supports complete role-based workflows for:
1. **Customers (Users)**: Browse restaurants, search dishes, filter cuisines, dynamic cart with promo discounts, multi-address checkout, live order tracking with visual progress, and star ratings/reviews.
2. **Restaurant Owners**: Restaurant profile management, menu items CRUD with stock toggles, live order fulfillment board (Accept -> Kitchen Preparation -> Dispatch -> Delivery), and sales revenue analytics.
3. **Platform Administrators**: Platform GMV & 15% commission metrics, restaurant approvals and suspensions, user account moderation, global order auditing, and promo coupon creation.

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Login on UI)

| Role | Email | Password | What to Test |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@quickbite.com` | `admin123` | Platform turnover, restaurant approvals, user status toggle, promo codes |
| **Restaurant Owner 1** | `owner.amritsar@quickbite.com` | `owner123` | "Amritsari Zaika": Menu management, live order pipeline, sales stats |
| **Restaurant Owner 2** | `owner.biryani@quickbite.com` | `owner123` | "Biryani House": Incoming orders and dish stock toggles |
| **Customer** | `user@quickbite.com` | `user123` | Ordering food, applying coupons, live order tracking, address book |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally at `mongodb://127.0.0.1:27017`

### 1. Backend Server Setup

```bash
cd server
npm install
npm run seed      # DESTRUCTIVE for its target DB: local/demo fixtures only; never run on production
npm start         # Starts Express API server on http://localhost:5000
```

### 2. Frontend Client Setup

```bash
cd client
npm install
npm run dev       # Starts Vite React dev server on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🏗️ Project Architecture

```
food-delivery-app/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, JWT, address book
│   │   ├── restaurantController.js# Restaurant catalog, filters, owner profile
│   │   ├── menuController.js     # Dish items CRUD, stock toggle
│   │   ├── orderController.js    # Checkout, history, tracking, owner orders, revenue analytics
│   │   ├── reviewController.js   # Customer ratings and reviews
│   │   ├── couponController.js   # Promo code validation and CRUD
│   │   └── adminController.js    # Platform GMV & commission, moderation, global orders
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & Role-Based Access Control (RBAC)
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js               # Customers, Owners, Admins
│   │   ├── Restaurant.js         # Restaurants, opening hours, delivery fees
│   │   ├── MenuItem.js           # Dishes, categories, prices, veg/non-veg, stock
│   │   ├── Order.js              # Orders snapshot, status history, addresses
│   │   ├── Review.js             # Ratings and reviews
│   │   └── Coupon.js             # Discount codes
│   ├── routes/                   # Express modular route definitions
│   ├── seeder/
│   │   └── seedData.js           # Database seeder script
│   └── server.js                 # Express app entry point
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── common/           # Navbar, Footer, Modal, ProtectedRoute, StarRating, Badge
    │   │   ├── customer/         # RestaurantCard, FoodCard, CartDrawer, OrderTracker, ReviewModal
    │   │   ├── owner/            # OwnerNavbar, MenuModal, OrderActionCard
    │   │   └── admin/            # AdminNavbar, StatCard, CouponModal
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Auth state, login, register, address book
    │   │   └── CartContext.jsx   # Cart, scoping, coupons, taxes, delivery fees
    │   ├── pages/
    │   │   ├── auth/             # LoginPage (with 1-Click Demo Logins), RegisterPage
    │   │   ├── customer/         # HomePage, RestaurantDetailPage, CartPage, CheckoutPage, OrderSuccessPage, OrdersHistoryPage, OrderTrackingPage, ProfilePage
    │   │   ├── owner/            # OwnerDashboardPage, OwnerOrdersPage, OwnerMenuPage, OwnerSettingsPage
    │   │   └── admin/            # AdminDashboardPage, AdminRestaurantsPage, AdminUsersPage, AdminOrdersPage, AdminCouponsPage
    │   ├── services/
    │   │   └── api.js            # Axios client with interceptors
    │   └── utils/
    │       └── formatters.js     # Currency, dates, status badge helpers
    └── vite.config.js
```

---

## 🍽️ Feature Highlights

### 👤 Customer Experience
- **Cuisine Discovery**: Interactive filter pills for North Indian, Punjabi, Biryani, Chaat, and more.
- **Live Search & Sort**: Fast filtering by rating (4.5+), delivery speed, and open/closed status.
- **Categorized Menus**: Veg/Non-veg tags, bestseller badges, and high-definition dish images.
- **Smart Cart**: INR totals, delivery fee, 8% tax calculation, minimum order requirements, and multi-restaurant conflict prevention modal.
- **Promo Discount Codes**: Apply `WELCOME50`, `TASTY20`, `FEAST10` for discounts.
- **Visual Live Tracker**: 5-stage real-time progress tracker (`Placed` -> `Confirmed` -> `Preparing` -> `Out for Delivery` -> `Delivered`).
- **Ratings & Reviews**: 5-star interactive rating and review system with automatic restaurant average recalculation.

### 🍳 Restaurant Owner Portal
- **Dashboard & Analytics**: Total revenue, order volume, live active orders, and top 5 best-selling dishes.
- **Order Fulfillment Board**: Accept orders, transition through kitchen cooking, dispatch to delivery drivers, and mark delivered.
- **Menu Management**: Add/edit/delete dishes, upload dish photos, adjust pricing, and toggle instant in-stock / out-of-stock switches.
- **Store Controls**: One-click store Open / Close switch and profile settings.

### 🛡️ Platform Admin Panel
- **Turnover & Revenue**: Gross Merchandise Value (GMV), platform commission metrics (15%), active restaurant metrics, user growth.
- **Restaurant Moderation**: Verify, approve, suspend, or feature restaurants.
- **User Account Management**: Search accounts across all roles, view address profiles, and suspend / reactivate users.
- **Global Order Auditing**: Filter and monitor platform-wide orders.
- **Coupon Manager**: Create custom promo codes with percent discount, maximum discount cap, and minimum order values.
