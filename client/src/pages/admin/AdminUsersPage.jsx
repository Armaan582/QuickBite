import React, { useState, useEffect } from 'react';
import { Search, User, Store, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/formatters';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter !== 'All') params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await adminAPI.getUsers(params);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminAPI.toggleUserStatus(userId);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? res.data.user : u))
        );
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <AdminNavbar />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          User & Owner Accounts
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View all registered platform members, roles, addresses, and manage account statuses.
        </p>
      </div>

      {/* Search & Role Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto">
          {[
            { key: 'All', label: 'All Roles' },
            { key: 'user', label: 'Customers' },
            { key: 'restaurant_owner', label: 'Owners' },
            { key: 'admin', label: 'Admins' }
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setRoleFilter(r.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                roleFilter === r.key
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-12">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Account Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* User Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-xs">{u.name}</h4>
                          <span className="text-[11px] text-gray-400">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : u.role === 'restaurant_owner'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 text-gray-600">
                      {u.phone || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-gray-400">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            u.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
