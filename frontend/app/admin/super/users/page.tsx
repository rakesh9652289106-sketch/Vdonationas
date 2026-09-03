'use client';

import React, { useState } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { Users, Plus, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SuperAdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'TEMPLE_ADMIN' | 'FINANCE_ADMIN' | 'CONTENT_ADMIN'>('TEMPLE_ADMIN');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      fullName: name,
      mobile: '+91 9988776655',
      role,
      isTwoFactorAuth: true,
      language: 'en' as const,
    };

    setUsers([...users, newUser]);
    setName('');
    setEmail('');
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarUserMatrix')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarUserMatrix')}
          </h1>
          <p className="text-amber-100/80 text-xs">
            Global Platform Users, Granular Role-Based Access Control (RBAC) & Multi-Tenant Scopes
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0 relative z-10"
        >
          <Plus className="w-4 h-4 text-devotional-maroon" /> Create Administrator
        </button>
      </div>

      {/* 3D USER TABLE CARD WITH HOVER MOTION */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-devotional-gold/40 p-6 shadow-2xl space-y-4 hover:border-amber-400 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">User Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Mobile</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">2FA Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-serif font-bold text-stone-900 dark:text-stone-100">{u.fullName}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">{u.email}</td>
                  <td className="p-3.5 text-stone-500 font-mono">{u.mobile || '-'}</td>
                  <td className="p-3.5">
                    <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold border border-amber-400/40">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${u.isTwoFactorAuth ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400/40' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-400/40'}`}>
                      {u.isTwoFactorAuth ? '2FA ENABLED' : 'DISABLED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
              Create New Administrator
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balaji Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@templesaas.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Role Assignment
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                >
                  <option value="TEMPLE_ADMIN">Temple Administrator</option>
                  <option value="FINANCE_ADMIN">Finance Administrator</option>
                  <option value="CONTENT_ADMIN">Content Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-devotional-saffron text-white font-bold"
                >
                  Create & Assign Scope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
