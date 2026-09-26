import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Power, Sparkles, Percent } from 'lucide-react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { CouponModal } from '../../components/admin/CouponModal';
import { couponAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponAPI.getAll();
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleStatus = async (couponId) => {
    try {
      const res = await couponAPI.toggleStatus(couponId);
      if (res.data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === couponId ? res.data.coupon : c))
        );
      }
    } catch (err) {
      console.error('Failed to toggle coupon status:', err);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      const res = await couponAPI.delete(couponId);
      if (res.data.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== couponId));
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <AdminNavbar />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Promotional Coupons & Discounts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create discount codes to boost customer engagement and platform orders.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Promo Code
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg">No Coupons Created</h3>
          <p className="text-xs text-gray-500">
            Create your first promotional discount coupon code for customers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c._id}
              className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4 flex flex-col justify-between transition-all ${
                !c.isActive ? 'opacity-60 bg-gray-50/70' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {c.code}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      c.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-medium">{c.description || 'General discount offer'}</p>

                <div className="space-y-1 pt-2 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Discount Rate</span>
                    <span className="font-bold text-gray-900">{c.discountPercent}% OFF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum Discount</span>
                    <span className="font-bold text-gray-900">{formatCurrency(c.maxDiscount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Order Requirement</span>
                    <span className="font-bold text-gray-900">{formatCurrency(c.minOrderAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(c._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    c.isActive
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => handleDeleteCoupon(c._id)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCouponCreated={() => fetchCoupons()}
      />
    </div>
  );
};
