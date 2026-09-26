import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  Power,
  Store,
  ChevronRight
} from 'lucide-react';
import { restaurantAPI } from '../../services/api';

export const OwnerNavbar = ({ restaurant, onStatusToggle }) => {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await restaurantAPI.toggleStatus();
      if (res.data.success && onStatusToggle) {
        onStatusToggle(res.data.isOpen);
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 sm:py-0 sm:h-16">
          {/* Restaurant identity & Quick Status Switch */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-gray-900 text-sm sm:text-base leading-tight">
                  {restaurant?.name || 'My Restaurant'}
                </h2>
                {restaurant && (
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      restaurant.isOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {restaurant.isOpen ? 'Accepting Orders' : 'Paused / Closed'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Owner Management Portal</p>
            </div>
          </div>

          {/* Nav Tabs & Action */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
            <NavLink
              to="/owner"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>

            <NavLink
              to="/owner/orders"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" />
              Live Orders
            </NavLink>

            <NavLink
              to="/owner/menu"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <UtensilsCrossed className="w-4 h-4" />
              Menu Items
            </NavLink>

            <NavLink
              to="/owner/settings"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>

            {/* Toggle Store Status Button */}
            {restaurant && (
              <button
                onClick={handleToggle}
                disabled={toggling}
                className={`ml-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap ${
                  restaurant.isOpen
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {restaurant.isOpen ? 'Close Store' : 'Open Store'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
