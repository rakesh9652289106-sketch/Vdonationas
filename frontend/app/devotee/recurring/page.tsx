'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Repeat, Play, Pause, Trash2, Edit3, Flame, ShieldCheck, Plus, Check } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import { useAuth } from '@/lib/auth-context';
import { autopayService } from '@/lib/supabase-service';
import { supabase } from '@/lib/supabase';

export default function DevoteeRecurringDonationsPage() {
  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any | null>(null);
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED' | 'CANCELLED'>('ACTIVE');
  const [amount, setAmount] = useState(1116);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState('1116');
  const [loading, setLoading] = useState(true);

  const autopayPresets = [102, 516, 1116, 2116, 5116, 10116];

  React.useEffect(() => {
    async function loadSub() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const subs = await autopayService.getDevoteeSubscriptions(user.id);
        if (subs && subs.length > 0) {
          const first = subs[0];
          setSubscription(first);
          setStatus((first.status as any) || 'ACTIVE');
          setAmount(Number(first.amount || 1116));
          setEditAmount(String(first.amount || 1116));
        }
      } catch (err) {
        console.warn('[Supabase] Failed to load subscription:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSub();
  }, [user]);

  const handleSaveEdit = async () => {
    const parsed = parseInt(editAmount, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const ok = await confirmAction({
        title: 'Update Monthly Offering Amount?',
        message: `Are you sure you want to change your recurring seva offering from ₹${amount.toLocaleString('en-IN')} to ₹${parsed.toLocaleString('en-IN')} per month?`,
        itemName: `New Monthly Offering: ₹${parsed.toLocaleString('en-IN')}`,
        variant: 'change',
        confirmText: 'Yes, Update Amount',
        cancelText: 'Keep Current Amount',
      });
      if (ok) {
        if (subscription?.id) {
          await supabase.from('autopay_subscriptions').update({ amount: parsed, updated_at: new Date().toISOString() }).eq('id', subscription.id);
        }
        setAmount(parsed);
        setIsEditing(false);
        showAlert({
          title: 'AutoPay Amount Updated',
          message: `Your sacred monthly donation has been adjusted to ₹${parsed.toLocaleString('en-IN')} in Supabase.`,
          type: 'success',
        });
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans px-3 sm:px-0">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> AutoPay
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Recurring Seva Subscriptions
          </h1>
          <p className="text-amber-100/80 text-xs">
            Automated Monthly Nitya Annadanam & Sacred Seva via UPI AutoPay
          </p>
        </div>
      </div>

      {/* 3D AUTOPAY CARD */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-devotional-gold/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400/40'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400/40'
                }`}
              >
                {status}
              </span>
              <span className="text-xs text-stone-500 font-medium">AutoPay Active</span>
            </div>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100 mt-1">
              Monthly Nitya Annadanam Seva
            </h3>
            <p className="text-xs text-stone-500">Sri Vasavi Kanyaka Parameswari Matha, Penugonda</p>
          </div>

          <div className="text-right">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs font-bold text-stone-600">₹</span>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-24 px-2 py-1 text-sm font-bold border rounded-lg dark:bg-stone-800"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="p-1.5 rounded-lg bg-devotional-maroon text-white active-press cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {autopayPresets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setEditAmount(String(amt))}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                        editAmount === String(amt)
                          ? 'bg-amber-400 text-stone-950 border-amber-500'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 hover:border-amber-400'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="font-serif font-bold text-2xl text-devotional-maroon dark:text-amber-400">
                ₹{amount.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-sans text-stone-500 font-normal">/ month</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Frequency</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">1st of Every Month</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Next Deduction</span>
            <span className="font-bold text-stone-900 dark:text-stone-100">01 October 2026</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Payment Method</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> vasavi@oksbi
            </span>
          </div>
        </div>

        {/* Action Buttons: Edit | Pause / Resume | Cancel */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              setEditAmount(amount.toString());
              setIsEditing(!isEditing);
            }}
            className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 active-press transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
            Edit
          </button>

          {status === 'ACTIVE' ? (
            <button
              type="button"
              onClick={async () => {
                const ok = await confirmAction({
                  title: 'Pause Sacred Monthly AutoPay?',
                  message: 'Your monthly contribution will be placed on temporary hold. You can resume at any sacred festival without re-entering UPI mandate details.',
                  itemName: `Nitya Annadanam Seva (₹${amount.toLocaleString('en-IN')}/month)`,
                  variant: 'change',
                  confirmText: 'Yes, Pause Offering',
                  cancelText: 'Keep Active',
                });
                if (ok) {
                  if (subscription?.id) {
                    await autopayService.updateStatus(subscription.id, 'PAUSED');
                  }
                  setStatus('PAUSED');
                  showAlert({
                    title: 'AutoPay Offering Paused',
                    message: 'Your recurring seva deduction has been placed on hold in Supabase.',
                    type: 'warning',
                  });
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-amber-400 active-press transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={async () => {
                if (subscription?.id) {
                  await autopayService.updateStatus(subscription.id, 'ACTIVE');
                }
                setStatus('ACTIVE');
                showAlert({
                  title: 'Sacred AutoPay Resumed!',
                  message: 'Your recurring monthly seva offering is now active in Supabase. May Sri Vasavi Matha bless you.',
                  type: 'success',
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-emerald-700 active-press transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Resume
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              const ok = await confirmAction({
                title: 'Cancel Monthly AutoPay Mandate?',
                message: 'Are you sure you want to permanently cancel your sacred monthly seva mandate? This action will terminate your UPI recurring auto-debit.',
                itemName: `Nitya Annadanam Seva (₹${amount.toLocaleString('en-IN')}/month)`,
                variant: 'danger',
                confirmText: 'Yes, Cancel Mandate',
                cancelText: 'Keep My Offering',
              });
              if (ok) {
                if (subscription?.id) {
                  await autopayService.updateStatus(subscription.id, 'CANCELLED');
                }
                setStatus('CANCELLED');
                showAlert({
                  title: 'AutoPay Subscription Cancelled',
                  message: 'Your monthly recurring mandate has been successfully terminated in Supabase.',
                  type: 'info',
                });
              }
            }}
            className="px-5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 active-press transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      </div>

      {/* ACTIVATE NEW AUTOPAY CARD */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-900/80 p-6 rounded-3xl border border-devotional-gold/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif font-bold text-base text-devotional-maroon dark:text-amber-400">
            Sponsor Another Monthly Sacred Seva
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Set up automatic monthly contributions for Gau Seva, Vidyadanam, or Daily Kumkumarchana.
          </p>
        </div>
        <Link
          href="/donate/recurring"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 active-press transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Activate
        </Link>
      </div>
    </div>
  );
}
