import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const CartPage = () => {
  const {
    items,
    restaurant,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    coupon,
    addToCart,
    removeFromCart,
    deleteItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our top restaurants and satisfy your cravings!
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplying(true);
    setCouponMessage(null);

    const res = await applyCoupon(couponCodeInput);
    setIsApplying(false);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponCodeInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const minOrder = restaurant?.minOrder || 0;
  const isMinOrderMet = subtotal >= minOrder;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={restaurant ? `/restaurant/${restaurant._id}` : '/'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Review Your Cart</h1>
          {restaurant && (
            <p className="text-xs text-gray-500 mt-0.5">
              Ordering from <span className="font-bold text-gray-700">{restaurant.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-md flex items-center justify-between gap-4"
            >
              <img
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                alt={item.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-gray-900 truncate">{item.name}</h4>
                <p className="text-xs font-bold text-orange-600 mt-1">
                  {formatCurrency(item.price * item.quantity)}
                  <span className="text-[11px] font-normal text-gray-400 ml-2">
                    ({formatCurrency(item.price)} each)
                  </span>
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-2 bg-orange-50/70 border border-orange-200 px-2 py-1 rounded-xl">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="w-7 h-7 rounded-lg bg-white text-orange-600 shadow-xs flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-extrabold text-orange-950 w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addToCart(item, restaurant)}
                  className="w-7 h-7 rounded-lg bg-white text-orange-600 shadow-xs flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => deleteItem(item._id)}
                className="text-gray-400 hover:text-rose-500 p-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout */}
        <div className="space-y-6">
          {/* Promo Box */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md space-y-3">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-orange-500" />
              Promo Discount
            </label>

            {coupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{coupon.code} applied (-{formatCurrency(discount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 font-bold underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs uppercase font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="submit"
                  disabled={isApplying || !couponCodeInput.trim()}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {couponMessage && (
              <p className={`text-xs font-medium ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Bill Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
            <h4 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
              Bill Details
            </h4>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Service (8%)</span>
                <span className="font-bold text-gray-900">{formatCurrency(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-orange-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={!isMinOrderMet}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-between disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
