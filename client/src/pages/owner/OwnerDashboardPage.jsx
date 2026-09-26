import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { OwnerNavbar } from '../../components/owner/OwnerNavbar';
import { StatCard } from '../../components/admin/StatCard';
import { restaurantAPI, orderAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OwnerDashboardPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [restRes, analyticsRes, ordersRes] = await Promise.all([
        restaurantAPI.getMyRestaurant(),
        orderAPI.getOwnerAnalytics(),
        orderAPI.getRestaurantOrders()
      ]);

      if (restRes.data.success) {
        setRestaurant(restRes.data.restaurant);
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If owner hasn't set up restaurant yet
  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">Set Up Your Restaurant</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Welcome to the Owner Portal! Create your restaurant profile to start listing dishes and accepting orders from customers.
        </p>
        <Link
          to="/owner/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
        >
          Create Restaurant Profile →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <OwnerNavbar
        restaurant={restaurant}
        onStatusToggle={(newStatus) => setRestaurant({ ...restaurant, isOpen: newStatus })}
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net Revenue"
          value={formatCurrency(analytics?.totalRevenue || 0)}
          subtitle="From delivered orders"
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title="Active Live Orders"
          value={analytics?.activeCount || 0}
          subtitle="Orders in fulfillment"
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Total Orders"
          value={analytics?.totalOrders || 0}
          subtitle={`${analytics?.completedCount || 0} completed`}
          icon={ShoppingBag}
          color="purple"
        />

        <StatCard
          title="Store Rating"
          value={`${restaurant?.rating?.toFixed(1) || '4.5'} ★`}
          subtitle={`${restaurant?.numReviews || 0} customer reviews`}
          icon={Star}
          color="amber"
        />
      </div>

      {/* Analytics & Popular Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 5 Best Selling Dishes */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Top Selling Dishes
            </h3>
            <Link to="/owner/menu" className="text-xs font-bold text-orange-600 hover:text-orange-700">
              Manage Menu
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {analytics?.popularDishes && analytics.popularDishes.length > 0 ? (
              analytics.popularDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-gray-800 truncate max-w-[140px]">{dish.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-gray-900 block">{dish.count} sold</span>
                    <span className="text-[10px] text-gray-400">{formatCurrency(dish.revenue)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">
                Dish sales will appear here as orders are completed.
              </p>
            )}
          </div>
        </div>

        {/* Live Incoming Orders Preview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-base">Recent Orders</h3>
            <Link
              to="/owner/orders"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View Live Orders Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-10">No orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-gray-700">
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 font-bold text-gray-900">{ord.user?.name || 'Customer'}</td>
                      <td className="py-3.5 text-gray-500">{ord.items.length} items</td>
                      <td className="py-3.5 font-extrabold text-gray-900">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to="/owner/orders"
                          className="px-3 py-1 bg-gray-100 hover:bg-orange-600 hover:text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
