import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer = () => {
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
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    deleteItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);

    const res = await applyCoupon(couponCodeInput);
    setIsApplyingCoupon(false);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponCodeInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const minOrder = restaurant?.minOrder || 0;
  const isMinOrderMet = subtotal >= minOrder;
  const minOrderShortage = minOrder - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Your Cart</h3>
                {restaurant && (
                  <p className="text-xs text-gray-500 font-medium truncate max-w-[220px]">
                    from <span className="font-bold text-gray-700">{restaurant.name}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">Your cart is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mb-6">
                Good food is always cooking! Add delicious dishes from our top restaurants.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/');
                }}
                className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Min Order Notice */}
              {!isMinOrderMet && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Add {formatCurrency(minOrderShortage)} more</span> to meet the minimum order requirement of {formatCurrency(minOrder)}.
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3.5">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-gray-900 truncate">
                        {item.name}
                      </h5>
                      <p className="text-xs font-semibold text-orange-600 mt-0.5">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-1.5 py-1 rounded-xl shadow-xs">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item, restaurant)}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Trash */}
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  Have a Promo Code?
                </label>

                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{coupon.code} applied (-{formatCurrency(discount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME50, TASTY20"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 text-xs uppercase font-medium bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p
                    className={`text-xs font-medium ${
                      couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5 text-xs">
                <h6 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                  Bill Summary
                </h6>
                <div className="flex justify-between text-gray-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-800">
                    {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Restaurant Charges</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-base text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Drawer Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-white space-y-2">
              <button
                onClick={handleProceedToCheckout}
                disabled={!isMinOrderMet}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-2">
                  <span>{formatCurrency(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={clearCart}
                className="w-full py-1.5 text-xs font-semibold text-gray-400 hover:text-rose-500 transition-colors text-center"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
