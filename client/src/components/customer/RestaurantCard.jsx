import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign, Sparkles, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RestaurantCard = ({ restaurant, compact = false }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 food-card-shadow hover:-translate-y-1 flex flex-col"
    >
      {/* Restaurant Banner Image & Badges */}
      <div className={`relative w-full overflow-hidden bg-gray-100 ${compact ? 'h-40' : 'h-40 sm:h-44'}`}>
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Featured Badge */}
        {restaurant.isFeatured && (
          <div className="absolute top-3 left-3 bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}

        {/* Status: Open or Closed */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
              restaurant.isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-600/90 text-white'
            }`}
          >
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Quick Delivery Time Pill */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>{restaurant.deliveryTime || '25-35 min'}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className={`${compact ? 'p-3.5' : 'p-4'} flex-1 flex flex-col justify-between`}>
        <div>
          {/* Header & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-emerald-100 shrink-0">
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>

          {/* Cuisines */}
          <p className={`text-xs font-medium text-gray-500 line-clamp-1 ${compact ? 'mb-2.5' : 'mb-2'}`}>
            {restaurant.cuisines?.join(' • ')}
          </p>

          {/* Description */}
          {!compact && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">{restaurant.description}</p>}
        </div>

        {/* Footer Meta: Delivery fee & Min order */}
        <div className={`${compact ? 'pt-2.5' : 'pt-3'} border-t border-gray-100 flex items-center justify-between text-xs text-gray-500`}>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-700">
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-600 font-bold">Free Delivery</span>
              ) : (
                `${formatCurrency(restaurant.deliveryFee)} Delivery`
              )}
            </span>
          </div>

          <div className="text-[11px] text-gray-400">
            Min order: <span className="font-semibold text-gray-700">{formatCurrency(restaurant.minOrder)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
