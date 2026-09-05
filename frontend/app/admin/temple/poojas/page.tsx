'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  ShieldCheck,
  Power,
  RotateCcw,
  X,
  Send,
  Lock,
  Timer,
  Info,
  Bell,
  Ban,
  Slash,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import {
  PoojaItem,
  getPoojaCatalog,
  savePoojaCatalog,
  DEFAULT_POOJA_CATALOG,
} from '@/lib/pooja-store';
import {
  MonthReleaseRecord,
  getMonthlyReleases,
  saveMonthlyReleases,
  BlockedDateRecord,
  getBlockedDates,
  saveBlockedDates,
  isWithin3MonthsLimit,
  isWithin4MonthsLimit,
  isWithin4To7MonthsWindow,
  validateSequentialPreviousMonths,
  validateReleaseTimeAndGap,
  getRolling12MonthsStatus,
  MonthStatusInfo,
  TempleAdminNotification,
  getTempleAdminNotifications,
  saveTempleAdminNotifications,
  SevaSuspensionRecord,
  getSevaSuspensions,
  saveSevaSuspensions,
  SevaModificationRecord,
  getSevaModifications,
  saveSevaModifications,
} from '@/lib/quota-store';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function TemplePoojasAdminPage() {
  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [activeTab, setActiveTab] = useState<'catalog' | 'monthly-releases' | 'blocked-dates'>('catalog');

  // Pooja Catalog States
  const [poojas, setPoojas] = useState<PoojaItem[]>([]);
  const [modifications, setModifications] = useState<SevaModificationRecord[]>([]);
  const [editingPooja, setEditingPooja] = useState<PoojaItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Seva Suspension / Reactivation States (Same-Time Super Admin Request)
  const [suspensions, setSuspensions] = useState<SevaSuspensionRecord[]>([]);
  const [isSuspensionModalOpen, setIsSuspensionModalOpen] = useState(false);
  const [suspensionTarget, setSuspensionTarget] = useState<PoojaItem | null>(null);
  const [suspensionAction, setSuspensionAction] = useState<'SUSPEND' | 'UNSUSPEND'>('SUSPEND');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionNotes, setSuspensionNotes] = useState('');
  const [suspensionError, setSuspensionError] = useState<string | null>(null);

  // Monthly Release States
  const [releases, setReleases] = useState<MonthReleaseRecord[]>([]);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [resubmittingRecord, setResubmittingRecord] = useState<MonthReleaseRecord | null>(null);
  const [adminNotifs, setAdminNotifs] = useState<TempleAdminNotification[]>([]);

  // Compute Allowed Window for Blocking: 4 to 7 Months in advance (e.g. Jan 1 to Apr 30)
  const nowForBlocking = new Date();
  const defaultMinBlockDate = new Date(nowForBlocking.getFullYear(), nowForBlocking.getMonth() + 4, 1);
  const minBlockDateISO = `${defaultMinBlockDate.getFullYear()}-${String(defaultMinBlockDate.getMonth() + 1).padStart(2, '0')}-${String(defaultMinBlockDate.getDate()).padStart(2, '0')}`;

  const defaultMaxBlockDate = new Date(nowForBlocking.getFullYear(), nowForBlocking.getMonth() + 8, 0);
  const maxBlockDateISO = `${defaultMaxBlockDate.getFullYear()}-${String(defaultMaxBlockDate.getMonth() + 1).padStart(2, '0')}-${String(defaultMaxBlockDate.getDate()).padStart(2, '0')}`;

  // Blocked Dates States (4 to 7 Months Window)
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>([]);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    sevaId: 'ALL',
    startDate: minBlockDateISO,
    startTime: '04:00 AM',
    endDate: minBlockDateISO,
    endTime: '08:00 PM',
    reason: 'Surya Grahanam (Solar Eclipse) - Sanctum Closed for Samprokshanam',
    notes: 'Holy sanctum closed for all devotee darshan & sevas during eclipse hours.',
  });
  const [blockError, setBlockError] = useState<string | null>(null);

  // Tomorrow date string as default release date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultReleaseDateStr = tomorrow.toISOString().split('T')[0];

  const [releaseForm, setReleaseForm] = useState({
    targetYear: 2026,
    targetMonth: 9, // October (0-indexed 9)
    sevaId: 'pooja-01', // Enforce specific seva only
    releaseDate: defaultReleaseDateStr,
    releaseTime: '10:00 AM',
    dailyQuota: 50,
    notes: '',
  });
  const [releaseError, setReleaseError] = useState<string | null>(null);

  // Form states for Add / Edit Seva
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    deity: string;
    description: string;
    price: number;
    duration: string;
    availableSlots: string;
    benefits: string;
    bannerGradient: string;
    isActive: boolean;
  }>({
    title: '',
    deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
    description: '',
    price: 1001,
    duration: '45 mins',
    availableSlots: '08:00 AM, 10:30 AM, 05:30 PM, 07:00 PM',
    benefits: 'Family Prosperity, Sacred Prasadam, Ammavari Raksha',
    bannerGradient: 'from-amber-700 via-devotional-maroon to-stone-950',
    isActive: true,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const catalog = getPoojaCatalog();
    setPoojas(catalog);
    setModifications(getSevaModifications());
    setReleases(getMonthlyReleases());
    setBlockedDates(getBlockedDates());
    setSuspensions(getSevaSuspensions());
    setAdminNotifs(getTempleAdminNotifications());
    if (catalog.length > 0 && !releaseForm.sevaId) {
      setReleaseForm((prev) => ({ ...prev, sevaId: catalog[0].id }));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('seva_releases_updated', loadData);
    window.addEventListener('blocked_dates_updated', loadData);
    window.addEventListener('seva_suspensions_updated', loadData);
    window.addEventListener('seva_modifications_updated', loadData);
    window.addEventListener('temple_admin_notifs_updated', loadData);
    return () => {
      window.removeEventListener('seva_releases_updated', loadData);
      window.removeEventListener('blocked_dates_updated', loadData);
      window.removeEventListener('seva_suspensions_updated', loadData);
      window.removeEventListener('seva_modifications_updated', loadData);
      window.removeEventListener('temple_admin_notifs_updated', loadData);
    };
  }, []);

  const handleOpenResubmitModal = (record: MonthReleaseRecord) => {
    setReleaseError(null);
    setResubmittingRecord(record);
    setReleaseForm({
      targetYear: record.year,
      targetMonth: record.month,
      sevaId: record.sevaId,
      releaseDate: record.releaseDate,
      releaseTime: record.releaseTime,
      dailyQuota: record.dailySlotQuota,
      notes: record.notes || '',
    });
    setIsReleaseModalOpen(true);
  };

  const showNotification = (
    msg: string,
    type: 'info' | 'change' | 'warning' | 'danger' = 'info',
    title = 'Temple Action Recorded'
  ) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
    showAlert({
      type,
      title,
      message: msg.replace(/^[✓\s]+/, ''),
    });
  };

  const handleOpenAddModal = () => {
    setFormError(null);
    setFormData({
      title: '',
      deity: 'Sri Vasavi Kanyaka Parameswari Ammavaru',
      description: '',
      price: 1001,
      duration: '45 mins',
      availableSlots: '08:00 AM, 10:30 AM, 05:30 PM, 07:00 PM',
      benefits: 'Family Prosperity, Sacred Prasadam, Ammavari Raksha',
      bannerGradient: 'from-amber-700 via-devotional-maroon to-stone-950',
      isActive: true,
    });
    setEditingPooja(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (pooja: PoojaItem) => {
    setFormError(null);
    setEditingPooja(pooja);
    setFormData({
      id: pooja.id,
      title: pooja.title,
      deity: pooja.deity,
      description: pooja.description,
      price: pooja.price,
      duration: pooja.duration,
      availableSlots: pooja.availableSlots.join(', '),
      benefits: pooja.benefits.join(', '),
      bannerGradient: pooja.bannerGradient,
      isActive: pooja.isActive,
    });
    setIsAddModalOpen(true);
  };

  const handleSavePooja = () => {
    setFormError(null);
    if (!formData.title.trim()) {
      setFormError('Seva Title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Seva Description is required.');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setFormError('Price must be greater than 0.');
      return;
    }

    const slotsArray = formData.availableSlots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefitsArray = formData.benefits
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    if (editingPooja) {
      const proposedData = {
        title: formData.title.trim(),
        deity: formData.deity.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: formData.duration.trim() || '45 mins',
        availableSlots: slotsArray.length > 0 ? slotsArray : editingPooja.availableSlots,
        benefits: benefitsArray.length > 0 ? benefitsArray : editingPooja.benefits,
        bannerGradient: formData.bannerGradient,
        isActive: editingPooja.isActive,
      };

      const newMod: SevaModificationRecord = {
        id: `mod-${Date.now()}`,
        templeId: 'tpl-vasavi-01',
        templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        sevaId: editingPooja.id,
        sevaTitle: editingPooja.title,
        action: 'EDIT',
        proposedData,
        originalData: editingPooja,
        reason: 'Temple Admin submitted updated seva ritual details & offering price for Super Admin review.',
        status: 'PENDING_APPROVAL',
        requestedBy: 'Srinivasa Rao (Penugonda Admin)',
        requestedAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const currentMods = getSevaModifications();
      saveSevaModifications([newMod, ...currentMods]);
      showNotification(`✓ Edit request for "${formData.title}" submitted to Super Admin for approval! Changes will reflect once authorized.`);
    } else {
      const newPoojaId = `pooja-${Date.now()}`;
      const proposedData = {
        title: formData.title.trim(),
        deity: formData.deity.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: formData.duration.trim() || '45 mins',
        availableSlots: slotsArray,
        benefits: benefitsArray,
        bannerGradient: formData.bannerGradient,
        isActive: true,
      };

      const newMod: SevaModificationRecord = {
        id: `mod-${Date.now()}`,
        templeId: 'tpl-vasavi-01',
        templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        sevaId: newPoojaId,
        sevaTitle: formData.title.trim(),
        action: 'CREATE',
        proposedData,
        reason: 'Temple Admin created a new devotional seva offering for Super Admin acceptance.',
        status: 'PENDING_APPROVAL',
        requestedBy: 'Srinivasa Rao (Penugonda Admin)',
        requestedAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const currentMods = getSevaModifications();
      saveSevaModifications([newMod, ...currentMods]);
      showNotification(`✓ New Seva creation request for "${formData.title}" submitted to Super Admin for authorization!`);
    }

    setIsAddModalOpen(false);
    setEditingPooja(null);
  };

  const handleDeletePooja = async (id: string) => {
    const target = poojas.find((p) => p.id === id);
    if (!target) return;

    const confirmed = await confirmAction({
      title: 'Request Decommissioning of Seva?',
      message: `Are you sure you want to request the removal of "${target.title}" from the temple catalog? A formal decommission request will be sent to Super Admin for approval.`,
      confirmText: 'Request Removal',
      variant: 'danger',
    });

    if (!confirmed) return;

    const newMod: SevaModificationRecord = {
      id: `mod-${Date.now()}`,
      templeId: 'tpl-vasavi-01',
      templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
      sevaId: target.id,
      sevaTitle: target.title,
      action: 'DELETE',
      originalData: target,
      reason: 'Temple Admin requested seva removal / decommissioning from catalog.',
      status: 'PENDING_APPROVAL',
      requestedBy: 'Srinivasa Rao (Penugonda Admin)',
      requestedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const currentMods = getSevaModifications();
    saveSevaModifications([newMod, ...currentMods]);
    setDeleteConfirmId(null);
    showNotification(
      `✓ Deletion request for "${target.title}" submitted to Super Admin for authorization!`,
      'danger',
      'Deletion Request Submitted'
    );
  };

  const handleOpenSuspensionModal = (pooja: PoojaItem, action: 'SUSPEND' | 'UNSUSPEND') => {
    setSuspensionTarget(pooja);
    setSuspensionAction(action);
    setSuspensionReason('');
    setSuspensionNotes('');
    setSuspensionError(null);
    setIsSuspensionModalOpen(true);
  };

  const handleSubmitSuspension = () => {
    if (!suspensionTarget) return;
    if (!suspensionReason.trim()) {
      setSuspensionError('Please enter a rationale / reason for this immediate request.');
      return;
    }

    const newSusp: SevaSuspensionRecord = {
      id: `susp-${Date.now()}`,
      templeId: 'tpl-vasavi-01',
      templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
      sevaId: suspensionTarget.id,
      sevaTitle: suspensionTarget.title,
      action: suspensionAction,
      reason: suspensionReason.trim(),
      notes: suspensionNotes.trim() || undefined,
      status: 'PENDING_APPROVAL',
      requestedBy: 'Srinivasa Rao (Penugonda Admin)',
      requestedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [newSusp, ...suspensions];
    setSuspensions(updated);
    saveSevaSuspensions(updated);

    showNotification(
      `✓ Request to ${suspensionAction === 'SUSPEND' ? 'suspend' : 'reactivate'} "${suspensionTarget.title}" sent to Super Admin for same-time approval!`,
      suspensionAction === 'SUSPEND' ? 'warning' : 'change',
      'Suspension Request Filed'
    );
    setIsSuspensionModalOpen(false);
  };

  const handleResetDefaults = async () => {
    const confirmed = await confirmAction({
      title: 'Reset Pooja Catalog to Defaults?',
      message: 'Are you sure you want to reset the Pooja Catalog to the standard temple default sevas? Any custom offerings or edits will be restored to baseline.',
      confirmText: 'Yes, Restore Defaults',
      variant: 'warning',
    });

    if (!confirmed) return;

    setPoojas(DEFAULT_POOJA_CATALOG);
    savePoojaCatalog(DEFAULT_POOJA_CATALOG);
    showNotification('✓ Temple Pooja Catalog reset to default offerings.', 'warning', 'Catalog Restored');
  };

  // Monthly Release Submission with Specific Seva, Time Window & 3-Hour Gap Checks
  const handleRequestMonthlyRelease = () => {
    setReleaseError(null);

    // 1. Verify specific seva is selected (No 'ALL' option)
    if (!releaseForm.sevaId || releaseForm.sevaId === 'ALL') {
      setReleaseError('Please select a specific individual Seva to release.');
      return;
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const targetMonthName = `${monthNames[releaseForm.targetMonth]} ${releaseForm.targetYear}`;

    // 2. Check 3-Month Prior Window Rule
    const limitCheck = isWithin3MonthsLimit(releaseForm.targetYear, releaseForm.targetMonth);
    if (!limitCheck.valid) {
      setReleaseError(`3-Month Prior Window Limit: You can only request releases up to 3 months in advance (Maximum allowed: ${limitCheck.maxAllowedMonthStr}).`);
      return;
    }

    // 3. Check Sequential Previous Months Rule for that specific seva
    const seqCheck = validateSequentialPreviousMonths(
      releaseForm.targetYear,
      releaseForm.targetMonth,
      releaseForm.sevaId,
      releases
    );
    if (!seqCheck.valid) {
      setReleaseError(`Sequential Month Rule: The previous month (${seqCheck.missingMonthName}) for this seva must be released and approved by Super Admin first before requesting ${targetMonthName}.`);
      return;
    }

    // 4. Validate Release Date
    if (!releaseForm.releaseDate) {
      setReleaseError('Please specify the date when tickets should be released.');
      return;
    }

    // 5. Validate Release Time Window (9:00 AM - 6:30 PM) AND 3-Hour Gap between releases on that date
    const timeCheck = validateReleaseTimeAndGap(
      releaseForm.releaseDate,
      releaseForm.releaseTime,
      releases,
      resubmittingRecord ? resubmittingRecord.id : undefined
    );
    if (!timeCheck.valid) {
      setReleaseError(timeCheck.error || 'Invalid release timing.');
      return;
    }

    const sevaObj = poojas.find((p) => p.id === releaseForm.sevaId);
    const selectedSevaTitle = sevaObj?.title || 'Selected Seva';

    // Handle Re-Submission of existing rejected record
    if (resubmittingRecord) {
      const updated = releases.map((r) =>
        r.id === resubmittingRecord.id
          ? {
              ...r,
              year: releaseForm.targetYear,
              month: releaseForm.targetMonth,
              monthName: targetMonthName,
              releaseDate: releaseForm.releaseDate,
              releaseTime: releaseForm.releaseTime,
              releaseDateTimeISO: `${releaseForm.releaseDate}T${releaseForm.releaseTime}`,
              dailySlotQuota: Number(releaseForm.dailyQuota),
              status: 'PENDING_APPROVAL' as const,
              rejectionReason: undefined,
              resubmittedCount: (r.resubmittedCount || 0) + 1,
              resubmittedAt: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              notes: releaseForm.notes.trim() || r.notes,
            }
          : r
      );
      setReleases(updated);
      saveMonthlyReleases(updated);
      showNotification(`✓ Re-submitted release request for "${selectedSevaTitle}" (${targetMonthName}) to Super Admin for re-approval!`);
      setIsReleaseModalOpen(false);
      setResubmittingRecord(null);
      return;
    }

    // New Request Creation
    const isoString = `${releaseForm.releaseDate}T${releaseForm.releaseTime}`;
    const newReleaseRecord: MonthReleaseRecord = {
      id: `rel-${releaseForm.targetYear}-${String(releaseForm.targetMonth + 1).padStart(2, '0')}-${releaseForm.sevaId}`,
      templeId: 'tpl-vasavi-01',
      templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
      sevaId: releaseForm.sevaId,
      sevaTitle: selectedSevaTitle,
      year: releaseForm.targetYear,
      month: releaseForm.targetMonth,
      monthName: targetMonthName,
      dailySlotQuota: Number(releaseForm.dailyQuota),
      releaseDate: releaseForm.releaseDate,
      releaseTime: releaseForm.releaseTime,
      releaseDateTimeISO: isoString,
      requestedBy: 'Srinivasa Rao (Penugonda Admin)',
      requestedAt: new Date().toLocaleDateString('en-IN'),
      status: 'PENDING_APPROVAL',
      notes: releaseForm.notes.trim(),
    };

    const updated = [newReleaseRecord, ...releases];
    setReleases(updated);
    saveMonthlyReleases(updated);

    showNotification(`✓ Release request for "${selectedSevaTitle}" (${targetMonthName}) submitted! Scheduled for ${releaseForm.releaseDate} at ${releaseForm.releaseTime}. Awaiting Super Admin acceptance.`);
    setIsReleaseModalOpen(false);
  };

  // Block Dates Submission (After 4-Month Requirement)
  const handleSaveBlockedDate = () => {
    setBlockError(null);

    if (!blockForm.startDate || !blockForm.endDate) {
      setBlockError('Please specify both start and end date for the blackout window.');
      return;
    }
    if (!blockForm.reason.trim()) {
      setBlockError('Please provide a reason for blocking tickets (e.g. Grahanam, Renovation).');
      return;
    }

    // 4 to 7 Months Advance Notice Requirement Check (Dates must be between 4 and 7 months from today)
    const windowCheck = isWithin4To7MonthsWindow(blockForm.startDate);
    if (!windowCheck.valid) {
      setBlockError(`4 to 7 Months Advance Notice Rule: Date blackout requests must be scheduled between 4 months and 7 months in advance (Eligible window: ${windowCheck.minAllowedDateStr} to ${windowCheck.maxAllowedDateStr}).`);
      return;
    }

    const sevaObj = poojas.find((p) => p.id === blockForm.sevaId);
    const selectedTitle = blockForm.sevaId === 'ALL' ? 'All Temple Sevas & Poojas' : sevaObj?.title || 'Selected Seva';

    const newBlock: BlockedDateRecord = {
      id: `blk-${Date.now()}`,
      templeId: 'tpl-vasavi-01',
      templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
      sevaId: blockForm.sevaId,
      sevaTitle: selectedTitle,
      startDate: blockForm.startDate,
      startTime: blockForm.startTime,
      endDate: blockForm.endDate,
      endTime: blockForm.endTime,
      reason: blockForm.reason.trim(),
      notes: blockForm.notes.trim(),
      requestType: 'BLOCK',
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toLocaleDateString('en-IN'),
      createdBy: 'Srinivasa Rao (Penugonda Admin)',
    };

    const updated = [newBlock, ...blockedDates];
    setBlockedDates(updated);
    saveBlockedDates(updated);

    showNotification(`✓ Blackout request for "${selectedTitle}" (${blockForm.startDate} to ${blockForm.endDate}) submitted to Super Admin (4-Month Advance Notice Requirement)!`);
    setIsBlockModalOpen(false);
  };

  // Unblock can happen on ANY day with Super Admin permission
  const handleRequestUnblock = (record: BlockedDateRecord) => {
    if (record.status === 'PENDING_APPROVAL' && record.requestType === 'BLOCK') {
      const updated = blockedDates.filter((b) => b.id !== record.id);
      setBlockedDates(updated);
      saveBlockedDates(updated);
      showNotification('✓ Cancelled pending date blackout request.');
      return;
    }

    const updated = blockedDates.map((b) =>
      b.id === record.id
        ? {
            ...b,
            requestType: 'UNBLOCK' as const,
            status: 'PENDING_APPROVAL' as const,
          }
        : b
    );
    setBlockedDates(updated);
    saveBlockedDates(updated);
    showNotification(`✓ Unblock request for "${record.sevaTitle}" submitted to Super Admin for authorization! (Unblocking can be requested on any day).`);
  };

  const handleDeleteBlockedDate = async (id: string) => {
    const target = blockedDates.find((b) => b.id === id);
    const confirmed = await confirmAction({
      title: 'Remove Blackout Request?',
      message: `Are you sure you want to dismiss and delete the blackout request for "${target?.sevaTitle || 'this seva'}"?`,
      confirmText: 'Delete Blackout',
      variant: 'danger',
    });

    if (!confirmed) return;

    const updated = blockedDates.filter((b) => b.id !== id);
    setBlockedDates(updated);
    saveBlockedDates(updated);
    showNotification('✓ Blackout request removed.', 'danger', 'Blackout Deleted');
  };

  const handleDeleteRelease = async (id: string) => {
    const target = releases.find((r) => r.id === id);
    const confirmed = await confirmAction({
      title: 'Delete Release Request Record?',
      message: `Are you sure you want to dismiss and delete this monthly release record for "${target?.sevaTitle || 'this seva'}"?`,
      confirmText: 'Delete Record',
      variant: 'danger',
    });

    if (!confirmed) return;

    const updated = releases.filter((r) => r.id !== id);
    setReleases(updated);
    saveMonthlyReleases(updated);
    showNotification('✓ Removed rejected release request.', 'danger', 'Release Deleted');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans pb-16">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> {t('sidebarPoojaCatalog')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Pooja Catalog, Releases & Blackout Date Controls
          </h1>
          <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
            Manage offerings, scheduled monthly releases (09:00 AM – 06:30 PM) and block dates/sevas up to 4 months in advance.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap bg-stone-900/80 backdrop-blur-sm p-1 rounded-2xl border border-amber-400/40 shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Sevas ({poojas.length})
          </button>
          <button
            onClick={() => setActiveTab('monthly-releases')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'monthly-releases'
                ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Releases ({releases.length})
          </button>
          <button
            onClick={() => setActiveTab('blocked-dates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'blocked-dates'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                : 'text-amber-200/70 hover:text-white'
            }`}
          >
            <Ban className="w-3.5 h-3.5 text-red-400" /> Blocked Dates ({blockedDates.length})
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-400 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: POOJA CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-devotional-saffron" />
                Configured Temple Sevas ({poojas.length})
              </h2>
              <span className="text-xs text-stone-500 font-semibold">
                Sri Vasavi Kanyaka Parameswari Matha, Penugonda
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-gold transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Seva
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poojas.map((pooja) => (
              <div
                key={pooja.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl border-2 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                  pooja.isActive
                    ? 'border-devotional-gold/40 hover:border-amber-400'
                    : 'border-stone-300 dark:border-stone-800 opacity-70 bg-stone-100/50'
                }`}
              >
                <div className={`p-5 bg-gradient-to-r ${pooja.bannerGradient} text-white space-y-2 relative`}>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                      {pooja.deity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        pooja.isActive ? 'bg-emerald-500 text-white' : 'bg-stone-600 text-stone-200'
                      }`}
                    >
                      {pooja.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-amber-200">{pooja.title}</h3>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-amber-200/80 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {pooja.duration}
                    </span>
                    <span className="font-serif font-bold text-2xl text-amber-300">
                      ₹{pooja.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <p className="text-stone-600 dark:text-stone-300 line-clamp-2">{pooja.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Daily Time Slots:</span>
                    <div className="flex flex-wrap gap-1">
                      {pooja.availableSlots.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono text-[10px] font-bold rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pending Modification Indicator */}
                  {(() => {
                    const pendingMod = modifications.find((m) => m.sevaId === pooja.id && m.status === 'PENDING_APPROVAL');
                    if (!pendingMod) return null;
                    return (
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-[10px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                        <span>⏳ {pendingMod.action === 'EDIT' ? 'Edit Request' : 'Deletion Request'} Pending Super Admin Approval</span>
                      </div>
                    );
                  })()}

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center gap-2">
                    <button
                      onClick={() => handleOpenSuspensionModal(pooja, pooja.isActive ? 'SUSPEND' : 'UNSUSPEND')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                        pooja.isActive
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {pooja.isActive ? 'Request Suspend' : 'Request Reactivate'}
                    </button>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(pooja)}
                        className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-stone-800 dark:text-stone-200 font-bold text-[11px] rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeletePooja(pooja.id)}
                        className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 hover:bg-red-600 hover:text-white text-red-700 dark:text-red-300 font-bold text-[11px] rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULED RELEASES */}
      {activeTab === 'monthly-releases' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-devotional-saffron" />
                Scheduled Seva Monthly Ticket Releases
              </h2>
              <p className="text-xs text-stone-500">
                All September 2026 sevas are active & released. Schedule upcoming releases with Super Admin approval.
              </p>
            </div>

            <button
              onClick={() => {
                setReleaseError(null);
                setIsReleaseModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-gold transition-all"
            >
              <Send className="w-4 h-4" /> Request Seva Release
            </button>
          </div>

          {/* Rules Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border-2 border-amber-300 dark:border-amber-800 text-xs space-y-2">
            <span className="font-bold text-devotional-maroon dark:text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-devotional-saffron" /> Seva Ticket Release Rules:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-700 dark:text-stone-300 pl-2">
              <div className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-devotional-saffron shrink-0 mt-0.5" />
                <span><strong>Release Time Window:</strong> Only permitted between <strong>09:00 AM and 06:30 PM</strong>.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>3-Hour Gap:</strong> Every seva release on the same day must have at least a <strong>3-hour difference</strong>.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>3-Month Window:</strong> Sevas can only be released up to <strong>3 months in advance</strong>.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Bell className="w-3.5 h-3.5 text-devotional-saffron shrink-0 mt-0.5" />
                <span><strong>1-Day Prior Devotee Alert:</strong> Devotees automatically receive broadcast alert <strong>1 day prior</strong> to release.</span>
              </div>
            </div>
          </div>

          {/* Release Records List */}
          <div className="space-y-4">
            {releases.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-devotional-gold/40 shadow-xl space-y-4 hover:border-amber-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
                      <span>{r.sevaTitle}</span>
                      <span className="text-xs font-sans text-stone-500 font-bold">• Target: {r.monthName}</span>
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.status === 'APPROVED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                        : r.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 animate-pulse'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300'
                    }`}
                  >
                    {r.status === 'APPROVED'
                      ? '✓ Approved (Scheduled)'
                      : r.status === 'PENDING_APPROVAL'
                      ? '⏳ Awaiting Super Admin Acceptance'
                      : '✕ Rejected by Super Admin'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Scheduled Release</span>
                    <span className="font-bold text-devotional-maroon dark:text-amber-300 text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-devotional-saffron" />
                      {r.releaseDate} at {r.releaseTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Daily Slot Quota</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{r.dailySlotQuota} Slots / Day</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">1-Day Prior Devotee Alert</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                      <Bell className="w-3 h-3" /> Scheduled
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Requested By</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">{r.requestedBy}</span>
                  </div>
                </div>

                {r.notes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 bg-amber-50/50 dark:bg-stone-800/40 p-3 rounded-xl border border-amber-200/50">
                    <strong>Notes:</strong> {r.notes}
                  </p>
                )}

                {r.rejectionReason && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-300 dark:border-red-900 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="text-red-700 dark:text-red-300">
                      <strong>Rejection Feedback:</strong> {r.rejectionReason}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenResubmitModal(r)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold text-xs rounded-xl shadow-gold flex items-center gap-1.5 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit &amp; Re-Submit
                      </button>
                      <button
                        onClick={() => handleDeleteRelease(r.id)}
                        className="px-3.5 py-2 bg-red-100 dark:bg-red-950 hover:bg-red-600 hover:text-white text-red-700 dark:text-red-300 font-bold text-xs rounded-xl border border-red-300 dark:border-red-800 transition-all flex items-center gap-1"
                        title="Delete rejected release request"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BLOCKED DATES & BLACKOUT WINDOWS (4 TO 7 MONTHS WINDOW) */}
      {activeTab === 'blocked-dates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-500" />
                Date Blackouts &amp; Unblock Requests (4 to 7 Months Window)
              </h2>
              <p className="text-xs text-stone-500">
                Request specific date blackout windows from Super Admin between 4 to 7 months in advance. Unblocking can be requested on any day.
              </p>
            </div>

            <button
              onClick={() => {
                setBlockError(null);
                setIsBlockModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all"
            >
              <Ban className="w-4 h-4" /> Request Date Blackout (4 to 7 Months)
            </button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border-2 border-red-300 dark:border-red-900/50 text-xs space-y-1">
            <span className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-500" /> Date Blackout &amp; Unblock Governance Rules:
            </span>
            <p className="text-stone-700 dark:text-stone-300 pl-2">
              • Temple Admins can request date blackouts between <strong>4 months and 7 months</strong> in advance (before tickets are released).<br />
              • Unblock requests can be submitted on <strong>any day / anytime</strong>.<br />
              • All date blackout and unblock actions require <strong>Super Admin Authorization</strong> before becoming active.
            </p>
          </div>

          {blockedDates.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 p-12 text-center rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">No Dates Blocked</h3>
              <p className="text-xs text-stone-500">All released sevas are available without blackouts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedDates.map((b) => (
                <div
                  key={b.id}
                  className={`bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 shadow-xl space-y-4 transition-all ${
                    b.status === 'PENDING_APPROVAL'
                      ? 'border-amber-400 ring-1 ring-amber-400/30'
                      : b.status === 'APPROVED'
                      ? 'border-red-300/60 dark:border-red-900/60 hover:border-red-400'
                      : 'border-stone-300 dark:border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                            b.status === 'APPROVED'
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300'
                              : b.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 animate-pulse'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300'
                          }`}
                        >
                          {b.status === 'APPROVED'
                            ? '🚫 Active Blackout'
                            : b.status === 'PENDING_APPROVAL'
                            ? `⏳ Pending Super Admin (${b.requestType === 'UNBLOCK' ? 'Unblock' : 'Block'})`
                            : '✕ Rejected'}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-devotional-maroon dark:text-amber-400">
                          {b.sevaTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-semibold">
                        Reason: {b.reason}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleRequestUnblock(b)}
                          className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Request Unblock
                        </button>
                      ) : b.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleRequestUnblock(b)}
                          className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-red-600 hover:text-white text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel Request
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setBlockForm({
                                sevaId: b.sevaId,
                                startDate: b.startDate,
                                startTime: b.startTime,
                                endDate: b.endDate,
                                endTime: b.endTime,
                                reason: b.reason,
                                notes: b.notes || '',
                              });
                              setIsBlockModalOpen(true);
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" /> Re-Request Blackout
                          </button>
                          <button
                            onClick={() => handleDeleteBlockedDate(b.id)}
                            className="px-3.5 py-2 bg-red-100 dark:bg-red-950 hover:bg-red-600 hover:text-white text-red-700 dark:text-red-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-red-300 dark:border-red-800"
                            title="Delete / Dismiss rejected request"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Blackout Date Range</span>
                      <span className="font-bold text-red-600 text-xs">
                        {b.startDate} to {b.endDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Time Window</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200 text-xs">
                        {b.startTime} – {b.endTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Requested By</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200 text-xs">
                        {b.createdBy}
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 bg-red-50/50 dark:bg-stone-800/40 p-3 rounded-xl border border-red-200/50">
                      <strong>Notes:</strong> {b.notes}
                    </p>
                  )}

                  {b.rejectionReason && (
                    <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                      <strong>Super Admin Rejection Feedback:</strong> {b.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BLOCK DATES MODAL (4-MONTH LIMIT) */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-6 border-2 border-red-400 relative">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Ban className="w-5 h-5" /> Request Date Blackout (4 to 7 Months Advance Window)
                </h3>
                <p className="text-xs text-stone-500">
                  Must be scheduled between 4 months and 7 months in advance. Unblocking can be requested on any day with Super Admin permission.
                </p>
              </div>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {blockError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/70 border-2 border-red-400 rounded-2xl text-xs font-bold text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{blockError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Select Seva to Block *
                </label>
                <select
                  value={blockForm.sevaId}
                  onChange={(e) => setBlockForm({ ...blockForm, sevaId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-red-400"
                >
                  <option value="ALL">All Temple Sevas & Poojas (Entire Temple Blackout)</option>
                  {poojas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Blackout Start Date (4 to 7 Months Window) *
                  </label>
                  <input
                    type="date"
                    min={minBlockDateISO}
                    max={maxBlockDateISO}
                    value={blockForm.startDate}
                    onChange={(e) => setBlockForm({ ...blockForm, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-red-400"
                  />
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                    Allowed range: {minBlockDateISO} to {maxBlockDateISO}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Start Time
                  </label>
                  <select
                    value={blockForm.startTime}
                    onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-red-400"
                  >
                    <option value="04:00 AM">04:00 AM (Early Dawn)</option>
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Blackout End Date *
                  </label>
                  <input
                    type="date"
                    min={blockForm.startDate || minBlockDateISO}
                    max={maxBlockDateISO}
                    value={blockForm.endDate}
                    onChange={(e) => setBlockForm({ ...blockForm, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    End Time
                  </label>
                  <select
                    value={blockForm.endTime}
                    onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-red-400"
                  >
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:30 PM">09:30 PM</option>
                    <option value="11:59 PM">11:59 PM (Midnight)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Reason / Devotee Notice *
                </label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g. Surya Grahanam (Solar Eclipse) - Sanctum Closed for Samprokshanam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={blockForm.notes}
                  onChange={(e) => setBlockForm({ ...blockForm, notes: e.target.value })}
                  placeholder="Temple trust or priest instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlockedDate}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" /> Confirm Date Blackout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST SEVA RELEASE MODAL WITH CLEAN 12-MONTH CARD SELECTOR (REDUNDANT DROPDOWN REMOVED) */}
      {isReleaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-6 border-2 border-devotional-gold relative">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
                  Request Specific Seva Monthly Release
                </h3>
                <p className="text-xs text-stone-500">
                  Select Seva, release timing (09:00 AM – 06:30 PM with 3-hr gap) & target month
                </p>
              </div>
              <button
                onClick={() => setIsReleaseModalOpen(false)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {releaseError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/70 border-2 border-red-400 rounded-2xl text-xs font-bold text-red-700 dark:text-red-300 flex items-start gap-2 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{releaseError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Specific Seva Selector */}
              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Select Specific Seva / Pooja to Release *
                </label>
                <select
                  value={releaseForm.sevaId}
                  onChange={(e) => {
                    const newSevaId = e.target.value;
                    const statuses = getRolling12MonthsStatus(newSevaId, releases);
                    const firstAvailable = statuses.find((s) => s.isSelectable);
                    setReleaseForm({
                      ...releaseForm,
                      sevaId: newSevaId,
                      ...(firstAvailable ? { targetMonth: firstAvailable.month, targetYear: firstAvailable.year } : {}),
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-amber-400"
                >
                  {poojas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-500">Individual specific seva release quota</p>
              </div>

              {/* Target Month Visual 12-Month Card Grid ONLY */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block font-bold text-devotional-maroon dark:text-amber-400 uppercase text-[10px]">
                    Target Seva Month (Select from 12-Month Progression) *
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Next 3 Months Operable
                  </span>
                </div>

                {/* 12-Month Visual Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-2 bg-stone-100 dark:bg-stone-950 rounded-2xl border border-stone-300 dark:border-stone-800">
                  {getRolling12MonthsStatus(releaseForm.sevaId, releases).map((m) => {
                    const isSelected = releaseForm.targetMonth === m.month && releaseForm.targetYear === m.year;
                    const isAvailable = m.status === 'AVAILABLE';
                    const isReleased = m.status === 'ALREADY_RELEASED';
                    const isPending = m.status === 'PENDING_APPROVAL';
                    const isBeyond = m.status === 'BEYOND_3_MONTHS';

                    return (
                      <button
                        type="button"
                        key={`${m.year}-${m.month}`}
                        disabled={!m.isSelectable}
                        onClick={() => {
                          if (m.isSelectable) {
                            setReleaseForm({
                              ...releaseForm,
                              targetMonth: m.month,
                              targetYear: m.year,
                            });
                          }
                        }}
                        title={
                          isReleased
                            ? 'Already released and approved for this seva'
                            : isPending
                            ? 'Request already submitted and pending Super Admin approval'
                            : isBeyond
                            ? 'Advance release limit: Only next 3 months operable'
                            : 'Click to select this month for booking release'
                        }
                        className={`p-2.5 rounded-xl text-left transition-all relative flex flex-col justify-between border text-xs ${
                          isSelected
                            ? 'bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-[1.02]'
                            : isReleased
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-stone-400 filter blur-[0.4px] opacity-45 cursor-not-allowed'
                            : isPending
                            ? 'bg-amber-950/20 border-amber-500/30 text-stone-400 filter blur-[0.4px] opacity-50 cursor-not-allowed'
                            : isBeyond
                            ? 'bg-stone-900/40 border-stone-800/80 text-stone-500 opacity-35 cursor-not-allowed'
                            : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700 hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`font-bold text-xs ${isSelected ? 'text-amber-200' : isAvailable ? 'text-devotional-maroon dark:text-amber-400' : ''}`}>
                            {m.monthName}
                          </span>
                          {isBeyond && <Lock className="w-3 h-3 text-stone-500 shrink-0 mt-0.5" />}
                        </div>

                        <span
                          className={`text-[9px] font-bold mt-1.5 px-1.5 py-0.5 rounded leading-tight inline-block ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950'
                              : isReleased
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : isBeyond
                              ? 'bg-stone-800 text-stone-500'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {m.statusBadge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Release Date and Release Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/60 dark:bg-stone-950 p-4 rounded-2xl border border-amber-300 dark:border-amber-800">
                <div className="space-y-1">
                  <label className="block font-bold text-devotional-maroon dark:text-amber-400 uppercase text-[10px]">
                    Ticket Release Date *
                  </label>
                  <input
                    type="date"
                    value={releaseForm.releaseDate}
                    onChange={(e) => setReleaseForm({ ...releaseForm, releaseDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-devotional-maroon dark:text-amber-400 uppercase text-[10px]">
                    Release Time (09:00 AM – 06:30 PM) *
                  </label>
                  <select
                    value={releaseForm.releaseTime}
                    onChange={(e) => setReleaseForm({ ...releaseForm, releaseTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="09:00 AM">09:00 AM (Morning Slot)</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="01:00 PM">01:00 PM (Afternoon Slot)</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:30 PM">06:30 PM (Evening Limit)</option>
                  </select>
                </div>
                <p className="col-span-full text-[10px] text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> Note: A 3-hour minimum time gap will be validated against other seva releases on this date.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Daily Devotee Booking Quota (Slots/Day) *
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={releaseForm.dailyQuota}
                  onChange={(e) => setReleaseForm({ ...releaseForm, dailyQuota: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Rationale / Special Occasion Notes for Super Admin *
                </label>
                <textarea
                  rows={2}
                  value={releaseForm.notes}
                  onChange={(e) => setReleaseForm({ ...releaseForm, notes: e.target.value })}
                  placeholder="e.g. Navaratri festival special daily seva slots and Annadanam bookings..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setIsReleaseModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestMonthlyRelease}
                className="px-6 py-2.5 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-serif font-bold text-xs rounded-xl hover:brightness-110 shadow-md border border-amber-400/40 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit to Super Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT POOJA MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-6 border-2 border-devotional-gold max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-devotional-maroon dark:text-amber-400">
                  {editingPooja ? 'Edit Pooja / Seva' : 'Add New Temple Pooja / Seva'}
                </h3>
                <p className="text-xs text-stone-500">
                  Configure offerings with 2-month devotee booking calendar & slot controls
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-400 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Seva / Pooja Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sri Vasavi Chandi Homam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Deity / Sanctum *
                  </label>
                  <input
                    type="text"
                    value={formData.deity}
                    onChange={(e) => setFormData({ ...formData, deity: e.target.value })}
                    placeholder="e.g. Goddess Sri Vasavi Kanyaka Parameswari"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Description & Spiritual Significance *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain ritual details, sacred mantras chanted, and spiritual benefits..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Offering Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="1001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                    Approx Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 45 mins, 60 mins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Available Time Slots (comma-separated) *
                </label>
                <input
                  type="text"
                  value={formData.availableSlots}
                  onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                  placeholder="08:00 AM, 10:30 AM, 05:30 PM, 07:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Benefits / Inclusions (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="Family Health, Blessed Kumkumarchana Prasadam, Ammavari Raksha"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1 pt-2">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Banner Color Theme
                </label>
                <select
                  value={formData.bannerGradient}
                  onChange={(e) => setFormData({ ...formData, bannerGradient: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-amber-400"
                >
                  <option value="from-amber-700 via-devotional-maroon to-stone-950">Deep Saffron &amp; Maroon (Classic)</option>
                  <option value="from-devotional-maroon-dark via-amber-950 to-stone-950">Royal Temple Crimson</option>
                  <option value="from-amber-800 via-devotional-saffron to-stone-950">Bright Golden Saffron</option>
                  <option value="from-stone-900 via-devotional-maroon to-stone-950">Midnight &amp; Maroon</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePooja}
                className="px-6 py-2.5 bg-gradient-to-r from-devotional-maroon to-devotional-maroon-dark text-amber-300 font-serif font-bold text-xs rounded-xl hover:brightness-110 shadow-md border border-amber-400/40"
              >
                {editingPooja ? 'Save Changes' : 'Create & Publish Seva'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* SEVA SUSPENSION / REACTIVATION MODAL (SAME-TIME SUPER ADMIN REQUEST) */}
      {isSuspensionModalOpen && suspensionTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-6 border-2 border-amber-400 relative">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Power className="w-5 h-5" /> Request Seva {suspensionAction === 'SUSPEND' ? 'Suspension' : 'Reactivation'}
                </h3>
                <p className="text-xs text-stone-500">
                  Immediate operational request sent to Super Admin for same-time review &amp; approval.
                </p>
              </div>
              <button
                onClick={() => setIsSuspensionModalOpen(false)}
                className="p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                Target Seva: {suspensionTarget.title}
              </span>
              <p className="text-stone-700 dark:text-stone-300">
                Action: <strong>{suspensionAction === 'SUSPEND' ? '⛔ Suspend (Hide from Bookings)' : '✅ Reactivate (Open Bookings)'}</strong>
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                ℹ️ Same-time request is sufficient. Once Super Admin grants permission, the seva status is updated immediately.
              </p>
            </div>

            {suspensionError && (
              <div className="p-3 bg-red-100 dark:bg-red-950/80 border border-red-400 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{suspensionError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Operational Reason / Rationale *
                </label>
                <textarea
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="e.g. Chief priest unavailable due to Vedic yagnam, or Sanctum electrical maintenance..."
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase text-[10px]">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  value={suspensionNotes}
                  onChange={(e) => setSuspensionNotes(e.target.value)}
                  placeholder="e.g. Expected duration: 2 days"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setIsSuspensionModalOpen(false)}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSuspension}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Submit Request to Super Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
