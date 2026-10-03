'use client';

import React, { useState, useMemo } from 'react';
import {
  InitiativeType,
  INITIATIVE_TYPE_LABELS,
} from '@/lib/initiatives-data';
import {
  CURATED_INITIATIVE_PHOTOS,
  PHOTO_CATEGORIES,
  getCuratedPhotosByCategory,
  CuratedInitiativePhoto,
} from '@/lib/initiative-curated-photos';
import {
  Sparkles,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';

interface InitiativePhotoPickerProps {
  selectedCoverUrl: string;
  onSelectCover: (url: string) => void;
  initiativeType?: InitiativeType;
  galleryUrls?: string[];
  onToggleGallery?: (url: string) => void;
  label?: string;
  allowCustomInput?: boolean;
}

export default function InitiativePhotoPicker({
  selectedCoverUrl,
  onSelectCover,
  initiativeType,
  galleryUrls = [],
  onToggleGallery,
  label = 'Initiative Photos & Cover Media',
  allowCustomInput = true,
}: InitiativePhotoPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('RECOMMENDED');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');

  const typeConfig = initiativeType ? INITIATIVE_TYPE_LABELS[initiativeType] : null;

  // Filter photos based on category & search
  const displayedPhotos = useMemo(() => {
    let list = getCuratedPhotosByCategory(activeCategory, initiativeType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, initiativeType, searchQuery]);

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      onSelectCover(customUrlInput.trim());
      setCustomUrlInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Current Selection Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-devotional-saffron" />
            {label}
          </label>
          <p className="text-[11px] text-stone-400">
            {typeConfig ? (
              <>
                Curated photos recommended for{' '}
                <strong className="text-amber-200">
                  {typeConfig.icon} {typeConfig.label}
                </strong>
                . Click any photo to apply as the primary cover.
              </>
            ) : (
              'Select a high-resolution devotional photo for this initiative.'
            )}
          </p>
        </div>

        {allowCustomInput && (
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            {showCustomInput ? 'Hide Custom URL' : '+ Paste Custom URL'}
          </button>
        )}
      </div>

      {/* Custom URL Input Box (Collapsible) */}
      {showCustomInput && (
        <div className="p-3.5 rounded-2xl bg-stone-900 border border-amber-500/40 space-y-2 animate-in fade-in duration-150">
          <label className="text-[10px] uppercase font-bold text-stone-300">
            Custom Image Web URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:ring-1 focus:ring-devotional-gold outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-4 py-2 rounded-xl bg-devotional-saffron hover:bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Active Cover Preview Banner */}
      {selectedCoverUrl && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-lg bg-stone-950">
          <div className="h-44 sm:h-52 w-full relative">
            <img
              src={selectedCoverUrl}
              alt="Active Cover Preview"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-xs">
              <Check className="w-3.5 h-3.5" /> Selected Cover Image
            </div>
            {typeConfig && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/80 text-amber-300 text-[10px] font-bold border border-amber-400/40">
                {typeConfig.icon} {typeConfig.label}
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 text-stone-300 text-[11px] truncate font-mono bg-stone-950/70 p-2 rounded-xl border border-stone-800 backdrop-blur-xs">
              URL: {selectedCoverUrl}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Photo Categories
          </span>
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temple, gopuram..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-[11px] outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {PHOTO_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold border border-amber-400'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Curated Photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto p-1 rounded-2xl border border-stone-800/80 bg-stone-950/60 scrollbar-thin">
        {displayedPhotos.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-stone-500">
            No curated photos match your search query. Try another keyword or switch category.
          </div>
        ) : (
          displayedPhotos.map((photo) => {
            const isCover = selectedCoverUrl === photo.url;
            const isInGallery = galleryUrls.includes(photo.url);

            return (
              <div
                key={photo.id}
                className={`group relative rounded-xl overflow-hidden border transition-all duration-200 bg-stone-900 flex flex-col ${
                  isCover
                    ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-gold'
                    : 'border-stone-800 hover:border-amber-500/60'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-950">
                  <img
                    src={photo.thumbnail}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-80" />

                  {/* Active Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-3" /> Cover
                    </div>
                  )}

                  {isInGallery && !isCover && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-bold">
                      In Gallery
                    </div>
                  )}
                </div>

                {/* Info & Action Controls */}
                <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-serif font-bold text-stone-100 line-clamp-1" title={photo.title}>
                      {photo.title}
                    </h4>
                    <p className="text-[9px] text-stone-400 line-clamp-1" title={photo.description}>
                      {photo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectCover(photo.url)}
                      className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                        isCover
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-devotional-saffron hover:bg-amber-600 text-white shadow-xs'
                      }`}
                    >
                      {isCover ? '✓ Active' : 'Set Cover'}
                    </button>

                    {onToggleGallery && (
                      <button
                        type="button"
                        onClick={() => onToggleGallery(photo.url)}
                        title={isInGallery ? 'Remove from Gallery' : 'Add to Gallery'}
                        className={`p-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isInGallery
                            ? 'bg-blue-900/60 text-blue-300 border border-blue-500/50'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                        }`}
                      >
                        <Plus className={`w-3.5 h-3.5 ${isInGallery ? 'rotate-45 text-red-300' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Gallery Images Strip (If provided) */}
      {galleryUrls.length > 0 && onToggleGallery && (
        <div className="space-y-1.5 pt-2 border-t border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Initiative Gallery Images ({galleryUrls.length})
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative w-20 h-16 rounded-xl overflow-hidden border border-stone-800 shrink-0 group"
              >
                <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onToggleGallery(url)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
