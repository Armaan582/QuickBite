import React, { useState, useEffect } from 'react';
import {
  Store,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  MapPin,
  Phone,
  User,
  Star
} from 'lucide-react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { adminAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase();
      if (searchQuery) params.search = searchQuery;

      const res = await adminAPI.getRestaurants(params);
      if (res.data.success) {
        setRestaurants(res.data.restaurants);
      }
    } catch (err) {
      console.error('Failed to load admin restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [statusFilter, searchQuery]);

  const handleApproveToggle = async (restaurantId, currentApproval) => {
    try {
      const res = await adminAPI.approveRestaurant(restaurantId, !currentApproval);
      if (res.data.success) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === restaurantId ? { ...r, isApproved: !currentApproval } : r
          )
        );
      }
    } catch (err) {
      console.error('Failed to update approval status:', err);
    }
  };

  const handleFeatureToggle = async (restaurantId) => {
    try {
      const res = await adminAPI.toggleFeatured(restaurantId);
      if (res.data.success) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === restaurantId ? { ...r, isFeatured: !r.isFeatured } : r
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <AdminNavbar />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Restaurant Listings Moderation
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Approve new restaurant applications, suspend policy violators, and feature top kitchens.
        </p>
      </div>

      {/* Search & Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by restaurant name or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {['All', 'Approved', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-12">No restaurants found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Restaurant</th>
                  <th className="py-3.5 px-4">Owner Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-6 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {restaurants.map((rest) => (
                  <tr key={rest._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Restaurant Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={rest.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80'}
                          alt={rest.name}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-xs">{rest.name}</h4>
                          <p className="text-[11px] text-gray-400 line-clamp-1">{rest.cuisines?.join(', ')}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner Contact */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-gray-800 block">{rest.owner?.name || 'Owner'}</span>
                        <span className="text-[11px] text-gray-400 block">{rest.owner?.email}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-gray-600">
                      <span>{rest.address?.city}, {rest.address?.state}</span>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-bold text-gray-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rest.rating?.toFixed(1) || '4.5'}</span>
                        <span className="text-gray-400 text-[10px]">({rest.numReviews})</span>
                      </div>
                    </td>

                    {/* Approval Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          rest.isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rest.isApproved ? 'Approved' : 'Pending Review'}
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleFeatureToggle(rest._id)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          rest.isFeatured
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-amber-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleApproveToggle(rest._id, rest.isApproved)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                          rest.isApproved
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                        }`}
                      >
                        {rest.isApproved ? 'Suspend' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
