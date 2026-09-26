import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Bike, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getById(id);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Woohoo! Your order has been placed.
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            The restaurant has received your order and is getting ready to prepare your feast.
          </p>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-700">Order ID</span>
              <span className="font-mono font-bold text-gray-900">#{order._id.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Restaurant</span>
              <span className="font-bold text-gray-900">{order.restaurant?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Estimated Delivery</span>
              <span className="font-bold text-orange-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {order.estimatedDeliveryTime || '30-40 mins'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
              <span>Total Paid</span>
              <span className="text-orange-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            to={`/order-tracking/${id}`}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bike className="w-4 h-4" />
            <span>Track Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="w-full py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
