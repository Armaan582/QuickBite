import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Store, User, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import quickbiteLogo from '../../assets/quickbite/quickbite-logo-main.png';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
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

  const roleOptions = [
    { id: 'user', label: 'Customer', helper: 'Order your favourites', icon: User, active: 'border-emerald-500 bg-emerald-50 text-emerald-800', iconStyle: 'bg-emerald-500' },
    { id: 'restaurant_owner', label: 'Shop Owner', helper: 'Manage your restaurant', icon: Store, active: 'border-orange-500 bg-orange-50 text-orange-800', iconStyle: 'bg-orange-500' },
    { id: 'admin', label: 'Admin', helper: 'Manage QuickBite', icon: ShieldAlert, active: 'border-violet-500 bg-violet-50 text-violet-800', iconStyle: 'bg-violet-600' }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/70">
        {/* Header */}
        <div className="text-center space-y-2">
          <img src={quickbiteLogo} alt="QuickBite" className="h-24 w-72 object-contain mx-auto" />
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome back to QuickBite
          </h2>
          <p className="text-xs text-gray-500">
            Crave It. Get It. Love It.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Choose your account type</p>
            <p className="mt-1 text-xs text-gray-400">Then enter your email and password below.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => { setSelectedRole(option.id); setError(''); }}
                  className={`relative flex min-h-[92px] flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all duration-200 ${isSelected ? `${option.active} shadow-md` : 'border-gray-100 bg-white text-gray-600 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm'}`}
                >
                  <span className={`mb-1.5 grid h-8 w-8 place-items-center rounded-xl text-white ${option.iconStyle}`}><Icon className="h-4 w-4" /></span>
                  <span className="text-xs font-extrabold">{option.label}</span>
                  <span className="mt-0.5 text-[10px] font-medium opacity-70">{option.helper}</span>
                  {isSelected && <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-current text-white"><Check className="h-2.5 w-2.5" /></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm font-bold text-gray-800">Sign in as {roleOptions.find((option) => option.id === selectedRole)?.label}</p>
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
            <span>{loading ? 'Signing In...' : `Sign In as ${roleOptions.find((option) => option.id === selectedRole)?.label}`}</span>
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
