import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  MessageSquarePlus,
  Bike
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import { ReviewModal } from '../../components/customer/ReviewModal';

export const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Your Orders</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review past orders, track active deliveries, and rate your dishes.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">No Orders Yet</h3>
          <p className="text-xs text-gray-500">
            You haven't placed any orders yet. Discover delicious local food today!
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusBadge = getOrderStatusBadge(order.orderStatus);
            const isDelivered = order.orderStatus === 'Delivered';
            const isActive = !['Delivered', 'Cancelled'].includes(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-md space-y-4 transition-all hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.restaurant?.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80'}
                      alt={order.restaurant?.name}
                      className="w-12 h-12 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-black text-gray-900 text-base">
                        {order.restaurant?.name || 'Restaurant'}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {formatDate(order.createdAt)} • #{order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                      {statusBadge.label}
                    </span>

                    <span className="font-black text-base text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5">
                      <span className="font-medium text-gray-800">
                        <span className="font-bold text-orange-600 mr-1.5">{item.quantity}x</span>
                        {item.name}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-500">
                    Paid via <span className="font-bold text-gray-800">{order.paymentMethod}</span> ({order.paymentStatus})
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Tracker CTA if active */}
                    {isActive && (
                      <Link
                        to={`/order-tracking/${order._id}`}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        Track Order Live
                      </Link>
                    )}

                    {/* Rate Food button if delivered */}
                    {isDelivered && (
                      <button
                        onClick={() => setSelectedReviewOrder(order)}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        Rate & Review
                      </button>
                    )}

                    <Link
                      to={`/order-tracking/${order._id}`}
                      className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal for Delivered Orders */}
      {selectedReviewOrder && (
        <ReviewModal
          isOpen={!!selectedReviewOrder}
          onClose={() => setSelectedReviewOrder(null)}
          restaurantId={selectedReviewOrder.restaurant?._id}
          restaurantName={selectedReviewOrder.restaurant?.name}
          orderId={selectedReviewOrder._id}
        />
      )}
    </div>
  );
};
