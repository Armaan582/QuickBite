import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
  Clock,
  MapPin,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isOwner, isAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top Banner for Admin / Owner shortcuts */}
      {isAuthenticated && (isAdmin || isOwner) && (
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Logged in as <span className="underline uppercase tracking-wider">{user?.role?.replace('_', ' ')}</span> ({user?.name})
            </span>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded text-[11px] transition-colors"
                >
                  Admin Control Panel →
                </Link>
              )}
              {isOwner && (
                <Link
                  to="/owner"
                  className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded text-[11px] transition-colors"
                >
                  Owner Dashboard →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Delivery Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors">
                  Foodiez<span className="text-orange-500">.</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  Fast & Delicious
                </span>
              </div>
            </Link>

            {/* Quick Location Badge */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium text-gray-700">Delivering to:</span>
              <span className="text-gray-500 truncate max-w-[140px]">
                {user?.addresses?.find((a) => a.isDefault)?.city || 'San Francisco, CA'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Restaurants
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === '/orders'
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                My Orders
              </Link>
            )}

            {isOwner && (
              <Link
                to="/owner"
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Restaurant Portal
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Actions: Cart & Profile */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="bg-orange-600 text-white font-bold text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/20"
                  />
                  <span className="hidden sm:block text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-orange-600">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        My Profile & Addresses
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        Order History
                      </Link>

                      {isOwner && (
                        <Link
                          to="/owner"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 font-medium hover:bg-amber-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600" />
                          Owner Portal
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 font-medium hover:bg-purple-50"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-600" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
