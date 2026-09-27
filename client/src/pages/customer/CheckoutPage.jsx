import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, authAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const CheckoutPage = () => {
  const { items, restaurant, subtotal, deliveryFee, tax, discount, total, coupon, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // 'CARD', 'UPI', 'COD'
  const [customerNote, setCustomerNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      setError('Please fill in street, city, and a valid PIN code.');
      return;
    }

    try {
      await addAddress(newAddress);
      setIsAddingNewAddress(false);
      setNewAddress({ street: '', city: '', state: '', zip: '' });
      setSelectedAddressIndex((user?.addresses?.length || 0));
    } catch (err) {
      setError('Failed to save address.');
    }
  };

  const handlePlaceOrder = async () => {
    setError('');

    // Determine delivery address
    let deliveryAddress;
    if (user?.addresses && user.addresses.length > 0) {
      deliveryAddress = user.addresses[selectedAddressIndex] || user.addresses[0];
    } else {
      setError('Please provide a delivery address before placing order.');
      setIsAddingNewAddress(true);
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        restaurantId: restaurant._id,
        items: items.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zip: deliveryAddress.zip,
          phone: user?.phone || ''
        },
        paymentMethod,
        couponCode: coupon?.code || '',
        customerNote: customerNote.trim()
      };

      const res = await orderAPI.create(orderPayload);
      if (res.data.success) {
        const orderId = res.data.order._id;
        clearCart();
        navigate(`/order-success/${orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Checkout & Payment</h1>
        {restaurant && (
          <p className="text-xs text-gray-500 mt-0.5">
            Fulfilling order from <span className="font-bold text-gray-700">{restaurant.name}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Addresses & Payment Methods */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Delivery Address */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                1. Delivery Address
              </h3>
              {!isAddingNewAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              )}
            </div>

            {/* Address Selection list */}
            {!isAddingNewAddress ? (
              user?.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                        selectedAddressIndex === idx
                          ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-gray-900">
                            {addr.isDefault ? 'Default Address' : `Address #${idx + 1}`}
                          </span>
                          {selectedAddressIndex === idx && (
                            <CheckCircle2 className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
                  You don't have any saved address. Please enter a delivery address below.
                </div>
              )
            ) : (
              /* Add address form */
              <form onSubmit={handleAddNewAddress} className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h5 className="font-bold text-xs text-gray-800">Add New Delivery Address</h5>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Apt / Suite"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    placeholder="State / Union Territory"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    inputMode="numeric"
                    pattern="[1-9][0-9]{5}"
                    title="Enter a valid 6-digit Indian PIN code"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* 2. Payment Method */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-md space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  paymentMethod === 'CARD'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  {paymentMethod === 'CARD' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Credit / Debit Card</span>
                  <span className="text-[10px] text-gray-500">Visa, Mastercard, Amex</span>
                </div>
              </button>

              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  paymentMethod === 'UPI'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  {paymentMethod === 'UPI' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Instant UPI</span>
                  <span className="text-[10px] text-gray-500">Google Pay, PhonePe</span>
                </div>
              </button>

              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  paymentMethod === 'COD'
                    ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/60 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  {paymentMethod === 'COD' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Cash on Delivery</span>
                  <span className="text-[10px] text-gray-500">Pay when food arrives</span>
                </div>
              </button>
            </div>
          </section>

          {/* 3. Delivery Notes */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-md space-y-3">
            <h3 className="text-sm font-extrabold text-gray-900">
              Special Instructions for Driver / Kitchen (Optional)
            </h3>
            <textarea
              rows="2"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="e.g. Please do not ring bell, leave at front porch..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
            />
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-5">
            <h4 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
              Order Summary
            </h4>

            {/* Items Snapshot */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-orange-600">{item.quantity}x</span>
                    <span className="font-medium text-gray-800 truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-800">
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Service (8%)</span>
                <span className="font-semibold text-gray-800">{formatCurrency(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon ({coupon?.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>Total to Pay</span>
                <span className="text-orange-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {error}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{submitting ? 'Placing Order...' : `Place Order • ${formatCurrency(total)}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
