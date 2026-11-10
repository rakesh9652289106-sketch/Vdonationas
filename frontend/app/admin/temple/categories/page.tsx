'use client';

import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Plus,
  Flame,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import {
  getActiveCategories,
  getCategoryChangeRequests,
  submitCategoryChangeRequest,
  cancelCategoryChangeRequest,
  CategoryChangeRequest,
} from '@/lib/temple-governance-store';
import { DonationCategory } from '@/lib/types';

export default function TempleCategoriesAdminPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<DonationCategory[]>([]);
  const [pendingRequests, setPendingRequests] = useState<CategoryChangeRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DonationCategory | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<DonationCategory | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const loadData = () => {
    setCategories(getActiveCategories());
    setPendingRequests(getCategoryChangeRequests());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('categories_updated', loadData);
    window.addEventListener('category_requests_updated', loadData);
    return () => {
      window.removeEventListener('categories_updated', loadData);
      window.removeEventListener('category_requests_updated', loadData);
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cat: DonationCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      const updatedCat: DonationCategory = {
        ...editingCategory,
        name: name.trim(),
        description: description.trim(),
      };
      submitCategoryChangeRequest(
        'EDIT',
        updatedCat,
        'Srinivasa Rao (Penugonda Admin)',
        editingCategory,
        'Temple Admin modified category offering description.'
      );
      setStatusMsg({
        type: 'success',
        text: `✓ Modification request for "${name}" submitted to Super Admin for approval!`,
      });
    } else {
      const newCat: DonationCategory = {
        id: `cat-${Date.now()}`,
        templeId: 'tpl-vasavi-01',
        name: name.trim(),
        description: description.trim(),
        isActive: false, // inactive until super admin authorizes
      };
      submitCategoryChangeRequest(
        'CREATE',
        newCat,
        'Srinivasa Rao (Penugonda Admin)',
        undefined,
        'Temple Admin requested creation of new devotional offering category.'
      );
      setStatusMsg({
        type: 'success',
        text: `✓ New category "${name}" submitted to Super Admin for approval! It will appear in public devotee forms upon acceptance.`,
      });
    }

    setName('');
    setDescription('');
    setShowModal(false);
    loadData();
    setTimeout(() => setStatusMsg(null), 6000);
  };

  const handleRequestDelete = (cat: DonationCategory) => {
    submitCategoryChangeRequest(
      'DELETE',
      cat,
      'Srinivasa Rao (Penugonda Admin)',
      cat,
      'Temple Admin requested decommissioning of this donation category.'
    );
    setDeleteConfirmTarget(null);
    setStatusMsg({
      type: 'info',
      text: `✓ Deletion request for "${cat.name}" submitted to Super Admin for authorization.`,
    });
    loadData();
    setTimeout(() => setStatusMsg(null), 6000);
  };

  const handleCancelRequest = (requestId: string) => {
    cancelCategoryChangeRequest(requestId);
    setStatusMsg({
      type: 'info',
      text: 'Pending category request has been cancelled.',
    });
    loadData();
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Find active pending request for a specific category ID
  const getPendingForCategory = (catId: string) => {
    return pendingRequests.find((r) => r.status === 'PENDING_APPROVAL' && r.category.id === catId);
  };

  // Pending creation requests (categories that are not in live active list yet)
  const pendingCreations = pendingRequests.filter(
    (r) => r.status === 'PENDING_APPROVAL' && r.action === 'CREATE'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarSevaCategories')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarSevaCategories')} Governance
          </h1>
          <p className="text-amber-100/80 text-xs">
            Configure Sacred Offering Purposes for Penugonda Sri Vasavi Matha Shrines — Super Admin Approval Required
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-devotional-saffron via-amber-400 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-gold hover:scale-105 transition-transform flex items-center gap-1.5 border border-amber-300 shrink-0"
          >
            <Plus className="w-4 h-4 text-devotional-maroon" /> Propose New Category
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold shadow-md flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-200'
              : 'bg-stone-900 border-2 border-stone-700 text-stone-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* PENDING CATEGORY ADDITIONS (AWAITING SUPER ADMIN APPROVAL) */}
      {pendingCreations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-400">
              New Categories Pending Super Admin Approval ({pendingCreations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingCreations.map((req) => (
              <div
                key={req.id}
                className="bg-stone-900/90 border-2 border-dashed border-amber-400/80 p-6 rounded-3xl shadow-xl space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-400/40 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 animate-spin" /> Pending Approval & Publishing
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(req.id)}
                    className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-all text-xs flex items-center gap-1"
                    title="Cancel proposal"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-xl text-stone-100">{req.category.name}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{req.category.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Requested: {req.requestedAt}</span>
                  <span className="text-amber-300 font-mono">Action: CREATE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE & ACTIVE CATEGORIES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            Active Shrine Offering Categories ({categories.length})
          </h2>
          <span className="text-xs text-stone-500">Live on public donation forms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const pending = getPendingForCategory(cat.id);
            return (
              <div
                key={cat.id}
                className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 space-y-4 ${
                  pending
                    ? 'border-amber-400/80 ring-2 ring-amber-400/30'
                    : 'border-devotional-gold/40 hover:border-amber-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {pending ? (
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase border border-amber-400/40 flex items-center gap-1.5 w-fit">
                        <Clock className="w-3 h-3 animate-spin" /> {pending.action} Pending Super Admin Approval
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase border border-emerald-400/40">
                        ✓ ACTIVE SEVA CATEGORY
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 pt-1">
                      {pending && pending.action === 'EDIT' ? pending.category.name : cat.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {pending ? (
                      <button
                        type="button"
                        onClick={() => handleCancelRequest(pending.id)}
                        className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-semibold hover:bg-stone-200 transition-all"
                        title="Cancel pending request"
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                          title="Propose Category Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(cat)}
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                          title="Propose Category Deletion"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {pending && pending.action === 'EDIT' ? pending.category.description : cat.description}
                </p>

                {pending && pending.action === 'EDIT' && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-700 dark:text-amber-300 space-y-1">
                    <span className="font-bold">Original:</span> {cat.name} — {cat.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-devotional-gold/60 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
                {editingCategory ? 'Edit Donation Category' : 'Propose New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-100 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              Note: This action will be submitted for Super Admin review. Once approved, the category will be active on the devotee donation portal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Deepotsavam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                  Description & Offering Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain how pilgrim offerings under this category are utilized..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-bold flex items-center gap-1.5 border border-amber-400/40 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-devotional-saffron" />
                  {editingCategory ? 'Submit Modification' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-red-500/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-red-600 dark:text-red-400">
              Request Category Deletion
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to submit a request to decommission category{' '}
              <span className="font-bold text-stone-900 dark:text-stone-100">"{deleteConfirmTarget.name}"</span>?
              Super Admin authorization is required to remove it from public platforms.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRequestDelete(deleteConfirmTarget)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Submit Deletion Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
