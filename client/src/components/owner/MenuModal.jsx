import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { menuAPI } from '../../services/api';
import { Sparkles, Utensils } from 'lucide-react';

const COMMON_CATEGORIES = [
  'Starters',
  'Main Course',
  'Pizzas',
  'Burgers',
  'Pastas',
  'Breads & Sides',
  'Desserts',
  'Beverages',
  'Special Rolls',
  'Ramen'
];

export const MenuModal = ({ isOpen, onClose, editingItem, onItemSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    image: '',
    isVeg: true,
    popular: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        price: editingItem.price || '',
        category: editingItem.category || 'Main Course',
        image: editingItem.image || '',
        isVeg: editingItem.isVeg !== undefined ? editingItem.isVeg : true,
        popular: editingItem.popular || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        image: '',
        isVeg: true,
        popular: false
      });
    }
    setError('');
  }, [editingItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let res;
      if (editingItem) {
        res = await menuAPI.updateItem(editingItem._id, formData);
      } else {
        res = await menuAPI.addItem(formData);
      }

      if (res.data.success) {
        if (onItemSaved) onItemSaved(res.data.item);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit Dish' : 'Add New Dish to Menu'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dish Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Dish Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Margherita Burrata Pizza"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <input
              list="categories-list"
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g. Starters, Main Course"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <datalist id="categories-list">
              {COMMON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="299"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ingredients, flavors, preparation method..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Image URL (Unsplash or direct image link)
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Veg/Non-Veg & Popular Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isVeg}
              onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
            />
            <span className="text-xs font-bold text-gray-700">Vegetarian Dish</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.popular}
              onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
            />
            <span className="text-xs font-bold text-gray-700">Mark as Bestseller</span>
          </label>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {error}
          </p>
        )}

        {/* Actions */}
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
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Dish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
