'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, ChevronDown, Search, X, Check } from 'lucide-react';

export interface DevotionalSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface DevotionalSelectProps {
  options: (string | DevotionalSelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  helperText?: string;
  allowClear?: boolean;
  clearLabel?: string;
  showBadge?: boolean;
  showSparkle?: boolean;
  footerText?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  required?: boolean;
}

export function DevotionalSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder,
  label,
  helperText,
  allowClear = false,
  clearLabel = 'Not Specified / Skip (Optional)',
  showBadge = true,
  showSparkle = true,
  footerText,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  icon,
  disabled = false,
  required = false,
}: DevotionalSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options into uniform DevotionalSelectOption array
  const normalizedOptions: DevotionalSelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return {
          value: opt,
          label: opt,
          badge: opt.charAt(0).toUpperCase(),
        };
      }
      return {
        ...opt,
        badge: opt.badge || opt.label.charAt(0).toUpperCase(),
      };
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const query = search.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [normalizedOptions, search]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearch('');
  };

  const defaultSearchPlaceholder =
    searchPlaceholder || (footerText ? `Search ${footerText}...` : `Search ${normalizedOptions.length} options...`);

  return (
    <div className={`relative space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {allowClear && value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] text-devotional-maroon dark:text-devotional-gold hover:underline font-semibold flex items-center gap-0.5 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      )}

      {/* Trigger Button - Matched with project stone/cream/maroon/gold palette */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch('');
          }
        }}
        className={`w-full px-4 py-2.5 sm:py-3 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all text-left shadow-sm ${
          disabled ? 'opacity-50 cursor-not-allowed bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-800' : 'cursor-pointer'
        } ${
          isOpen
            ? 'bg-white dark:bg-stone-900 border-devotional-gold dark:border-devotional-gold ring-2 ring-devotional-gold/20 dark:ring-devotional-gold/30 text-stone-900 dark:text-stone-100'
            : selectedOption
            ? 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 hover:border-devotional-gold/70 dark:hover:border-devotional-gold/60 text-stone-900 dark:text-stone-100'
            : 'bg-stone-50 dark:bg-stone-900/80 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 text-stone-500 dark:text-stone-400'
        } ${buttonClassName}`}
      >
        <span className="flex items-center gap-2.5 truncate">
          {icon ? (
            <span className="shrink-0 text-devotional-gold">{icon}</span>
          ) : (
            <Sparkles
              className={`w-4 h-4 shrink-0 transition-transform ${
                selectedOption
                  ? 'text-devotional-gold dark:text-devotional-gold'
                  : 'text-stone-400 dark:text-stone-500'
              }`}
            />
          )}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-devotional-gold' : ''
          }`}
        />
      </button>

      {/* Helper text */}
      {helperText && <p className="text-[11px] text-stone-500 dark:text-stone-400">{helperText}</p>}

      {/* Dropdown Menu Modal / Popover */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-devotional-gold/40 dark:border-stone-700/80 rounded-2xl shadow-xl shadow-stone-900/10 dark:shadow-black/60 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          {/* Quick Search Header */}
          <div className="p-2.5 sm:p-3 bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2.5">
            <Search className="w-4 h-4 text-devotional-gold shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={defaultSearchPlaceholder}
              className="w-full bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options Scrollable List */}
          <div className="max-h-60 overflow-y-auto p-1.5 sm:p-2 space-y-1 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
            {/* Optional None/Skip Item */}
            {allowClear && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                  !value
                    ? 'bg-devotional-cream dark:bg-devotional-maroon/20 text-devotional-maroon dark:text-devotional-gold border border-devotional-gold/30'
                    : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-stone-400 text-xs">✕</span>
                  <span>{clearLabel}</span>
                </span>
                {!value && <Check className="w-4 h-4 text-devotional-maroon dark:text-devotional-gold shrink-0" />}
              </button>
            )}

            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500 dark:text-stone-400 font-medium">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-all group ${
                      isSelected
                        ? 'bg-devotional-cream dark:bg-devotional-maroon/30 text-devotional-maroon dark:text-amber-200 border border-devotional-gold/40 shadow-sm'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100/90 dark:hover:bg-stone-800/80 hover:text-devotional-maroon dark:hover:text-devotional-gold hover:translate-x-0.5'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      {showBadge && (
                        <span className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-devotional-cream-dark dark:group-hover:bg-stone-700 text-[11px] font-bold text-devotional-maroon dark:text-devotional-gold flex items-center justify-center border border-stone-200 dark:border-stone-700 shrink-0 transition-colors">
                          {opt.badge}
                        </span>
                      )}
                      <span className="text-left font-serif font-medium truncate">
                        {opt.label}
                        {opt.sublabel && (
                          <span className="block text-[10px] text-stone-500 dark:text-stone-400 font-sans font-normal">
                            {opt.sublabel}
                          </span>
                        )}
                      </span>
                    </span>

                    {isSelected ? (
                      <Check className="w-4 h-4 text-devotional-maroon dark:text-devotional-gold shrink-0 ml-2" />
                    ) : showSparkle ? (
                      <span className="text-[11px] text-devotional-gold/40 group-hover:text-devotional-gold shrink-0 ml-2 transition-colors">
                        ✨
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Notice */}
          <div className="px-3 py-2 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-100 dark:border-stone-800 text-[11px] font-medium text-stone-500 dark:text-stone-400 text-center tracking-wide">
            <span>
              {footerText ||
                `${normalizedOptions.length} Option${normalizedOptions.length === 1 ? '' : 's'} Available`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DevotionalSelect;
