import React, { useState, useEffect } from 'react';
import { Store, MapPin, Clock, DollarSign, Image, Save, Check } from 'lucide-react';
import { OwnerNavbar } from '../../components/owner/OwnerNavbar';
import { restaurantAPI } from '../../services/api';

export const OwnerSettingsPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisines: '',
    image: '',
    bannerImage: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    openTime: '10:00 AM',
    closeTime: '11:00 PM',
    deliveryTime: '25-35 min',
    deliveryFee: '2.99',
    minOrder: '15.00'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await restaurantAPI.getMyRestaurant();
        if (res.data.success && res.data.restaurant) {
          const r = res.data.restaurant;
          setRestaurant(r);
          setFormData({
            name: r.name || '',
            description: r.description || '',
            cuisines: r.cuisines?.join(', ') || '',
            image: r.image || '',
            bannerImage: r.bannerImage || '',
            phone: r.phone || '',
            street: r.address?.street || '',
            city: r.address?.city || '',
            state: r.address?.state || '',
            zip: r.address?.zip || '',
            openTime: r.openingHours?.open || '10:00 AM',
            closeTime: r.openingHours?.close || '11:00 PM',
            deliveryTime: r.deliveryTime || '25-35 min',
            deliveryFee: String(r.deliveryFee || 2.99),
            minOrder: String(r.minOrder || 15.00)
          });
        }
      } catch (err) {
        console.error('Failed to load restaurant profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        cuisines: formData.cuisines.split(',').map((c) => c.trim()),
        image: formData.image,
        bannerImage: formData.bannerImage,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        openingHours: {
          open: formData.openTime,
          close: formData.closeTime
        },
        deliveryTime: formData.deliveryTime,
        deliveryFee: Number(formData.deliveryFee),
        minOrder: Number(formData.minOrder)
      };

      const res = await restaurantAPI.updateMyRestaurant(payload);
      if (res.data.success) {
        setRestaurant(res.data.restaurant);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save restaurant profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <OwnerNavbar
        restaurant={restaurant}
        onStatusToggle={(newStatus) => setRestaurant({ ...restaurant, isOpen: newStatus })}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Restaurant Profile & Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure your brand identity, delivery timings, minimum order rules, and storefront images.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-6"
        >
          {/* General info */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
              <Store className="w-4 h-4 text-orange-500" />
              General Store Info
            </h4>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Bella Italia Trattoria"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                rows="3"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your kitchen, cuisine specialties, and culinary background..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Cuisine Specialties (Comma-separated) *
              </label>
              <input
                type="text"
                required
                value={formData.cuisines}
                onChange={(e) => setFormData({ ...formData, cuisines: e.target.value })}
                placeholder="Italian, Pizza, Pasta, Mediterranean"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Delivery & Timings */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Delivery Rules & Opening Hours
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  placeholder="25-35 min"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                  placeholder="2.99"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Min Order ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="15.00"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Opening Time
                </label>
                <input
                  type="text"
                  value={formData.openTime}
                  onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Closing Time
                </label>
                <input
                  type="text"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                  placeholder="11:00 PM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Kitchen Location
            </h4>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="124 Little Italy Way"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <input
                type="text"
                required
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <input
                type="text"
                required
                placeholder="Zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Media Images */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
              <Image className="w-4 h-4 text-orange-500" />
              Storefront Images
            </h4>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Thumbnail Card Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Banner Header Image URL
              </label>
              <input
                type="url"
                value={formData.bannerImage}
                onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {success && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes saved successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Restaurant Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
