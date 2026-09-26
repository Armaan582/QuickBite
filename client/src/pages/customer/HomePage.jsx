import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Flame,
  Clock,
  Bike,
  UtensilsCrossed,
  Filter
} from 'lucide-react';
import { restaurantAPI } from '../../services/api';
import { RestaurantCard } from '../../components/customer/RestaurantCard';

export const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState(['All']);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cuisines list
  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const res = await restaurantAPI.getCuisines();
        if (res.data.success) {
          setCuisines(res.data.cuisines);
        }
      } catch (err) {
        console.error('Error fetching cuisines:', err);
      }
    };
    fetchCuisines();
  }, []);

  // Fetch restaurants based on filters
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCuisine && selectedCuisine !== 'All') params.cuisine = selectedCuisine;
        if (selectedRating) params.rating = selectedRating;
        if (sortBy) params.sort = sortBy;
        if (onlyOpen) params.isOpen = true;

        const res = await restaurantAPI.getAll(params);
        if (res.data.success) {
          setRestaurants(res.data.restaurants);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCuisine, selectedRating, sortBy, onlyOpen]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-zinc-900 to-orange-950 text-white p-8 sm:p-14 shadow-2xl">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 1,000+ top rated dishes near you</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Feast on your <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">favorite food</span>, delivered fast.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Order from top local restaurants, track your delivery in real-time, and get exclusive promo discounts.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative flex items-center max-w-xl bg-white rounded-2xl p-2 shadow-2xl text-gray-900">
              <Search className="w-5 h-5 text-orange-500 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Filter Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Explore Cuisines
          </h2>
          {selectedCuisine !== 'All' && (
            <button
              onClick={() => setSelectedCuisine('All')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-xs ${
                selectedCuisine === cuisine
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </section>

      {/* Quick Filters Bar */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          {/* Rating filter */}
          <button
            onClick={() => setSelectedRating(selectedRating === '4.5' ? '' : '4.5')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              selectedRating === '4.5'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Rating 4.5+
          </button>

          {/* Open Now Toggle */}
          <button
            onClick={() => setOnlyOpen(!onlyOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              onlyOpen
                ? 'bg-orange-50 text-orange-700 border border-orange-300'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Open Now
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="featured">Featured & Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {selectedCuisine === 'All' ? 'Popular Restaurants' : `${selectedCuisine} Restaurants`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {restaurants.length} {restaurants.length === 1 ? 'place' : 'places'} available for delivery
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-80 border border-gray-100 animate-pulse p-4 space-y-4">
                <div className="bg-gray-200 h-44 rounded-2xl" />
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-3 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">No Restaurants Found</h3>
            <p className="text-xs text-gray-500">
              We couldn't find any restaurants matching your current search or filters. Try adjusting your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('All');
                setSelectedRating('');
                setOnlyOpen(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
