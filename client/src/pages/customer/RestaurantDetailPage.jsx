import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Info,
  Sparkles,
  ShoppingBag,
  MessageSquarePlus,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { restaurantAPI } from '../../services/api';
import { FoodCard } from '../../components/customer/FoodCard';
import { StarRating } from '../../components/common/StarRating';
import { ReviewModal } from '../../components/customer/ReviewModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { items, total, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchRestaurantDetails = async () => {
    try {
      const res = await restaurantAPI.getById(id);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load restaurant details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.restaurant) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Restaurant Not Found</h2>
        <p className="text-xs text-gray-500">The restaurant you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const { restaurant, menuItems, categorizedMenu, reviews } = data;

  const filteredCategories =
    activeCategory === 'All'
      ? categorizedMenu
      : categorizedMenu.filter((c) => c.category === activeCategory);

  return (
    <div className="space-y-8 pb-20">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Restaurants
      </Link>

      {/* Restaurant Header Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={restaurant.bannerImage || restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Info Card Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                restaurant.isOpen ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </span>

            {restaurant.isFeatured && (
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{restaurant.name}</h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {restaurant.description}
          </p>

          {/* Meta Details Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-bold text-amber-300">
              <Star className="w-4 h-4 fill-amber-300" />
              <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-slate-400 font-normal">({restaurant.numReviews || reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{restaurant.deliveryTime || '25-35 min'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>
                {restaurant.deliveryFee === 0 ? 'Free Delivery' : `${formatCurrency(restaurant.deliveryFee)} Delivery`}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Menu Items & Categories */}
        <div className="lg:col-span-2 space-y-8">
          {/* Category Tabs */}
          <div className="sticky top-20 z-20 bg-slate-50/95 backdrop-blur-md py-3 border-b border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'All'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categorizedMenu.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.category
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.category} ({cat.items.length})
              </button>
            ))}
          </div>

          {/* Categorized Menu Displayer */}
          <div className="space-y-10">
            {filteredCategories.map((group) => (
              <section key={group.category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-gray-900">{group.category}</h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {group.items.length} dishes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.items.map((item) => (
                    <FoodCard key={item._id} item={item} restaurant={restaurant} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Right Column: Restaurant Info & Reviews */}
        <div className="space-y-6">
          {/* Restaurant Quick Facts Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
            <h4 className="font-extrabold text-gray-900 text-base">Restaurant Information</h4>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>
                  {restaurant.address?.street}, {restaurant.address?.city}, {restaurant.address?.state} {restaurant.address?.zip}
                </span>
              </div>
              {restaurant.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  Hours: {restaurant.openingHours?.open} - {restaurant.openingHours?.close}
                </span>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">Ratings & Reviews</h4>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={restaurant.rating} size="md" />
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  Write Review
                </button>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-3 pt-2">
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No reviews yet. Be the first to try and review this restaurant!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={rev.user?.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold text-gray-900">{rev.user?.name || 'Customer'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">{rev.comment}</p>
                    <span className="text-[10px] text-gray-400 block">{formatDate(rev.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Bar (if items exist) */}
      {items.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-30 animate-in slide-in-from-bottom-6 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300">
                  {items.reduce((s, i) => s + i.quantity, 0)} items in Cart
                </span>
                <p className="font-extrabold text-sm text-orange-400">{formatCurrency(total)}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            >
              View Cart & Checkout →
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        restaurantId={restaurant._id}
        restaurantName={restaurant.name}
        onReviewSubmitted={() => fetchRestaurantDetails()}
      />
    </div>
  );
};
