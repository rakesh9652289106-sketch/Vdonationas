'use client';

import React, { useState } from 'react';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminCreateTemplePage() {
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreated(true);
    setTimeout(() => setIsCreated(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-stone-100">
      <Link
        href="/admin/super/temples"
        className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shrines Directory
      </Link>

      <div>
        <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold uppercase">
          <Building2 className="w-4 h-4" /> SAAS TEMPLE ONBOARDING
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
          Register New Temple Devasthanam
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Requirement #51: Create temple entity, assign code, and issue verification credentials.
        </p>
      </div>

      {isCreated && (
        <div className="p-4 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-2xl text-xs font-bold">
          ✓ Temple entity created successfully! Assigned unique code TPL-006.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-300 mb-1">Temple Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sri Somasundareswarar Temple"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">Presiding Deity *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lord Shiva"
              value={deity}
              onChange={(e) => setDeity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">City *</label>
            <input
              type="text"
              required
              placeholder="Madurai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">State *</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100"
            >
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-devotional-maroon text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save & Issue Credentials
          </button>
        </div>
      </form>
    </div>
  );
}
