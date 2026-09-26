import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Features highlight bar */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Lightning Fast Delivery</h4>
              <p className="text-xs text-slate-400">Average 30 mins to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fresh & Hygienic</h4>
              <p className="text-xs text-slate-400">100% verified kitchens</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Safe & Secure Payments</h4>
              <p className="text-xs text-slate-400">Cards, UPI & Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 Live Support</h4>
              <p className="text-xs text-slate-400">Always here to help you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Foodiez.</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Delivering hot and mouth-watering dishes from the finest local restaurants right to your doorstep with love and care.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">For Foodies</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/" className="hover:text-orange-400 transition-colors">Browse Restaurants</Link></li>
            <li><Link to="/orders" className="hover:text-orange-400 transition-colors">Order History</Link></li>
            <li><Link to="/profile" className="hover:text-orange-400 transition-colors">Manage Delivery Addresses</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">For Partners</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/register" className="hover:text-orange-400 transition-colors">Register as Restaurant Owner</Link></li>
            <li><Link to="/owner" className="hover:text-orange-400 transition-colors">Owner Management Portal</Link></li>
            <li><Link to="/admin" className="hover:text-orange-400 transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Demo Accounts</h4>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1 text-slate-300">
            <p><span className="text-amber-400 font-semibold">Admin:</span> admin@foodie.com</p>
            <p><span className="text-orange-400 font-semibold">Owner:</span> owner.pizza@foodie.com</p>
            <p><span className="text-emerald-400 font-semibold">User:</span> user@foodie.com</p>
            <p className="text-[11px] text-slate-400 pt-1">Password for all: <code className="text-white font-mono bg-slate-900 px-1 py-0.5 rounded">admin123 / owner123 / user123</code></p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for food lovers everywhere. © {new Date().getFullYear()} Foodiez Inc.
        </p>
      </div>
    </footer>
  );
};
