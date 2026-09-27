// Favorites Store for Devotees' Bookmarked Temples & Shrines
'use client';

const STORAGE_KEY = 'vdonations_favorite_temples';

export function getFavoriteTempleIds(): string[] {
  if (typeof window === 'undefined') return ['tpl-penugonda-001'];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = ['tpl-penugonda-001'];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return ['tpl-penugonda-001'];
  }
}

export function isTempleFavorite(templeId: string): boolean {
  const ids = getFavoriteTempleIds();
  return ids.includes(templeId);
}

export function toggleFavoriteTemple(templeId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const ids = getFavoriteTempleIds();
    let updated: string[];
    let isNowFav = false;

    if (ids.includes(templeId)) {
      updated = ids.filter((id) => id !== templeId);
      isNowFav = false;
    } else {
      updated = [...ids, templeId];
      isNowFav = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('vdonations_favorites_updated', { detail: updated }));
    return isNowFav;
  } catch {
    return false;
  }
}
