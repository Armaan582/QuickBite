import React, { useState, useEffect } from 'react';
import { RefreshCw, ShoppingBag, Filter } from 'lucide-react';
import { OwnerNavbar } from '../../components/owner/OwnerNavbar';
import { OrderActionCard } from '../../components/owner/OrderActionCard';
import { orderAPI, restaurantAPI } from '../../services/api';

const STATUS_FILTERS = [
  'All',
  'Placed',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const OwnerOrdersPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [restRes, ordersRes] = await Promise.all([
        restaurantAPI.getMyRestaurant(),
        orderAPI.getRestaurantOrders({ status: selectedStatus })
      ]);

      if (restRes.data.success) {
        setRestaurant(restRes.data.restaurant);
      }
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }
    } catch (err) {
      console.error('Failed to load restaurant orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedStatus]);

  const handleStatusUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <OwnerNavbar
        restaurant={restaurant}
        onStatusToggle={(newStatus) => setRestaurant({ ...restaurant, isOpen: newStatus })}
      />

      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Order Fulfillment Board
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Accept incoming orders, update kitchen stages, and coordinate dispatches.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedStatus === status
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">No Orders Found</h3>
          <p className="text-xs text-gray-500">
            {selectedStatus === 'All'
              ? 'You have not received any orders yet.'
              : `No orders currently in '${selectedStatus}' state.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <OrderActionCard
              key={order._id}
              order={order}
              onStatusUpdated={handleStatusUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
};
