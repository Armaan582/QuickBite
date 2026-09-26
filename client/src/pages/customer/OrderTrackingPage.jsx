import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  MapPin,
  Phone,
  Store,
  CreditCard,
  FileText
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import { OrderTracker } from '../../components/customer/OrderTracker';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await orderAPI.getById(id);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Failed to fetch order tracking:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto-poll status every 10 seconds for live updates
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Order Not Found</h2>
        <Link to="/orders" className="inline-block px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <button
          onClick={() => fetchOrder(true)}
          disabled={refreshing}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Live Order Tracker Stepper */}
      <OrderTracker order={order} />

      {/* Order Info & Delivery Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant & Delivery Addresses */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h4 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
            Location & Contact
          </h4>

          <div className="space-y-4 text-xs">
            {/* Restaurant */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <Store className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">{order.restaurant?.name}</span>
                <span className="text-gray-500">
                  {order.restaurant?.address?.street}, {order.restaurant?.address?.city}
                </span>
                {order.restaurant?.phone && (
                  <span className="text-gray-400 block mt-1">Tel: {order.restaurant.phone}</span>
                )}
              </div>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">Deliver To</span>
                <span className="text-gray-500">
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}
                </span>
                {order.deliveryAddress?.phone && (
                  <span className="text-gray-400 block mt-1">Tel: {order.deliveryAddress.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items and Billing Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h4 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
            Receipt & Items
          </h4>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-600">{item.quantity}x</span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-800">
                {order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-semibold text-gray-800">{formatCurrency(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
              <span>Total Paid</span>
              <span className="text-orange-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
