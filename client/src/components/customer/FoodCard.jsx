import React from 'react';
import { Plus, Minus, Check, Flame } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const FoodCard = ({ item, restaurant }) => {
  const { items, addToCart, removeFromCart } = useCart();

  const cartItem = items.find((i) => i._id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div
      className={`bg-white rounded-2xl p-4 border border-gray-100/90 food-card-shadow flex flex-col justify-between gap-4 transition-all duration-200 ${
        !item.isAvailable ? 'opacity-60 grayscale-[40%]' : ''
      }`}
    >
      <div className="flex gap-4 items-start">
        {/* Text Info */}
        <div className="flex-1 space-y-1.5">
          {/* Veg/Non-Veg & Popular Tag */}
          <div className="flex items-center gap-2">
            {/* Veg/Non-Veg Icon */}
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center p-0.5 ${
                item.isVeg
                  ? 'border-emerald-600'
                  : 'border-rose-600'
              }`}
              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </div>

            {item.popular && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md border border-amber-200">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                Bestseller
              </span>
            )}
          </div>

          <h4 className="font-bold text-gray-900 text-base leading-snug">
            {item.name}
          </h4>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="pt-1 font-extrabold text-gray-900 text-base">
            {formatCurrency(item.price)}
          </div>
        </div>

        {/* Food Thumbnail & Action */}
        <div className="relative shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider text-center px-1">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-2 border-t border-gray-50">
        {item.isAvailable ? (
          quantity > 0 ? (
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 px-2 py-1 rounded-xl">
              <button
                onClick={() => removeFromCart(item._id)}
                className="w-7 h-7 rounded-lg bg-white text-orange-600 shadow-sm flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm text-orange-900 w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(item, restaurant)}
                className="w-7 h-7 rounded-lg bg-white text-orange-600 shadow-sm flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, restaurant)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white border border-orange-200 shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD TO CART
            </button>
          )
        ) : (
          <span className="text-xs font-medium text-gray-400 py-1">Currently unavailable</span>
        )}
      </div>
    </div>
  );
};
