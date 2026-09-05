'use client';

import React from 'react';
import { DevotionalSelect, DevotionalSelectProps } from './DevotionalSelect';
import { VEDIC_NAKSHATRAS, VEDIC_GOTRAS, VEDIC_RASHIS } from '@/lib/vedic-data';

export interface NakshatraSelectProps
  extends Omit<DevotionalSelectProps, 'options'> {
  options?: (string | { value: string; label: string })[];
}

export function NakshatraSelect({
  value,
  onChange,
  placeholder = 'Select Nakshatra (Optional)',
  searchPlaceholder = 'Search 27 Nakshatras...',
  footerText = '27 Vedic Janma Nakshatras',
  allowClear = true,
  options = VEDIC_NAKSHATRAS as unknown as string[],
  ...rest
}: NakshatraSelectProps) {
  return (
    <DevotionalSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      footerText={footerText}
      allowClear={allowClear}
      options={options}
      showBadge={true}
      showSparkle={true}
      {...rest}
    />
  );
}

export interface GotraSelectProps
  extends Omit<DevotionalSelectProps, 'options'> {
  options?: (string | { value: string; label: string })[];
}

export function GotraSelect({
  value,
  onChange,
  placeholder = 'Select Devotional Gotram (Optional)',
  searchPlaceholder = 'Search Vedic Gotras...',
  footerText = 'Vedic Maharshi Gotras',
  allowClear = true,
  options = VEDIC_GOTRAS as unknown as string[],
  ...rest
}: GotraSelectProps) {
  return (
    <DevotionalSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      footerText={footerText}
      allowClear={allowClear}
      options={options}
      showBadge={true}
      showSparkle={true}
      {...rest}
    />
  );
}

export interface RashiSelectProps
  extends Omit<DevotionalSelectProps, 'options'> {
  options?: (string | { value: string; label: string })[];
}

export function RashiSelect({
  value,
  onChange,
  placeholder = 'Select Janma Rashi (Optional)',
  searchPlaceholder = 'Search 12 Rashis...',
  footerText = '12 Vedic Rashis (Zodiacs)',
  allowClear = true,
  options = VEDIC_RASHIS as unknown as { value: string; label: string }[],
  ...rest
}: RashiSelectProps) {
  return (
    <DevotionalSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      footerText={footerText}
      allowClear={allowClear}
      options={options}
      showBadge={true}
      showSparkle={true}
      {...rest}
    />
  );
}
