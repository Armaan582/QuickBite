import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const { user, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);
    try {
      await updateProfile({ name, phone, avatar });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.zip) return;

    try {
      await addAddress(newAddr);
      setNewAddr({ street: '', city: '', state: '', zip: '' });
      setIsAddingAddress(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Account & Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your personal information and delivery address book.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-500/20 mx-auto"
              />
            </div>

            <div>
              <h3 className="font-black text-gray-900 text-lg">{user?.name}</h3>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="mt-2 inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit & Address Book */}
        <div className="md:col-span-2 space-y-8">
          {/* Edit Profile Details */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-5">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Personal Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    pattern="(?:\+91[\s-]?)?[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian mobile number"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile updated!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="ml-auto px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </section>

          {/* Address Book Manager */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Saved Delivery Addresses
              </h3>

              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </button>
              )}
            </div>

            {/* Address List */}
            {user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{addr.street}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500">
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr._id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:text-orange-600 bg-white border border-gray-200 rounded-lg shadow-2xs"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-gray-400 hover:text-rose-500 p-1.5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-2">No delivery addresses saved yet.</p>
            )}

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="space-y-3 p-4 rounded-2xl bg-orange-50/50 border border-orange-200 text-xs">
                <h5 className="font-bold text-gray-900">Add New Address</h5>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Apt / Suite"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    placeholder="State / Union Territory"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    inputMode="numeric"
                    pattern="[1-9][0-9]{5}"
                    title="Enter a valid 6-digit Indian PIN code"
                    value={newAddr.zip}
                    onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-orange-600 text-white font-bold rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
