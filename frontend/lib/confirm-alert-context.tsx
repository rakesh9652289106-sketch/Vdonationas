'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Trash2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  X,
  Flame,
  ShieldCheck,
  Bell,
  ArrowRight,
} from 'lucide-react';

export type ActionVariant = 'danger' | 'warning' | 'change' | 'info';
export type AlertType = 'success' | 'warning' | 'error' | 'info' | 'change' | 'danger';

export interface ConfirmOptions {
  title: string;
  message: string;
  itemName?: string;
  itemDetails?: string;
  variant?: ActionVariant;
  confirmText?: string;
  cancelText?: string;
  icon?: 'trash' | 'alert' | 'refresh' | 'sparkles' | 'shield';
}

export interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  duration?: number;
}

interface ToastItem extends AlertOptions {
  id: string;
}

interface ConfirmAlertContextType {
  confirmAction: (options: ConfirmOptions) => Promise<boolean>;
  showAlert: (options: AlertOptions) => void;
}

const ConfirmAlertContext = createContext<ConfirmAlertContextType | null>(null);

export function useConfirmAlert() {
  const ctx = useContext(ConfirmAlertContext);
  if (!ctx) {
    throw new Error('useConfirmAlert must be used within ConfirmAlertProvider');
  }
  return ctx;
}

export function ConfirmAlertProvider({ children }: { children: ReactNode }) {
  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  // Toast Stack State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const confirmAction = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleModalResolve = (val: boolean) => {
    if (modalState) {
      modalState.resolve(val);
      setModalState(null);
    }
  };

  const showAlert = useCallback((options: AlertOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { ...options, id };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    const dur = options.duration || 4500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, dur);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentOpts = modalState?.options;
  const variant = currentOpts?.variant || 'warning';

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          borderColor: 'border-red-500/80',
          ringColor: 'ring-red-500/30',
          glow: 'shadow-[0_0_50px_rgba(239,68,68,0.25)]',
          iconBg: 'bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-400',
          confirmBtn: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white shadow-lg shadow-red-950/50',
          badgeText: 'Destructive Action Warning',
          badgeBg: 'bg-red-950/80 text-red-300 border-red-800',
        };
      case 'change':
        return {
          borderColor: 'border-amber-400/90',
          ringColor: 'ring-amber-400/30',
          glow: 'shadow-[0_0_50px_rgba(212,175,55,0.25)]',
          iconBg: 'bg-gradient-to-br from-amber-500 to-devotional-saffron text-stone-950 border-amber-300',
          confirmBtn: 'bg-gradient-to-r from-amber-600 via-devotional-saffron to-amber-600 hover:brightness-110 text-white shadow-gold',
          badgeText: 'Platform State Modification',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800',
        };
      case 'info':
        return {
          borderColor: 'border-emerald-500/80',
          ringColor: 'ring-emerald-500/30',
          glow: 'shadow-[0_0_50px_rgba(16,185,129,0.2)]',
          iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400',
          confirmBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-lg shadow-emerald-950/40',
          badgeText: 'Sacred Action Notice',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
        };
      case 'warning':
      default:
        return {
          borderColor: 'border-devotional-gold/90',
          ringColor: 'ring-devotional-gold/30',
          glow: 'shadow-[0_0_50px_rgba(212,175,55,0.3)]',
          iconBg: 'bg-gradient-to-br from-devotional-saffron to-amber-600 text-white border-amber-400',
          confirmBtn: 'bg-gradient-to-r from-devotional-maroon via-red-800 to-devotional-maroon hover:brightness-110 text-white shadow-md shadow-red-950/50 border border-amber-400/40',
          badgeText: 'Confirmation Required',
          badgeBg: 'bg-stone-900 text-amber-300 border-amber-400/40',
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <ConfirmAlertContext.Provider value={{ confirmAction, showAlert }}>
      {children}

      {/* CONFIRMATION MODAL WITH DEVOTIONAL 3D STYLING */}
      {modalState?.isOpen && currentOpts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full max-w-lg rounded-3xl bg-stone-950 text-white p-6 sm:p-8 border-2 ${vStyles.borderColor} ${vStyles.glow} space-y-6 shadow-2xl animate-scaleUp`}
          >
            {/* Ambient Background Aura */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => handleModalResolve(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Sacred Header Badge & Icon */}
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-lg ${vStyles.iconBg}`}
              >
                {variant === 'danger' ? (
                  <Trash2 className="w-6 h-6" />
                ) : variant === 'change' ? (
                  <RefreshCw className="w-6 h-6" />
                ) : variant === 'info' ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1 pr-6">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${vStyles.badgeBg}`}>
                  {vStyles.badgeText}
                </span>
                <h3 className="font-serif font-bold text-xl text-amber-200 tracking-tight leading-snug">
                  {currentOpts.title}
                </h3>
              </div>
            </div>

            {/* Main Message Body */}
            <div className="space-y-3 text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
              <p>{currentOpts.message}</p>

              {/* Item Target Highlight Card */}
              {currentOpts.itemName && (
                <div className="p-3 rounded-xl bg-stone-950 border border-amber-400/30 flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-stone-400 font-bold uppercase">Target Item:</span>
                  <span className="font-bold text-amber-300 truncate font-mono">
                    {currentOpts.itemName}
                  </span>
                </div>
              )}

              {currentOpts.itemDetails && (
                <p className="text-[11px] text-stone-400 italic">
                  ℹ️ {currentOpts.itemDetails}
                </p>
              )}
            </div>

            {/* Devotional Reassurance Strip */}
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80">
              <Flame className="w-3.5 h-3.5 text-devotional-saffron shrink-0" />
              <span>Sri Vasavi Matha Trust Governance Protocol</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleModalResolve(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-bold text-xs transition-colors"
              >
                {currentOpts.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => handleModalResolve(true)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 ${vStyles.confirmBtn}`}
              >
                <span>{currentOpts.confirmText || 'Confirm Action'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION STACK WITH SACRED DEVOTIONAL GLOW */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const isError = toast.type === 'error' || toast.type === 'danger';
          const isWarning = toast.type === 'warning';
          const isInfo = toast.type === 'info';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slideDown flex items-start gap-3 ${
                isError
                  ? 'bg-stone-950/95 border-red-500 text-white shadow-red-950/50'
                  : isWarning
                  ? 'bg-stone-950/95 border-amber-400 text-white shadow-amber-950/50'
                  : isInfo
                  ? 'bg-stone-950/95 border-devotional-gold text-white shadow-black/60'
                  : 'bg-stone-950/95 border-emerald-500 text-white shadow-emerald-950/50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isError
                    ? 'bg-red-950 text-red-400 border-red-700'
                    : isWarning
                    ? 'bg-amber-950 text-amber-400 border-amber-700'
                    : isInfo
                    ? 'bg-stone-900 text-devotional-gold border-amber-400/40'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-700'
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-5 h-5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : isInfo ? (
                  <Bell className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-0.5 text-xs pr-2">
                <h4 className="font-serif font-bold text-sm text-amber-200">
                  {toast.title}
                </h4>
                <p className="text-stone-300 leading-relaxed text-[11px]">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ConfirmAlertContext.Provider>
  );
}
