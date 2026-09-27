import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { couponAPI } from '../../services/api';
import { Tag, Sparkles } from 'lucide-react';

export const CouponModal = ({ isOpen, onClose, onCouponCreated }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercent: '',
    maxDiscount: '',
    minOrderAmount: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent) {
      setError('Please provide coupon code and discount percentage');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await couponAPI.create({
        code: formData.code.trim().toUpperCase(),
        description: formData.description,
        discountPercent: Number(formData.discountPercent),
        maxDiscount: Number(formData.maxDiscount) || 100,
        minOrderAmount: Number(formData.minOrderAmount) || 0
      });

      if (res.data.success) {
        if (onCouponCreated) onCouponCreated(res.data.coupon);
        setFormData({ code: '', description: '', discountPercent: '', maxDiscount: '', minOrderAmount: '' });
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Discount Promo Code" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Coupon Code *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. SUMMER30"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full px-3.5 py-2.5 text-sm uppercase font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <input
            type="text"
            placeholder="e.g. 30% off on all summer orders"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Discount % *
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              placeholder="30"
              value={formData.discountPercent}
              onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Maximum Discount (₹)
            </label>
            <input
              type="number"
              min="1"
              placeholder="150"
              value={formData.maxDiscount}
              onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Minimum Order (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="499"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {saving ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
