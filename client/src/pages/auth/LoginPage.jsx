import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, ShieldAlert, Store, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedInUser = await login(email, password);
      // Redirect based on role
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedInUser.role === 'restaurant_owner') {
        navigate('/owner');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword, role) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');

    try {
      const loggedInUser = await login(demoEmail, demoPassword);
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedInUser.role === 'restaurant_owner') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/70">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome back to Foodiez
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to your account or test using demo profiles below
          </p>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Instant Demo Login:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('user@foodie.com', 'user123', 'user')}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-colors flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-emerald-950 block truncate">Customer</span>
                <span className="text-[10px] text-emerald-700">user@foodie.com</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('owner.pizza@foodie.com', 'owner123', 'restaurant_owner')}
              className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-left transition-colors flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-orange-950 block truncate">Pizza Owner</span>
                <span className="text-[10px] text-orange-700">owner.pizza</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('owner.burger@foodie.com', 'owner123', 'restaurant_owner')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition-colors flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-amber-950 block truncate">Burger Owner</span>
                <span className="text-[10px] text-amber-700">owner.burger</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin@foodie.com', 'admin123', 'admin')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-left transition-colors flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-purple-950 block truncate">Admin</span>
                <span className="text-[10px] text-purple-700">admin@foodie.com</span>
              </div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
            Or Sign In Manually
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};
