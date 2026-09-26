import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Filter, Search } from 'lucide-react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { adminAPI } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';

const STATUS_FILTERS = ['All', 'Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await adminAPI.getOrders(params);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="space-y-8 pb-20">
      <AdminNavbar />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Global Platform Orders ({orders.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor and audit transactions and delivery fulfillment across all restaurants.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-12">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Restaurant</th>
                  <th className="py-3.5 px-4">Items Count</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((ord) => {
                  const statusBadge = getOrderStatusBadge(ord.orderStatus);

                  return (
                    <tr key={ord._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-gray-800">
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900 block">{ord.user?.name || 'Customer'}</span>
                        <span className="text-[11px] text-gray-400">{ord.user?.email}</span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-gray-800">
                        {ord.restaurant?.name}
                      </td>

                      <td className="py-4 px-4 text-gray-600">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>

                      <td className="py-4 px-4 font-extrabold text-gray-900">
                        {formatCurrency(ord.totalAmount)}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-700">{ord.paymentMethod}</span>{' '}
                        <span className="text-gray-400 text-[10px]">({ord.paymentStatus})</span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right text-gray-400">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
