import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  BarChart3,
  Store,
  Users,
  ShoppingBag,
  Tag
} from 'lucide-react';

export const AdminNavbar = () => {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-16 sm:top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 sm:py-0 sm:h-16">
          {/* Header Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-tight">
                Platform Administrator
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Control Center & System Governance</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </NavLink>

            <NavLink
              to="/admin/restaurants"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Store className="w-4 h-4" />
              Restaurants
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Users className="w-4 h-4" />
              Users & Owners
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" />
              All Orders
            </NavLink>

            <NavLink
              to="/admin/coupons"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Tag className="w-4 h-4" />
              Coupons
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
