'use client';

import React, { useState } from 'react';
import {
  Building2,
  Save,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  Phone,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { templeService, generateHighEntropyNumberPassword } from '@/lib/supabase-service';

export default function SuperAdminCreateTemplePage() {
  const router = useRouter();

  // Temple Details
  const [code, setCode] = useState('TPL-002');
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('Sri Vasavi Kanyaka Parameswari');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [pinCode, setPinCode] = useState('520001');
  const [trustName, setTrustName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');

  // Manager Details & Credentials
  const [managerName, setManagerName] = useState('');
  const [managerMobile, setManagerMobile] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Finance Admin Details & Credentials
  const [financeName, setFinanceName] = useState('');
  const [financeMobile, setFinanceMobile] = useState('');
  const [financePassword, setFinancePassword] = useState('');
  const [financeEmail, setFinanceEmail] = useState('');
  const [showFinancePassword, setShowFinancePassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{
    temple: { id: string; code: string; name: string; city: string; state: string };
    manager: { id: string; name: string; phone: string; email: string; role: string; plainPassword?: string };
    finance: { id: string; name: string; phone: string; email: string; role: string; plainPassword?: string };
  } | null>(null);
  const [copiedType, setCopiedType] = useState<'manager' | 'finance' | 'both' | null>(null);

  const handleGeneratePassword = () => {
    const pw = generateHighEntropyNumberPassword();
    setManagerPassword(pw);
  };

  const handleGenerateFinancePassword = () => {
    const pw = generateHighEntropyNumberPassword();
    setFinancePassword(pw);
  };

  const handleSuggestCode = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const citySlug = city ? city.substring(0, 3).toUpperCase() : 'VAS';
    setCode(`TPL-${citySlug}-${randomSuffix}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !code.trim() ||
      !name.trim() ||
      !city.trim() ||
      !managerName.trim() ||
      !managerMobile.trim() ||
      !managerPassword.trim() ||
      !financeName.trim() ||
      !financeMobile.trim() ||
      !financePassword.trim()
    ) {
      setErrorMsg('Please fill in all mandatory fields for Temple, Temple Manager, and Finance Admin.');
      return;
    }

    const cleanMgrMobile = managerMobile.replace(/\D/g, '');
    if (cleanMgrMobile.length < 10) {
      setErrorMsg('Manager Mobile Number must be at least 10 digits.');
      return;
    }

    const cleanFinMobile = financeMobile.replace(/\D/g, '');
    if (cleanFinMobile.length < 10) {
      setErrorMsg('Finance Admin Mobile Number must be at least 10 digits.');
      return;
    }

    if (cleanMgrMobile === cleanFinMobile) {
      setErrorMsg('Temple Manager and Finance Admin must have distinct mobile numbers.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await templeService.createTempleWithManagerAndFinance({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        deity: deity.trim(),
        address: address.trim() || `${city.trim()}, ${state}`,
        city: city.trim(),
        state,
        pinCode: pinCode.trim() || '500001',
        trustName: trustName.trim() || `${name.trim()} Trust`,
        registrationNo: registrationNo.trim() || `REG/${code.trim().toUpperCase()}`,
        managerName: managerName.trim(),
        managerMobile: cleanMgrMobile,
        managerPassword: managerPassword.trim(),
        managerEmail: managerEmail.trim() || undefined,
        financeName: financeName.trim(),
        financeMobile: cleanFinMobile,
        financePassword: financePassword.trim(),
        financeEmail: financeEmail.trim() || undefined,
      });

      if (res && res.success) {
        setCreatedResult({
          temple: res.temple,
          manager: {
            ...res.manager,
            plainPassword: managerPassword.trim(),
          },
          finance: {
            ...res.finance,
            plainPassword: financePassword.trim(),
          },
        });
      } else {
        setErrorMsg(res?.error || 'Failed to create temple and provision administrative accounts.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while creating temple entity.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = (type: 'manager' | 'finance' | 'both') => {
    if (!createdResult) return;
    let text = '';
    if (type === 'manager') {
      text = `🏛️ SRI VASAVI SANCTUARY - TEMPLE MANAGER CREDENTIALS\n` +
        `Temple Name: ${createdResult.temple.name}\n` +
        `Temple ID: ${createdResult.temple.code}\n` +
        `Assigned Manager: ${createdResult.manager.name}\n` +
        `Login Mobile: ${createdResult.manager.phone}\n` +
        `Login Password: ${createdResult.manager.plainPassword}\n` +
        `Role: TEMPLE_ADMIN (Exclusive Shrine Management)\n` +
        `Devasthanam Portal: http://localhost:3000/login\n` +
        `Note: You have exclusive administrative control over ${createdResult.temple.name}.`;
    } else if (type === 'finance') {
      text = `💰 SRI VASAVI SANCTUARY - TEMPLE FINANCE ADMIN CREDENTIALS\n` +
        `Temple Name: ${createdResult.temple.name}\n` +
        `Temple ID: ${createdResult.temple.code}\n` +
        `Finance Officer: ${createdResult.finance.name}\n` +
        `Login Mobile: ${createdResult.finance.phone}\n` +
        `Login Password: ${createdResult.finance.plainPassword}\n` +
        `Role: FINANCE_ADMIN (Read-Only Audit & Settlement Desk)\n` +
        `Devasthanam Portal: http://localhost:3000/login\n` +
        `Note: You have direct line to Super Admin for settlements and coordination desk with the Temple Manager.`;
    } else {
      text = `🪔 SRI VASAVI SANCTUARY - COMPLETE SHRINE CREDENTIALS\n` +
        `Temple: ${createdResult.temple.name} (Code: ${createdResult.temple.code})\n\n` +
        `[1. TEMPLE MANAGER]\n` +
        `Name: ${createdResult.manager.name}\n` +
        `Phone: ${createdResult.manager.phone}\n` +
        `Password: ${createdResult.manager.plainPassword}\n` +
        `Role: TEMPLE_ADMIN\n\n` +
        `[2. FINANCE ADMIN]\n` +
        `Name: ${createdResult.finance.name}\n` +
        `Phone: ${createdResult.finance.phone}\n` +
        `Password: ${createdResult.finance.plainPassword}\n` +
        `Role: FINANCE_ADMIN (Read-Only Financial Superintending)\n\n` +
        `Portal URL: http://localhost:3000/login`;
    }

    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-stone-100 font-sans pb-12">
      <Link
        href="/admin/super/temples"
        className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shrines Directory
      </Link>

      <div>
        <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold uppercase">
          <Building2 className="w-4 h-4" /> SUPER ADMIN TEMPLE ONBOARDING & MANAGER PROVISIONING
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
          Onboard New Temple & Issue Manager Credentials
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Create a new temple entity with a unique Temple ID, assign a designated Temple Manager with mobile & password, and enforce single-temple access boundaries.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Credentials Modal / Overlay */}
      {createdResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c080b] to-[#0d0203] border-2 border-emerald-500/80 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <div>
              <h2 className="font-serif font-bold text-xl text-white">
                Temple Shrine Onboarded & Dual Leadership Accounts Provisioned!
              </h2>
              <p className="text-xs text-stone-300">
                Both the Temple Manager and Finance Admin accounts have been linked exclusively to {createdResult.temple.name} ({createdResult.temple.code}) with strict tenant boundaries.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Temple Manager Card */}
            <div className="bg-stone-900/90 p-5 rounded-2xl border border-amber-400/40 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-sm font-serif">
                  <UserCheck className="w-4 h-4 text-amber-400" /> 1. Temple Manager
                </span>
                <span className="font-mono text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                  TEMPLE_ADMIN
                </span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-stone-400 text-[11px] block">Manager Name:</span>
                  <span className="font-bold text-white text-sm">{createdResult.manager.name}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Login Mobile:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{createdResult.manager.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Assigned Password:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm bg-black/60 px-2.5 py-1 rounded border border-amber-400/30 inline-block">
                    {createdResult.manager.plainPassword}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Access Scope:</span>
                  <span className="text-stone-300">Full Operational Control over {createdResult.temple.name} (Pooja catalog, campaigns, QR, donors)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCredentials('manager')}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs border border-amber-400/40 flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedType === 'manager' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'manager' ? 'Manager Credentials Copied!' : 'Copy Manager Credentials'}
              </button>
            </div>

            {/* Finance Admin Card */}
            <div className="bg-stone-900/90 p-5 rounded-2xl border border-emerald-500/40 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm font-serif">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Finance Admin
                </span>
                <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  FINANCE_ADMIN
                </span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-stone-400 text-[11px] block">Finance Officer Name:</span>
                  <span className="font-bold text-white text-sm">{createdResult.finance.name}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Login Mobile:</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{createdResult.finance.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Assigned Password:</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm bg-black/60 px-2.5 py-1 rounded border border-emerald-400/30 inline-block">
                    {createdResult.finance.plainPassword}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[11px] block">Access Scope:</span>
                  <span className="text-emerald-200/90">Read-Only Financial Supervision, Super Admin Requests & Manager Chat</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCredentials('finance')}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedType === 'finance' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'finance' ? 'Finance Credentials Copied!' : 'Copy Finance Credentials'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleCopyCredentials('both')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {copiedType === 'both' ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              {copiedType === 'both' ? 'All Credentials Copied to Clipboard!' : 'Copy Complete Temple Package (Manager + Finance)'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/super/temples')}
              className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              Return to Shrines Directory
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      {!createdResult && (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Temple Shrine Entity Information */}
          <div className="bg-stone-950 p-6 rounded-3xl border-2 border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif font-bold text-base text-amber-300">
                  1. Temple Shrine Identification
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSuggestCode}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" /> Suggest Temple ID
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Temple ID / Code * <span className="text-stone-500 font-normal">(Used for shrine identifier & login)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TPL-GNT-108 or TPL-002"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono font-bold text-sm tracking-wider"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Temple Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Vasavi Kanyaka Parameswari Temple, Guntur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Presiding Deity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Vasavi Kanyaka Parameswari"
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Devasthanam Trust Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sri Kanyaka Parameswari Devasthanam Trust"
                  value={trustName}
                  onChange={(e) => setTrustName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guntur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-300 mb-1">
                  Street Address & Pincode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Street Address / Area (e.g. Main Bazaar, Kothapet)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="sm:col-span-2 px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Pin Code (e.g. 522001)"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Designated Temple Manager Provisioning & Credentials */}
          <div className="bg-stone-950 p-6 rounded-3xl border-2 border-devotional-gold/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-devotional-saffron" />
                <div>
                  <h2 className="font-serif font-bold text-base text-amber-300">
                    2. Designated Temple Manager Credentials
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    This manager will have exclusive administrative access to only this temple.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                ROLE: TEMPLE_ADMIN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Manager Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalyan Kumar"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1 flex items-center justify-between">
                  <span>Manager Mobile Number (Login ID) *</span>
                  <span className="text-[10px] text-stone-500 font-mono">10 digits</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono text-stone-400 text-xs font-bold pointer-events-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9848011223"
                    value={managerMobile}
                    onChange={(e) => setManagerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-16 pr-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono font-bold text-sm tracking-wider"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-300">
                    Manager Initial Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Generate Secure Password
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter or generate strong password"
                    value={managerPassword}
                    onChange={(e) => setManagerPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-300 mb-1">
                  Manager Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder={`manager.${code.toLowerCase().replace(/[^a-z0-9]/g, '')}@vasavi.dev`}
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. Designated Temple Finance Officer Provisioning & Credentials */}
          <div className="bg-stone-950 p-6 rounded-3xl border-2 border-emerald-600/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="font-serif font-bold text-base text-emerald-300">
                    3. Designated Finance Officer Credentials
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Finance Admin has read-only access to audit collections, submits requests directly to Super Admin, and coordinates with Temple Manager.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                ROLE: FINANCE_ADMIN (READ-ONLY AUDIT)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Finance Officer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Varma (Finance Admin)"
                  value={financeName}
                  onChange={(e) => setFinanceName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1 flex items-center justify-between">
                  <span>Finance Officer Mobile Number (Login ID) *</span>
                  <span className="text-[10px] text-stone-500 font-mono">10 digits</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono text-stone-400 text-xs font-bold pointer-events-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9440011223"
                    value={financeMobile}
                    onChange={(e) => setFinanceMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-16 pr-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono font-bold text-sm tracking-wider"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-300">
                    Finance Officer Initial Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateFinancePassword}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Generate Secure Password
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showFinancePassword ? 'text' : 'password'}
                    required
                    placeholder="Enter or generate strong password"
                    value={financePassword}
                    onChange={(e) => setFinancePassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFinancePassword(!showFinancePassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-200"
                  >
                    {showFinancePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-300 mb-1">
                  Finance Officer Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder={`finance.${code.toLowerCase().replace(/[^a-z0-9]/g, '')}@vasavi.dev`}
                  value={financeEmail}
                  onChange={(e) => setFinanceEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/admin/super/temples"
              className="text-stone-400 hover:text-stone-200 text-xs font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs rounded-2xl shadow-gold hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-devotional-maroon" />
              {loading ? 'Creating Temple & Provisioning Leadership...' : 'Onboard Temple & Issue Dual Leadership Credentials'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
