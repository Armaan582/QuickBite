import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/customer/CartDrawer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Modal } from './components/common/Modal';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { HomePage } from './pages/customer/HomePage';
import { RestaurantDetailPage } from './pages/customer/RestaurantDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { OrdersHistoryPage } from './pages/customer/OrdersHistoryPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Owner Pages
import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage';
import { OwnerOrdersPage } from './pages/owner/OwnerOrdersPage';
import { OwnerMenuPage } from './pages/owner/OwnerMenuPage';
import { OwnerSettingsPage } from './pages/owner/OwnerSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminRestaurantsPage } from './pages/admin/AdminRestaurantsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const RestaurantConflictModal = () => {
  const { restaurantConflictModal } = useCart();
  if (!restaurantConflictModal) return null;

  return (
    <Modal
      isOpen={!!restaurantConflictModal}
      onClose={restaurantConflictModal.onCancel}
      title="Start New Basket?"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-gray-600">
        <p>
          Your basket already contains items from another restaurant. Would you like to clear your current basket and add items from{' '}
          <strong className="text-gray-900">{restaurantConflictModal.newRestaurant?.name}</strong>?
        </p>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={restaurantConflictModal.onCancel}
            className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            Keep Existing Basket
          </button>
          <button
            onClick={restaurantConflictModal.onConfirm}
            className="px-4 py-2 font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md shadow-orange-500/20"
          >
            Start New Basket
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['user', 'restaurant_owner', 'admin']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'restaurant_owner', 'admin']}>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['user', 'restaurant_owner', 'admin']}>
                <OrdersHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-tracking/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'restaurant_owner', 'admin']}>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'restaurant_owner', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Restaurant Owner Portal Routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['restaurant_owner']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/orders"
            element={
              <ProtectedRoute allowedRoles={['restaurant_owner']}>
                <OwnerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/menu"
            element={
              <ProtectedRoute allowedRoles={['restaurant_owner']}>
                <OwnerMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/settings"
            element={
              <ProtectedRoute allowedRoles={['restaurant_owner']}>
                <OwnerSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Platform Admin Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRestaurantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCouponsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
      <RestaurantConflictModal />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
