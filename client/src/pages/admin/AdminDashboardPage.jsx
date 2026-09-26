import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Store,
  Users,
  Percent,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { StatCard } from '../../components/admin/StatCard';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <AdminNavbar />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Platform Overview & Metrics
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Live snapshot of platform turnover, user growth, restaurant moderation, and orders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gross Platform Volume"
          value={formatCurrency(stats?.totalGrossRevenue || 0)}
          subtitle="Delivered customer orders"
          icon={DollarSign}
          color="purple"
        />

        <StatCard
          title="Platform Commission (15%)"
          value={formatCurrency(stats?.platformCommission || 0)}
          subtitle="Net platform revenue"
          icon={Percent}
          color="emerald"
        />

        <StatCard
          title="Total Orders Placed"
          value={stats?.totalOrders || 0}
          subtitle={`${stats?.activeOrders || 0} currently active`}
          icon={ShoppingBag}
          color="orange"
        />

        <StatCard
          title="Active Restaurants"
          value={stats?.totalRestaurants || 0}
          subtitle={`${stats?.approvedRestaurants || 0} approved • ${stats?.pendingRestaurants || 0} pending`}
          icon={Store}
          color="blue"
        />
      </div>

      {/* Secondary Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Base Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-gray-400">Total Platform Users</span>
            <h3 className="text-2xl font-black text-gray-900">
              {(stats?.totalUsers || 0) + (stats?.totalOwners || 0)}
            </h3>
            <p className="text-xs text-gray-500">
              {stats?.totalUsers || 0} customers • {stats?.totalOwners || 0} restaurant owners
            </p>
          </div>
          <Link
            to="/admin/users"
            className="p-3 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-colors"
          >
            <Users className="w-5 h-5" />
          </Link>
        </div>

        {/* Restaurant Moderation Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-gray-400">Restaurant Approvals</span>
            <h3 className="text-2xl font-black text-gray-900">
              {stats?.approvedRestaurants || 0} / {stats?.totalRestaurants || 0}
            </h3>
            <p className="text-xs text-gray-500">
              {stats?.pendingRestaurants > 0 ? (
                <span className="text-amber-600 font-bold">{stats.pendingRestaurants} restaurants awaiting approval</span>
              ) : (
                'All listings approved'
              )}
            </p>
          </div>
          <Link
            to="/admin/restaurants"
            className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
          >
            <Store className="w-5 h-5" />
          </Link>
        </div>

        {/* Platform Coupons Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-gray-400">Discount Coupons</span>
            <h3 className="text-2xl font-black text-gray-900">Active Promos</h3>
            <p className="text-xs text-gray-500">Create & manage discount codes</p>
          </div>
          <Link
            to="/admin/coupons"
            className="p-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-colors"
          >
            <Tag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Recent Platform Orders Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900">Recent Platform Orders</h3>
            <p className="text-xs text-gray-500">Global order activity across all restaurants</p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Restaurant</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-gray-700">
                      #{ord._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 font-bold text-gray-900">{ord.user?.name || 'Customer'}</td>
                    <td className="py-3 text-gray-700 font-medium">{ord.restaurant?.name}</td>
                    <td className="py-3 font-extrabold text-gray-900">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="py-3 text-gray-500">
                      <span className="font-semibold text-gray-700">{ord.paymentMethod}</span> ({ord.paymentStatus})
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{formatDate(ord.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-6">No platform orders recorded yet.</p>
        )}
      </div>
    </div>
  );
};
