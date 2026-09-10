'use client';

import React from 'react';
import { DevotionalSelect, DevotionalSelectProps } from './DevotionalSelect';
import { VEDIC_NAKSHATRAS, VEDIC_GOTRAS, VEDIC_RASHIS } from '@/lib/vedic-data';
import { GOTHIRAM_DATA } from '@/lib/gothiram-data';

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

// 102 Sri Vasavi Kanyaka Parameswari Arya Vysya Sacred Gotras (Strictly 1 to 102)
export const VASAVI_102_GOTRAS_OPTIONS = GOTHIRAM_DATA.map((g) => ({
  value: `${g.id} - ${g.name}`,
  label: `${g.id}. ${g.name}${g.telugu ? ` (${g.telugu})` : ''}`,
  sublabel: `Sankethanamam: ${g.sankethanamams.join(', ')}`,
  badge: String(g.id),
  keywords: `${g.id} ${g.name} ${g.telugu || ''} ${g.sankethanamams.join(' ')}`,
}));

export interface GotraSelectProps
  extends Omit<DevotionalSelectProps, 'options'> {
  options?: (string | { value: string; label: string; sublabel?: string; badge?: string; keywords?: string })[];
}

export function GotraSelect({
  value,
  onChange,
  placeholder = 'Select Devotee Gotram (Mandatory)',
  searchPlaceholder = 'Search 102 Arya Vysya Gotras (e.g. 44, MOUTHKALYASA, NAABILLA)...',
  footerText = '102 Sri Vasavi Kanyaka Parameswari Gotras',
  allowClear = false,
  options = VASAVI_102_GOTRAS_OPTIONS,
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
