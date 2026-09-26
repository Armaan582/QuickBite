import React from 'react';
import {
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  Bike,
  Home,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const STAGES = [
  { key: 'Placed', label: 'Order Placed', icon: Clock, desc: 'Waiting for restaurant confirmation' },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Restaurant accepted your order' },
  { key: 'Preparing', label: 'Preparing', icon: UtensilsCrossed, desc: 'Kitchen is cooking your meal' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, desc: 'Delivery partner is on the way' },
  { key: 'Delivered', label: 'Delivered', icon: Home, desc: 'Enjoy your hot & delicious meal!' }
];

export const OrderTracker = ({ order }) => {
  if (!order) return null;

  if (order.orderStatus === 'Cancelled') {
    return (
      <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-lg">Order Cancelled</h4>
          <p className="text-sm text-rose-600 mt-1">
            This order was cancelled. If you were charged, a refund will be processed immediately.
          </p>
        </div>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/80 space-y-8">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Live Order Status
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            {STAGES[currentStageIndex]?.label || order.orderStatus}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {STAGES[currentStageIndex]?.desc}
          </p>
        </div>

        {order.orderStatus !== 'Delivered' && (
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/20 text-center sm:text-right">
            <span className="text-[11px] uppercase tracking-wider font-bold opacity-90 block">
              Estimated Delivery
            </span>
            <span className="text-lg font-black">{order.estimatedDeliveryTime || '30-40 mins'}</span>
          </div>
        )}
      </div>

      {/* Visual Stepper Tracker */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-gray-100 rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          {STAGES.map((stage, idx) => {
            const isCompleted = currentStageIndex >= idx;
            const isCurrent = currentStageIndex === idx;
            const StageIcon = stage.icon;

            // Find timestamp from statusHistory
            const historyEntry = order.statusHistory?.find((h) => h.status === stage.key);

            return (
              <div
                key={stage.key}
                className="flex md:flex-col items-center md:text-center gap-4 md:gap-3"
              >
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/30'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  } ${isCurrent ? 'ring-4 ring-orange-500/20 scale-110 animate-pulse' : ''}`}
                >
                  <StageIcon className="w-5 h-5" />
                </div>

                {/* Step Label & Details */}
                <div className="flex-1 md:flex-none">
                  <h5
                    className={`text-sm font-bold ${
                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </h5>
                  {historyEntry && (
                    <span className="text-[11px] text-gray-400 block font-medium mt-0.5">
                      {formatDate(historyEntry.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log / Status Notes */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Timeline Updates
          </h5>
          <div className="space-y-2.5">
            {order.statusHistory.slice().reverse().map((entry, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-800">{entry.status}:</span>{' '}
                  <span className="text-gray-600">{entry.note || 'Status updated.'}</span>
                  <span className="text-gray-400 text-[10px] ml-2">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
