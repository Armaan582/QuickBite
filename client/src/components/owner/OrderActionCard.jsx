import React, { useState } from 'react';
import {
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDate, getOrderStatusBadge } from '../../utils/formatters';
import { orderAPI } from '../../services/api';

export const OrderActionCard = ({ order, onStatusUpdated }) => {
  const [updating, setUpdating] = useState(false);
  const statusBadge = getOrderStatusBadge(order.orderStatus);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await orderAPI.updateStatus(order._id, {
        status: newStatus,
        note: `Status updated to ${newStatus} by restaurant`
      });
      if (res.data.success && onStatusUpdated) {
        onStatusUpdated(res.data.order);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100/90 shadow-lg shadow-gray-100/80 space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gray-400">
              #{order._id.slice(-6).toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              {statusBadge.label}
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-0.5">
            {formatDate(order.createdAt)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400 block">Total Amount</span>
          <span className="font-extrabold text-base text-gray-900">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Customer & Address Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <User className="w-3.5 h-3.5 text-orange-500" />
            <span>{order.user?.name || 'Customer'}</span>
          </div>
          {order.user?.phone && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.user.phone}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-start gap-1.5 text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {order.deliveryAddress?.street}, {order.deliveryAddress?.city} ({order.deliveryAddress?.zip})
            </span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        <h6 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
          Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
        </h6>
        <div className="space-y-1.5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-orange-50 text-orange-600 font-bold flex items-center justify-center text-[10px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>
              <span className="font-medium text-gray-600">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Note if any */}
      {order.customerNote && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="font-medium">Note: "{order.customerNote}"</span>
        </div>
      )}

      {/* Action Progression Buttons */}
      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500">
            Payment: <span className="text-gray-800">{order.paymentMethod}</span> ({order.paymentStatus})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {order.orderStatus === 'Placed' && (
            <>
              <button
                onClick={() => handleUpdateStatus('Cancelled')}
                disabled={updating}
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus('Confirmed')}
                disabled={updating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {updating ? 'Updating...' : 'Accept Order'}
              </button>
            </>
          )}

          {order.orderStatus === 'Confirmed' && (
            <button
              onClick={() => handleUpdateStatus('Preparing')}
              disabled={updating}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <ChefHat className="w-3.5 h-3.5" />
              {updating ? 'Updating...' : 'Start Cooking'}
            </button>
          )}

          {order.orderStatus === 'Preparing' && (
            <button
              onClick={() => handleUpdateStatus('Out for Delivery')}
              disabled={updating}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Bike className="w-3.5 h-3.5" />
              {updating ? 'Updating...' : 'Send Out for Delivery'}
            </button>
          )}

          {order.orderStatus === 'Out for Delivery' && (
            <button
              onClick={() => handleUpdateStatus('Delivered')}
              disabled={updating}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              {updating ? 'Updating...' : 'Mark as Delivered'}
            </button>
          )}

          {['Delivered', 'Cancelled'].includes(order.orderStatus) && (
            <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-100 rounded-lg">
              Order Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
