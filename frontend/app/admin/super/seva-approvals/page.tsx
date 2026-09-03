'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  Sparkles,
  AlertCircle,
  FileText,
  User,
  Filter,
  Edit,
  Bell,
  Send,
  Timer,
  X,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import {
  MonthReleaseRecord,
  getMonthlyReleases,
  saveMonthlyReleases,
  validateReleaseTimeAndGap,
  dispatchDevotee1DayPriorNotification,
  dispatchTempleAdminNotification,
  BlockedDateRecord,
  getBlockedDates,
  saveBlockedDates,
  SevaSuspensionRecord,
  getSevaSuspensions,
  saveSevaSuspensions,
  SevaModificationRecord,
  getSevaModifications,
  saveSevaModifications,
} from '@/lib/quota-store';
import { PoojaItem, getPoojaCatalog, savePoojaCatalog } from '@/lib/pooja-store';

export default function SuperAdminSevaApprovalsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'releases' | 'blocks' | 'suspensions' | 'modifications'>('releases');

  // Releases State
  const [releases, setReleases] = useState<MonthReleaseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSevaFilter, setSelectedSevaFilter] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Blocked Dates State
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>([]);
  const [rejectingBlock, setRejectingBlock] = useState<BlockedDateRecord | null>(null);
  const [blockRejectReason, setBlockRejectReason] = useState('');

  // Suspensions State
  const [suspensions, setSuspensions] = useState<SevaSuspensionRecord[]>([]);
  const [rejectingSuspension, setRejectingSuspension] = useState<SevaSuspensionRecord | null>(null);
  const [suspensionRejectReason, setSuspensionRejectReason] = useState('');

  // Seva Catalog Modifications State (Edit / Delete / Create Requests)
  const [modifications, setModifications] = useState<SevaModificationRecord[]>([]);
  const [rejectingModification, setRejectingModification] = useState<SevaModificationRecord | null>(null);
  const [modificationRejectReason, setModificationRejectReason] = useState('');
  const [editingModRecord, setEditingModRecord] = useState<SevaModificationRecord | null>(null);
  const [editModForm, setEditModForm] = useState({
    title: '',
    deity: '',
    price: 501,
    duration: '45 mins',
    availableSlots: '08:00 AM, 10:30 AM, 05:30 PM',
    benefits: '',
    description: '',
  });
  const [editModError, setEditModError] = useState<string | null>(null);

  // Edit Blocked Date State
  const [editingBlockRecord, setEditingBlockRecord] = useState<BlockedDateRecord | null>(null);
  const [editBlockForm, setEditBlockForm] = useState({
    startDate: '',
    startTime: '04:00 AM',
    endDate: '',
    endTime: '08:00 PM',
    reason: '',
    notes: '',
  });
  const [editBlockError, setEditBlockError] = useState<string | null>(null);

  // Edit / Reschedule Modal State for Releases
  const [editingRecord, setEditingRecord] = useState<MonthReleaseRecord | null>(null);
  const [editReleaseDate, setEditReleaseDate] = useState('');
  const [editReleaseTime, setEditReleaseTime] = useState('10:00 AM');
  const [editDailyQuota, setEditDailyQuota] = useState(50);
  const [editError, setEditError] = useState<string | null>(null);

  // Reject Modal State for Releases
  const [rejectingRecord, setRejectingRecord] = useState<MonthReleaseRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadData = () => {
    setReleases(getMonthlyReleases());
    setBlockedDates(getBlockedDates());
    setSuspensions(getSevaSuspensions());
    setModifications(getSevaModifications());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('seva_releases_updated', loadData);
    window.addEventListener('blocked_dates_updated', loadData);
    window.addEventListener('seva_suspensions_updated', loadData);
    window.addEventListener('seva_modifications_updated', loadData);
    return () => {
      window.removeEventListener('seva_releases_updated', loadData);
      window.removeEventListener('blocked_dates_updated', loadData);
      window.removeEventListener('seva_suspensions_updated', loadData);
      window.removeEventListener('seva_modifications_updated', loadData);
    };
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Extract all unique sevas across catalog and historical records
  const allSevaOptions = React.useMemo(() => {
    const map = new Map<string, string>();
    const catalog = getPoojaCatalog();
    catalog.forEach((p) => map.set(p.id, p.title));
    releases.forEach((r) => map.set(r.sevaId, r.sevaTitle));
    blockedDates.forEach((b) => {
      if (b.sevaId !== 'ALL') map.set(b.sevaId, b.sevaTitle);
    });
    suspensions.forEach((s) => map.set(s.sevaId, s.sevaTitle));
    modifications.forEach((m) => map.set(m.sevaId, m.sevaTitle));
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [releases, blockedDates, suspensions, modifications]);

  // Filtered Monthly Releases
  const filteredReleases = releases.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (selectedSevaFilter !== 'ALL') {
      if (selectedSevaFilter === 'ALL_TEMPLE') return false;
      if (r.sevaId !== selectedSevaFilter && r.sevaTitle !== selectedSevaFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.sevaTitle.toLowerCase().includes(q) ||
        r.monthName.toLowerCase().includes(q) ||
        r.releaseDate.toLowerCase().includes(q) ||
        r.releaseTime.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        (r.rejectionReason && r.rejectionReason.toLowerCase().includes(q)) ||
        r.requestedBy.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Blocked Dates
  const filteredBlockedDates = blockedDates.filter((b) => {
    if (filterStatus !== 'ALL' && b.status !== filterStatus) return false;
    if (selectedSevaFilter !== 'ALL') {
      if (selectedSevaFilter === 'ALL_TEMPLE') {
        if (b.sevaId !== 'ALL') return false;
      } else if (b.sevaId !== selectedSevaFilter && b.sevaTitle !== selectedSevaFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.sevaTitle.toLowerCase().includes(q) ||
        b.reason.toLowerCase().includes(q) ||
        b.startDate.toLowerCase().includes(q) ||
        b.endDate.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q)) ||
        (b.rejectionReason && b.rejectionReason.toLowerCase().includes(q)) ||
        b.createdBy.toLowerCase().includes(q) ||
        b.requestType.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Suspensions
  const filteredSuspensions = suspensions.filter((s) => {
    if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
    if (selectedSevaFilter !== 'ALL') {
      if (selectedSevaFilter === 'ALL_TEMPLE') return false;
      if (s.sevaId !== selectedSevaFilter && s.sevaTitle !== selectedSevaFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.sevaTitle.toLowerCase().includes(q) ||
        s.reason.toLowerCase().includes(q) ||
        s.action.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q)) ||
        (s.rejectionReason && s.rejectionReason.toLowerCase().includes(q)) ||
        s.requestedBy.toLowerCase().includes(q) ||
        s.requestedAt.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Modifications (Edits / Deletions / Creations)
  const filteredModifications = modifications.filter((m) => {
    if (filterStatus !== 'ALL' && m.status !== filterStatus) return false;
    if (selectedSevaFilter !== 'ALL') {
      if (selectedSevaFilter === 'ALL_TEMPLE') return false;
      if (m.sevaId !== selectedSevaFilter && m.sevaTitle !== selectedSevaFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        m.sevaTitle.toLowerCase().includes(q) ||
        m.action.toLowerCase().includes(q) ||
        (m.reason && m.reason.toLowerCase().includes(q)) ||
        (m.notes && m.notes.toLowerCase().includes(q)) ||
        (m.rejectionReason && m.rejectionReason.toLowerCase().includes(q)) ||
        m.requestedBy.toLowerCase().includes(q) ||
        m.requestedAt.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const pendingReleasesCount = releases.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const pendingBlocksCount = blockedDates.filter((b) => b.status === 'PENDING_APPROVAL').length;
  const pendingSuspensionsCount = suspensions.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const pendingModificationsCount = modifications.filter((m) => m.status === 'PENDING_APPROVAL').length;
  const totalPending = pendingReleasesCount + pendingBlocksCount + pendingSuspensionsCount + pendingModificationsCount;

  // 1. MONTHLY RELEASE APPROVAL / REJECTION
  const handleApprove = (record: MonthReleaseRecord) => {
    const updated = releases.map((r) =>
      r.id === record.id
        ? {
            ...r,
            status: 'APPROVED' as const,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
            notes: 'Approved and scheduled by Super Admin.',
            devoteeNotificationSent: true,
            devoteeNotificationDate: `${record.releaseDate} (1 day prior alert active)`,
          }
        : r
    );
    setReleases(updated);
    saveMonthlyReleases(updated);

    // Dispatch 1-day prior notification broadcast to all devotees
    dispatchDevotee1DayPriorNotification(record);

    // Notify Temple Admin
    dispatchTempleAdminNotification({
      type: 'APPROVAL',
      title: `✓ Super Admin Approved Seva Release: ${record.sevaTitle}`,
      message: `Super Admin has approved the monthly release for "${record.sevaTitle}" (${record.monthName}). Tickets will release on ${record.releaseDate} at ${record.releaseTime}.`,
      sevaId: record.sevaId,
      sevaTitle: record.sevaTitle,
      releaseRecordId: record.id,
      monthName: record.monthName,
    });

    showToast(`✓ Approved! "${record.sevaTitle}" will release on ${record.releaseDate} at ${record.releaseTime}. Temple Admin notified & 1-day prior alert scheduled!`);
  };

  const handleOpenEditModal = (record: MonthReleaseRecord) => {
    setEditingRecord(record);
    setEditReleaseDate(record.releaseDate);
    setEditReleaseTime(record.releaseTime);
    setEditDailyQuota(record.dailySlotQuota);
    setEditError(null);
  };

  const handleSaveReschedule = () => {
    if (!editingRecord) return;
    setEditError(null);

    const check = validateReleaseTimeAndGap(
      editReleaseDate,
      editReleaseTime,
      releases,
      editingRecord.id
    );

    if (!check.valid) {
      setEditError(check.error || 'Invalid release timing.');
      return;
    }

    const isoString = `${editReleaseDate}T${editReleaseTime}`;
    const updated = releases.map((r) =>
      r.id === editingRecord.id
        ? {
            ...r,
            releaseDate: editReleaseDate,
            releaseTime: editReleaseTime,
            releaseDateTimeISO: isoString,
            dailySlotQuota: Number(editDailyQuota),
            notes: `${r.notes || ''} [Rescheduled by Super Admin to ${editReleaseDate} ${editReleaseTime}]`.trim(),
          }
        : r
    );

    setReleases(updated);
    saveMonthlyReleases(updated);

    if (editingRecord.status === 'APPROVED') {
      const updatedRecord = updated.find((r) => r.id === editingRecord.id);
      if (updatedRecord) dispatchDevotee1DayPriorNotification(updatedRecord);
    }

    dispatchTempleAdminNotification({
      type: 'APPROVAL',
      title: `✓ Super Admin Rescheduled Release: ${editingRecord.sevaTitle}`,
      message: `Super Admin adjusted release date & time for "${editingRecord.sevaTitle}" (${editingRecord.monthName}) to ${editReleaseDate} at ${editReleaseTime}.`,
      sevaId: editingRecord.sevaId,
      sevaTitle: editingRecord.sevaTitle,
      releaseRecordId: editingRecord.id,
      monthName: editingRecord.monthName,
    });

    showToast(`✓ Rescheduled release for "${editingRecord.sevaTitle}" to ${editReleaseDate} at ${editReleaseTime}. Temple Admin notified.`);
    setEditingRecord(null);
  };

  const handleConfirmReject = () => {
    if (!rejectingRecord) return;
    const finalReason = rejectionReason.trim() || 'Schedule conflict or quota adjustment required.';
    const updated = releases.map((r) =>
      r.id === rejectingRecord.id
        ? {
            ...r,
            status: 'REJECTED' as const,
            rejectionReason: finalReason,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : r
    );
    setReleases(updated);
    saveMonthlyReleases(updated);

    dispatchTempleAdminNotification({
      type: 'REJECTION',
      title: `⚠️ Super Admin Rejected Release: ${rejectingRecord.sevaTitle}`,
      message: `Super Admin rejected release request for "${rejectingRecord.sevaTitle}" (${rejectingRecord.monthName}). Reason: "${finalReason}". You can edit and re-submit.`,
      sevaId: rejectingRecord.sevaId,
      sevaTitle: rejectingRecord.sevaTitle,
      releaseRecordId: rejectingRecord.id,
      monthName: rejectingRecord.monthName,
      reason: finalReason,
    });

    showToast(`Rejected release request for "${rejectingRecord.sevaTitle}". Temple Admin has been notified.`);
    setRejectingRecord(null);
    setRejectionReason('');
  };

  // 2. BLOCK / UNBLOCK APPROVAL / REJECTION
  const handleApproveBlock = (record: BlockedDateRecord) => {
    let updated: BlockedDateRecord[];
    if (record.requestType === 'UNBLOCK') {
      // Unblock: remove the blocked record
      updated = blockedDates.filter((b) => b.id !== record.id);
    } else {
      // Block: mark as approved
      updated = blockedDates.map((b) =>
        b.id === record.id
          ? {
              ...b,
              status: 'APPROVED' as const,
              approvedBy: 'Ramesh Sharma (Super Admin)',
              approvedAt: new Date().toLocaleDateString('en-IN'),
            }
          : b
      );
    }
    setBlockedDates(updated);
    saveBlockedDates(updated);

    const actionText = record.requestType === 'UNBLOCK' ? 'Unblock' : 'Date Blackout';
    dispatchTempleAdminNotification({
      type: 'BLOCK_DECISION',
      title: `✓ Super Admin Granted ${actionText} Request`,
      message: `Super Admin approved your ${actionText} request for "${record.sevaTitle}" (${record.startDate} to ${record.endDate}). Effective immediately.`,
      sevaId: record.sevaId,
      sevaTitle: record.sevaTitle,
    });

    showToast(`✓ Granted ${actionText} for "${record.sevaTitle}". Changes are active immediately!`);
  };

  const handleConfirmRejectBlock = () => {
    if (!rejectingBlock) return;
    const finalReason = blockRejectReason.trim() || 'Date blackout conflict with temple calendar schedule.';
    const updated = blockedDates.map((b) =>
      b.id === rejectingBlock.id
        ? {
            ...b,
            status: 'REJECTED' as const,
            rejectionReason: finalReason,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : b
    );
    setBlockedDates(updated);
    saveBlockedDates(updated);

    dispatchTempleAdminNotification({
      type: 'REJECTION',
      title: `⚠️ Super Admin Rejected Date Blackout Request`,
      message: `Super Admin rejected blackout request for "${rejectingBlock.sevaTitle}" (${rejectingBlock.startDate} to ${rejectingBlock.endDate}). Reason: "${finalReason}".`,
      sevaId: rejectingBlock.sevaId,
      sevaTitle: rejectingBlock.sevaTitle,
      reason: finalReason,
    });

    showToast(`Rejected blackout request for "${rejectingBlock.sevaTitle}". Temple Admin has been notified.`);
    setRejectingBlock(null);
    setBlockRejectReason('');
  };

  // 3. IMMEDIATE SEVA SUSPENSION / REACTIVATION
  const handleApproveSuspension = (record: SevaSuspensionRecord) => {
    const updatedSusp = suspensions.map((s) =>
      s.id === record.id
        ? {
            ...s,
            status: 'APPROVED' as const,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : s
    );
    setSuspensions(updatedSusp);
    saveSevaSuspensions(updatedSusp);

    // Update catalog immediately
    const catalog = getPoojaCatalog();
    const updatedCatalog = catalog.map((p) =>
      p.id === record.sevaId
        ? { ...p, isActive: record.action !== 'SUSPEND' }
        : p
    );
    savePoojaCatalog(updatedCatalog);

    const actionText = record.action === 'SUSPEND' ? 'Suspension' : 'Reactivation';
    dispatchTempleAdminNotification({
      type: 'SUSPEND_DECISION',
      title: `✓ Super Admin Approved Seva ${actionText}: ${record.sevaTitle}`,
      message: `Super Admin approved the ${actionText.toLowerCase()} of "${record.sevaTitle}". Seva status updated immediately in devotee catalog.`,
      sevaId: record.sevaId,
      sevaTitle: record.sevaTitle,
    });

    showToast(`✓ Approved ${actionText} for "${record.sevaTitle}". Seva status updated immediately!`);
  };

  const handleConfirmRejectSuspension = () => {
    if (!rejectingSuspension) return;
    const finalReason = suspensionRejectReason.trim() || 'Suspension rationale insufficient for current operational requirements.';
    const updated = suspensions.map((s) =>
      s.id === rejectingSuspension.id
        ? {
            ...s,
            status: 'REJECTED' as const,
            rejectionReason: finalReason,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : s
    );
    setSuspensions(updated);
    saveSevaSuspensions(updated);

    dispatchTempleAdminNotification({
      type: 'REJECTION',
      title: `⚠️ Super Admin Rejected Seva ${rejectingSuspension.action === 'SUSPEND' ? 'Suspension' : 'Reactivation'}`,
      message: `Super Admin rejected request to ${rejectingSuspension.action.toLowerCase()} "${rejectingSuspension.sevaTitle}". Reason: "${finalReason}".`,
      sevaId: rejectingSuspension.sevaId,
      sevaTitle: rejectingSuspension.sevaTitle,
      reason: finalReason,
    });

    showToast(`Rejected request for "${rejectingSuspension.sevaTitle}". Temple Admin has been notified.`);
    setRejectingSuspension(null);
    setSuspensionRejectReason('');
  };

  // 4. SEVA CATALOG MODIFICATIONS APPROVAL / REJECTION (Edit, Delete, Create)
  const handleApproveModification = (record: SevaModificationRecord) => {
    const catalog = getPoojaCatalog();
    if (record.action === 'EDIT' && record.proposedData) {
      const updatedCatalog = catalog.map((p) =>
        p.id === record.sevaId
          ? {
              ...p,
              ...record.proposedData,
            }
          : p
      );
      savePoojaCatalog(updatedCatalog);
    } else if (record.action === 'DELETE') {
      const updatedCatalog = catalog.filter((p) => p.id !== record.sevaId);
      savePoojaCatalog(updatedCatalog);
    } else if (record.action === 'CREATE' && record.proposedData) {
      const newPooja: PoojaItem = {
        id: record.sevaId || `pooja-${Date.now()}`,
        title: record.proposedData.title || 'New Seva',
        deity: record.proposedData.deity || 'Sri Vasavi Kanyaka Parameswari Ammavaru',
        description: record.proposedData.description || '',
        price: record.proposedData.price || 501,
        duration: record.proposedData.duration || '45 mins',
        availableSlots: record.proposedData.availableSlots || ['08:00 AM'],
        bannerGradient: record.proposedData.bannerGradient || 'from-amber-700 via-devotional-maroon to-stone-950',
        benefits: record.proposedData.benefits || [],
        isActive: true,
        templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
        createdAt: new Date().toLocaleDateString('en-IN'),
      };
      savePoojaCatalog([newPooja, ...catalog]);
    }

    const updated = modifications.map((m) =>
      m.id === record.id
        ? {
            ...m,
            status: 'APPROVED' as const,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : m
    );
    setModifications(updated);
    saveSevaModifications(updated);

    const actionText = record.action === 'DELETE' ? 'Deletion' : record.action === 'CREATE' ? 'Creation' : 'Modification';
    dispatchTempleAdminNotification({
      type: 'APPROVAL',
      title: `✓ Super Admin Approved Seva ${actionText}: ${record.sevaTitle}`,
      message: `Super Admin authorized the ${actionText.toLowerCase()} of "${record.sevaTitle}". Catalog has been updated accordingly.`,
      sevaId: record.sevaId,
      sevaTitle: record.sevaTitle,
    });

    showToast(`✓ Approved ${actionText} for "${record.sevaTitle}". Catalog updated!`);
  };

  const handleConfirmRejectModification = () => {
    if (!rejectingModification) return;
    const finalReason = modificationRejectReason.trim() || 'Modification request does not meet current temple regulatory requirements.';
    const updated = modifications.map((m) =>
      m.id === rejectingModification.id
        ? {
            ...m,
            status: 'REJECTED' as const,
            rejectionReason: finalReason,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : m
    );
    setModifications(updated);
    saveSevaModifications(updated);

    const actionText = rejectingModification.action === 'DELETE' ? 'Deletion' : rejectingModification.action === 'CREATE' ? 'Creation' : 'Modification';
    dispatchTempleAdminNotification({
      type: 'REJECTION',
      title: `⚠️ Super Admin Rejected Seva ${actionText}: ${rejectingModification.sevaTitle}`,
      message: `Super Admin rejected the ${actionText.toLowerCase()} request for "${rejectingModification.sevaTitle}". Reason: "${finalReason}".`,
      sevaId: rejectingModification.sevaId,
      sevaTitle: rejectingModification.sevaTitle,
      reason: finalReason,
    });

    showToast(`Rejected ${actionText.toLowerCase()} request for "${rejectingModification.sevaTitle}".`);
    setRejectingModification(null);
    setModificationRejectReason('');
  };

  // Super Admin Edit Seva Specifications (Tab 4)
  const handleOpenEditModModal = (record: SevaModificationRecord) => {
    setEditingModRecord(record);
    const data = record.proposedData || record.originalData;
    setEditModForm({
      title: data?.title || record.sevaTitle || '',
      deity: data?.deity || 'Sri Vasavi Kanyaka Parameswari Ammavaru',
      price: data?.price || 501,
      duration: data?.duration || '45 mins',
      availableSlots: (data?.availableSlots || ['08:00 AM', '10:30 AM', '05:30 PM']).join(', '),
      benefits: (data?.benefits || []).join(', '),
      description: data?.description || '',
    });
    setEditModError(null);
  };

  const handleSaveAndApproveMod = (approveImmediately: boolean = true) => {
    if (!editingModRecord) return;
    setEditModError(null);

    if (!editModForm.title.trim()) {
      setEditModError('Seva Title is required.');
      return;
    }
    if (Number(editModForm.price) <= 0) {
      setEditModError('Please enter a valid price greater than 0.');
      return;
    }

    const slotsArray = editModForm.availableSlots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefitsArray = editModForm.benefits
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    const proposedData = {
      title: editModForm.title.trim(),
      deity: editModForm.deity.trim(),
      description: editModForm.description.trim(),
      price: Number(editModForm.price),
      duration: editModForm.duration.trim() || '45 mins',
      availableSlots: slotsArray.length > 0 ? slotsArray : ['08:00 AM'],
      benefits: benefitsArray,
      bannerGradient: editingModRecord.proposedData?.bannerGradient || 'from-amber-700 via-devotional-maroon to-stone-950',
      isActive: true,
    };

    if (approveImmediately) {
      const catalog = getPoojaCatalog();
      if (editingModRecord.action === 'CREATE') {
        const newPooja: PoojaItem = {
          id: editingModRecord.sevaId || `pooja-${Date.now()}`,
          ...proposedData,
          templeName: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
          createdAt: new Date().toLocaleDateString('en-IN'),
        };
        savePoojaCatalog([newPooja, ...catalog]);
      } else {
        const updatedCatalog = catalog.map((p) =>
          p.id === editingModRecord.sevaId ? { ...p, ...proposedData } : p
        );
        savePoojaCatalog(updatedCatalog);
      }

      const updated = modifications.map((m) =>
        m.id === editingModRecord.id
          ? {
              ...m,
              sevaTitle: proposedData.title,
              proposedData,
              status: 'APPROVED' as const,
              approvedBy: 'Ramesh Sharma (Super Admin)',
              approvedAt: new Date().toLocaleDateString('en-IN'),
            }
          : m
      );
      setModifications(updated);
      saveSevaModifications(updated);

      dispatchTempleAdminNotification({
        type: 'APPROVAL',
        title: `✓ Super Admin Adjusted & Approved Seva: ${proposedData.title}`,
        message: `Super Admin reviewed, fine-tuned specifications, and authorized "${proposedData.title}". Live catalog has been updated.`,
        sevaId: editingModRecord.sevaId,
        sevaTitle: proposedData.title,
      });

      showToast(`✓ Super Admin updated & approved "${proposedData.title}". Live catalog synchronized!`);
      setEditingModRecord(null);
    } else {
      const updated = modifications.map((m) =>
        m.id === editingModRecord.id
          ? {
              ...m,
              sevaTitle: proposedData.title,
              proposedData,
            }
          : m
      );
      setModifications(updated);
      saveSevaModifications(updated);
      showToast(`✓ Saved modified specifications for "${proposedData.title}".`);
      setEditingModRecord(null);
    }
  };

  // Super Admin Edit Blackout Window (Tab 2)
  const handleOpenEditBlockModal = (record: BlockedDateRecord) => {
    setEditingBlockRecord(record);
    setEditBlockForm({
      startDate: record.startDate,
      startTime: record.startTime,
      endDate: record.endDate,
      endTime: record.endTime,
      reason: record.reason,
      notes: record.notes || '',
    });
    setEditBlockError(null);
  };

  const handleSaveAndApproveBlock = () => {
    if (!editingBlockRecord) return;
    setEditBlockError(null);

    if (!editBlockForm.startDate || !editBlockForm.endDate) {
      setEditBlockError('Please specify start and end dates.');
      return;
    }

    const updated = blockedDates.map((b) =>
      b.id === editingBlockRecord.id
        ? {
            ...b,
            startDate: editBlockForm.startDate,
            startTime: editBlockForm.startTime,
            endDate: editBlockForm.endDate,
            endTime: editBlockForm.endTime,
            reason: editBlockForm.reason.trim() || b.reason,
            notes: editBlockForm.notes.trim() || b.notes,
            status: 'APPROVED' as const,
            approvedBy: 'Ramesh Sharma (Super Admin)',
            approvedAt: new Date().toLocaleDateString('en-IN'),
          }
        : b
    );
    setBlockedDates(updated);
    saveBlockedDates(updated);

    dispatchTempleAdminNotification({
      type: 'BLOCK_DECISION',
      title: `✓ Super Admin Adjusted & Approved Blackout Window`,
      message: `Super Admin modified and approved the blackout window for "${editingBlockRecord.sevaTitle}" (${editBlockForm.startDate} to ${editBlockForm.endDate}).`,
      sevaId: editingBlockRecord.sevaId,
      sevaTitle: editingBlockRecord.sevaTitle,
    });

    showToast(`✓ Adjusted and approved blackout window for "${editingBlockRecord.sevaTitle}"!`);
    setEditingBlockRecord(null);
  };

  const approvedCount = releases.filter((r) => r.status === 'APPROVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans pb-16 text-stone-100">
      {/* 3D HEADER BANNER */}
      <div className="bg-gradient-to-r from-devotional-maroon via-devotional-maroon-dark to-stone-950 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-2 border-devotional-gold/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-devotional-saffron animate-pulse" /> Super Admin Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            Seva Quota, Blackout &amp; Suspension Approvals
          </h1>
          <p className="text-amber-100/80 text-xs sm:text-sm max-w-2xl">
            Review monthly ticket releases, authorize 4-month advance date blackout/unblock requests, and approve immediate seva operational suspensions.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-4 py-2 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-xs font-bold text-amber-300">
            {totalPending} Total Pending Request{totalPending !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl text-xs font-bold text-emerald-300 flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* APPROVAL VIEW TABS */}
      <div className="flex flex-wrap bg-stone-950 p-1 rounded-2xl border border-stone-800 gap-1">
        <button
          onClick={() => setActiveTab('releases')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'releases'
              ? 'bg-gradient-to-r from-devotional-saffron to-amber-600 text-white shadow-gold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Monthly Seva Releases ({pendingReleasesCount})
        </button>
        <button
          onClick={() => setActiveTab('blocks')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'blocks'
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <AlertCircle className="w-4 h-4" /> Date Blackouts &amp; Unblocks ({pendingBlocksCount})
        </button>
        <button
          onClick={() => setActiveTab('suspensions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'suspensions'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Immediate Seva Suspensions ({pendingSuspensionsCount})
        </button>
        <button
          onClick={() => setActiveTab('modifications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'modifications'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Edit className="w-4 h-4" /> Seva Catalog Edits &amp; Deletions ({pendingModificationsCount})
        </button>
      </div>

      {/* UNIQUE SEARCH & SEVA DROPDOWN FILTER BAR */}
      <div className="bg-stone-950 p-4 sm:p-5 rounded-3xl border border-stone-800 space-y-3.5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* 1. Keyword Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Seva name, target month/date, rationale, requester, status..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Seva Filter Dropdown */}
          <div className="relative shrink-0 min-w-[240px]">
            <Sparkles className="w-3.5 h-3.5 text-devotional-saffron absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSevaFilter}
              onChange={(e) => setSelectedSevaFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none transition-all truncate"
            >
              <option value="ALL">✨ All Sevas &amp; Offerings</option>
              <option value="ALL_TEMPLE">🚫 All Temple Sevas (Entire Temple)</option>
              {allSevaOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* 3. Status Filter Select */}
          <div className="relative shrink-0 min-w-[180px]">
            <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs font-bold text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">⏳ Pending ({totalPending})</option>
              <option value="APPROVED">✓ Approved &amp; Active</option>
              <option value="REJECTED">✕ Rejected</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedSevaFilter !== 'ALL' || filterStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSevaFilter('ALL');
                setFilterStatus('ALL');
              }}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-all shrink-0 border border-stone-700"
              title="Reset Search &amp; Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Info & Result Counters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-900 text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-amber-400 font-bold">
                {activeTab === 'releases'
                  ? filteredReleases.length
                  : activeTab === 'blocks'
                  ? filteredBlockedDates.length
                  : filteredSuspensions.length}
              </strong>{' '}
              request
              {(activeTab === 'releases' ? filteredReleases.length : activeTab === 'blocks' ? filteredBlockedDates.length : filteredSuspensions.length) !== 1
                ? 's'
                : ''}
            </span>
            {(searchQuery || selectedSevaFilter !== 'ALL' || filterStatus !== 'ALL') && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-semibold border border-amber-400/20">
                Filtered view
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-500">
            Search covers seva titles, reasons, dates, admins &amp; operational notes
          </span>
        </div>
      </div>

      {/* TAB 1: MONTHLY SEVA RELEASES */}
      {activeTab === 'releases' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-devotional-saffron" />
              Monthly Seva Ticket Release Queue ({filteredReleases.length})
            </h2>
          </div>

          {filteredReleases.length === 0 ? (
            <div className="bg-stone-950 p-12 text-center rounded-3xl border border-stone-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-200">
                No Matching Release Requests Found
              </h3>
              <p className="text-xs text-stone-500">
                {(searchQuery || selectedSevaFilter !== 'ALL' || filterStatus !== 'ALL')
                  ? 'Try adjusting your search query or seva dropdown filter.'
                  : 'All monthly seva release requests have been processed.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReleases.map((record) => (
                <div
                  key={record.id}
                  className={`bg-stone-950 p-6 rounded-3xl border-2 transition-all space-y-4 ${
                    record.status === 'PENDING_APPROVAL'
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xl'
                      : record.status === 'APPROVED'
                      ? 'border-stone-800 hover:border-emerald-500/50'
                      : 'border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-stone-800 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-serif font-bold text-amber-300">
                          {record.sevaTitle}
                        </span>
                        <span className="text-xs text-stone-400 font-bold">
                          • Target: {record.monthName}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-devotional-saffron" />
                        {record.templeName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(record)}
                        className="px-3 py-1 bg-stone-900 hover:bg-amber-400 hover:text-stone-950 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Change Release Date/Time
                      </button>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          record.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                            : record.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : 'bg-red-500/20 text-red-300 border border-red-400/40'
                        }`}
                      >
                        {record.status === 'PENDING_APPROVAL'
                          ? '⏳ Awaiting Super Admin Permission'
                          : record.status === 'APPROVED'
                          ? '✓ Approved (Scheduled)'
                          : '✕ Rejected'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Scheduled Release Time</span>
                      <span className="font-bold text-amber-300 text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-devotional-saffron" />
                        {record.releaseDate} at {record.releaseTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Daily Slot Quota</span>
                      <span className="font-bold text-stone-200">{record.dailySlotQuota} Slots / Day</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">1-Day Prior Devotee Alert</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                        <Bell className="w-3 h-3" /> Broadcast Active
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Requested By</span>
                      <span className="font-semibold text-stone-200">{record.requestedBy}</span>
                    </div>
                  </div>

                  {record.notes && (
                    <p className="text-xs text-stone-400 bg-stone-900/40 p-3 rounded-xl border border-stone-800/80">
                      <strong className="text-stone-300">Temple Admin Notes:</strong> {record.notes}
                    </p>
                  )}

                  {record.rejectionReason && (
                    <p className="text-xs text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-900/50">
                      <strong>Rejection Reason:</strong> {record.rejectionReason}
                    </p>
                  )}

                  {record.status === 'PENDING_APPROVAL' && (
                    <div className="flex flex-wrap justify-end gap-2.5 pt-2">
                      <button
                        onClick={() => {
                          setRejectingRecord(record);
                          setRejectionReason('');
                        }}
                        className="px-4 py-2 bg-stone-800 hover:bg-red-950 text-red-400 font-bold text-xs rounded-xl border border-red-800/50 transition-colors"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(record)}
                        className="px-4 py-2 bg-stone-800 hover:bg-amber-950 text-amber-300 font-bold text-xs rounded-xl border border-amber-800/50 transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-devotional-saffron" /> Edit Schedule / Quota
                      </button>
                      <button
                        onClick={() => handleApprove(record)}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-emerald-400/40"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Grant Permission &amp; Schedule Release
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DATE BLACKOUT & UNBLOCK REQUESTS (4-MONTH LIMIT) */}
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Date Blackout &amp; Unblock Requests ({filteredBlockedDates.length})
              </h2>
              <p className="text-xs text-stone-400">
                Authorize temple sanctum closures, solar eclipse blackout windows, and unblock requests.
              </p>
            </div>
          </div>

          {filteredBlockedDates.length === 0 ? (
            <div className="bg-stone-950 p-12 text-center rounded-3xl border border-stone-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-200">
                No Matching Blackout Requests Found
              </h3>
              <p className="text-xs text-stone-500">
                {(searchQuery || selectedSevaFilter !== 'ALL' || filterStatus !== 'ALL')
                  ? 'Try adjusting your search query or seva dropdown filter.'
                  : 'No blackout windows or unblock requests submitted.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlockedDates.map((block) => (
                <div
                  key={block.id}
                  className={`bg-stone-950 p-6 rounded-3xl border-2 transition-all space-y-4 ${
                    block.status === 'PENDING_APPROVAL'
                      ? 'border-red-400 ring-2 ring-red-400/20 shadow-xl'
                      : block.status === 'APPROVED'
                      ? 'border-stone-800 hover:border-emerald-500/50'
                      : 'border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-red-300">
                          {block.requestType === 'UNBLOCK' ? '🔓 Unblock Request' : '🚫 Date Blackout Request'}: {block.sevaTitle}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400 font-bold block">
                        Duration: {block.startDate} ({block.startTime}) to {block.endDate} ({block.endTime})
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        block.status === 'PENDING_APPROVAL'
                          ? 'bg-red-400/20 text-red-300 border border-red-400/40 animate-pulse'
                          : block.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {block.status === 'PENDING_APPROVAL'
                        ? '⏳ Super Admin Permission Required'
                        : block.status === 'APPROVED'
                        ? '✓ Approved & Active'
                        : '✕ Rejected'}
                    </span>
                  </div>

                  <div className="p-3 bg-red-950/20 rounded-2xl border border-red-900/40 text-xs space-y-1">
                    <span className="font-bold text-red-300 block">Reason for Blackout / Unblock:</span>
                    <p className="text-stone-300">{block.reason}</p>
                    {block.notes && <p className="text-stone-400 text-[11px]">Notes: {block.notes}</p>}
                  </div>

                  {block.status === 'PENDING_APPROVAL' && (
                    <div className="flex flex-wrap justify-end gap-2.5 pt-2">
                      <button
                        onClick={() => {
                          setRejectingBlock(block);
                          setBlockRejectReason('');
                        }}
                        className="px-4 py-2 bg-stone-800 hover:bg-red-950 text-red-400 font-bold text-xs rounded-xl border border-red-800/50 transition-colors"
                      >
                        Reject Blackout
                      </button>
                      <button
                        onClick={() => handleOpenEditBlockModal(block)}
                        className="px-4 py-2 bg-stone-800 hover:bg-amber-950 text-amber-300 font-bold text-xs rounded-xl border border-amber-800/50 transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-devotional-saffron" /> Edit Window
                      </button>
                      <button
                        onClick={() => handleApproveBlock(block)}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-red-400/40"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Grant Permission &amp; Execute Immediately
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IMMEDIATE SEVA SUSPENSION REQUESTS */}
      {activeTab === 'suspensions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Immediate Seva Suspension Requests ({filteredSuspensions.length})
              </h2>
              <p className="text-xs text-stone-400">
                Same-time operational requests from temple admin (priest unavailability, emergency maintenance). Approving immediately updates seva visibility.
              </p>
            </div>
          </div>

          {filteredSuspensions.length === 0 ? (
            <div className="bg-stone-950 p-12 text-center rounded-3xl border border-stone-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-200">
                No Matching Seva Suspension Requests Found
              </h3>
              <p className="text-xs text-stone-500">
                {(searchQuery || selectedSevaFilter !== 'ALL' || filterStatus !== 'ALL')
                  ? 'Try adjusting your search query or seva dropdown filter.'
                  : 'All sevas are operational. No suspension or reactivation requests pending.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSuspensions.map((susp) => (
                <div
                  key={susp.id}
                  className={`bg-stone-950 p-6 rounded-3xl border-2 transition-all space-y-4 ${
                    susp.status === 'PENDING_APPROVAL'
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xl'
                      : susp.status === 'APPROVED'
                      ? 'border-stone-800 hover:border-emerald-500/50'
                      : 'border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-amber-300">
                        {susp.action === 'SUSPEND' ? '⛔ Request to Suspend' : '✅ Request to Reactivate'}: {susp.sevaTitle}
                      </h3>
                      <span className="text-xs text-stone-400">Requested by: {susp.requestedBy} ({susp.requestedAt})</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        susp.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                          : susp.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {susp.status === 'PENDING_APPROVAL'
                        ? '⏳ Super Admin Decision Required'
                        : susp.status === 'APPROVED'
                        ? '✓ Approved (Executed)'
                        : '✕ Rejected'}
                    </span>
                  </div>

                  <div className="p-3 bg-amber-950/20 rounded-2xl border border-amber-900/40 text-xs space-y-1">
                    <span className="font-bold text-amber-300 block">Rationale / Operational Reason:</span>
                    <p className="text-stone-300">{susp.reason}</p>
                    {susp.notes && <p className="text-stone-400 text-[11px]">Notes: {susp.notes}</p>}
                  </div>

                  {susp.status === 'PENDING_APPROVAL' && (
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setRejectingSuspension(susp);
                          setSuspensionRejectReason('');
                        }}
                        className="px-4 py-2 bg-stone-800 hover:bg-red-950 text-red-400 font-bold text-xs rounded-xl border border-red-800/50 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveSuspension(susp)}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-emerald-400/40"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Grant Permission &amp; {susp.action === 'SUSPEND' ? 'Suspend' : 'Reactivate'} Immediately
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SEVA CATALOG EDITS & DELETIONS */}
      {activeTab === 'modifications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-400" />
                Seva Catalog Modifications &amp; Deletions ({filteredModifications.length})
              </h2>
              <p className="text-xs text-stone-400">
                Review and authorize Temple Admin requests to edit seva parameters, offering prices, timings, or decommission/delete sevas from catalog.
              </p>
            </div>
          </div>

          {filteredModifications.length === 0 ? (
            <div className="bg-stone-950 p-12 text-center rounded-3xl border border-stone-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-stone-200">
                No Seva Modification Requests
              </h3>
              <p className="text-xs text-stone-500">
                {(searchQuery || selectedSevaFilter !== 'ALL' || filterStatus !== 'ALL')
                  ? 'No modification requests match your current filters.'
                  : 'All seva catalog edits and deletion requests have been processed.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredModifications.map((mod) => {
                const isEdit = mod.action === 'EDIT';
                const isDelete = mod.action === 'DELETE';
                const isCreate = mod.action === 'CREATE';

                return (
                  <div
                    key={mod.id}
                    className={`bg-stone-950 p-6 rounded-3xl border-2 transition-all space-y-4 ${
                      mod.status === 'PENDING_APPROVAL'
                        ? isDelete
                          ? 'border-red-400 ring-2 ring-red-400/20 shadow-xl'
                          : 'border-purple-400 ring-2 ring-purple-400/20 shadow-xl'
                        : mod.status === 'APPROVED'
                        ? 'border-stone-800 hover:border-emerald-500/50'
                        : 'border-stone-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isDelete
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : isCreate
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-purple-950 text-purple-300 border border-purple-800'
                            }`}
                          >
                            {isDelete ? '🗑️ Deletion Request' : isCreate ? '✨ Creation Request' : '✏️ Edit / Update Request'}
                          </span>
                          <h3 className="font-serif font-bold text-base text-amber-300">
                            {mod.sevaTitle}
                          </h3>
                        </div>
                        <span className="text-xs text-stone-400">
                          Requested by: {mod.requestedBy} ({mod.requestedAt})
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          mod.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                            : mod.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {mod.status === 'PENDING_APPROVAL'
                          ? '⏳ Super Admin Decision Required'
                          : mod.status === 'APPROVED'
                          ? '✓ Approved (Executed)'
                          : '✕ Rejected'}
                      </span>
                    </div>

                    {/* Diff / Details View */}
                    {isEdit && mod.proposedData && mod.originalData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                        <div className="space-y-1.5 opacity-75">
                          <span className="font-bold text-stone-400 uppercase text-[10px] block">Current Live Specifications:</span>
                          <p><strong className="text-stone-300">Title:</strong> {mod.originalData.title}</p>
                          <p><strong className="text-stone-300">Price:</strong> ₹{mod.originalData.price}</p>
                          <p><strong className="text-stone-300">Duration:</strong> {mod.originalData.duration}</p>
                          <p><strong className="text-stone-300">Slots:</strong> {mod.originalData.availableSlots.join(', ')}</p>
                          <p className="line-clamp-2"><strong className="text-stone-300">Description:</strong> {mod.originalData.description}</p>
                        </div>

                        <div className="space-y-1.5 bg-purple-950/30 p-3 rounded-xl border border-purple-800/40">
                          <span className="font-bold text-purple-300 uppercase text-[10px] block">Proposed Updated Specifications:</span>
                          <p><strong className="text-purple-200">Title:</strong> {mod.proposedData.title || mod.originalData.title}</p>
                          <p><strong className="text-purple-200">Price:</strong> ₹{mod.proposedData.price ?? mod.originalData.price}</p>
                          <p><strong className="text-purple-200">Duration:</strong> {mod.proposedData.duration || mod.originalData.duration}</p>
                          <p><strong className="text-purple-200">Slots:</strong> {(mod.proposedData.availableSlots || mod.originalData.availableSlots).join(', ')}</p>
                          <p className="line-clamp-2"><strong className="text-purple-200">Description:</strong> {mod.proposedData.description || mod.originalData.description}</p>
                        </div>
                      </div>
                    )}

                    {isDelete && (
                      <div className="p-3.5 bg-red-950/30 rounded-2xl border border-red-900/50 text-xs space-y-1.5">
                        <span className="font-bold text-red-300 block flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          Decommissioning Notice:
                        </span>
                        <p className="text-stone-300">
                          Temple Admin has requested to permanently remove <strong>&quot;{mod.sevaTitle}&quot;</strong> from the Devotee Pooja Catalog.
                        </p>
                      </div>
                    )}

                    {isCreate && mod.proposedData && (
                      <div className="p-4 bg-emerald-950/20 rounded-2xl border border-emerald-900/40 text-xs space-y-1.5">
                        <span className="font-bold text-emerald-300 uppercase text-[10px] block">New Seva Specifications:</span>
                        <p><strong className="text-stone-300">Deity:</strong> {mod.proposedData.deity}</p>
                        <p><strong className="text-stone-300">Offering Price:</strong> ₹{mod.proposedData.price}</p>
                        <p><strong className="text-stone-300">Slots:</strong> {mod.proposedData.availableSlots?.join(', ')}</p>
                        <p><strong className="text-stone-300">Description:</strong> {mod.proposedData.description}</p>
                      </div>
                    )}

                    {mod.reason && (
                      <div className="p-3 bg-stone-900/40 rounded-2xl border border-stone-800 text-xs space-y-1">
                        <span className="font-bold text-stone-400 block">Requester Rationale / Note:</span>
                        <p className="text-stone-300">{mod.reason}</p>
                      </div>
                    )}

                    {mod.rejectionReason && (
                      <div className="p-3 bg-red-950/30 rounded-2xl border border-red-900/40 text-xs space-y-1">
                        <span className="font-bold text-red-400 block">Super Admin Rejection Feedback:</span>
                        <p className="text-stone-300">{mod.rejectionReason}</p>
                      </div>
                    )}

                    {mod.status === 'PENDING_APPROVAL' && (
                      <div className="flex flex-wrap justify-end gap-2.5 pt-2">
                        <button
                          onClick={() => {
                            setRejectingModification(mod);
                            setModificationRejectReason('');
                          }}
                          className="px-4 py-2 bg-stone-800 hover:bg-red-950 text-red-400 font-bold text-xs rounded-xl border border-red-800/50 transition-colors"
                        >
                          Reject
                        </button>
                        {!isDelete && (
                          <button
                            onClick={() => handleOpenEditModModal(mod)}
                            className="px-4 py-2 bg-stone-800 hover:bg-purple-950 text-purple-300 font-bold text-xs rounded-xl border border-purple-800/50 transition-colors flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5 text-purple-400" /> Edit Specifications
                          </button>
                        )}
                        <button
                          onClick={() => handleApproveModification(mod)}
                          className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-emerald-400/40"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Grant Permission &amp; {isDelete ? 'Delete Seva' : 'Apply Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUPER ADMIN EDIT / RESCHEDULE MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-devotional-gold rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-300">
                  Reschedule Seva Release Timing
                </h3>
                <p className="text-xs text-stone-400">
                  {editingRecord.sevaTitle} ({editingRecord.monthName})
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Adjust Ticket Release Date
                </label>
                <input
                  type="date"
                  value={editReleaseDate}
                  onChange={(e) => setEditReleaseDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Adjust Release Time (09:00 AM – 06:30 PM)
                </label>
                <select
                  value={editReleaseTime}
                  onChange={(e) => setEditReleaseTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="09:00 AM">09:00 AM (Morning Opening Slot)</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM (Noon Slot)</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM (Afternoon Slot)</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="06:30 PM">06:30 PM (Evening Closing Slot)</option>
                </select>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Enforces minimum 3-hour difference from other releases on that date.
                </span>
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Daily Slot Quota
                </label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={editDailyQuota}
                  onChange={(e) => setEditDailyQuota(parseInt(e.target.value) || 10)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-6 py-2 bg-gradient-to-r from-devotional-saffron to-amber-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-gold"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT RELEASE MODAL */}
      {rejectingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-red-500 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-base text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Reject Release Request
              </h3>
              <button onClick={() => setRejectingRecord(null)} className="p-1 text-stone-400 hover:text-stone-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Provide feedback for the Temple Admin regarding why &quot;{rejectingRecord.sevaTitle}&quot; release was rejected:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Schedule clash with festival homam. Please reschedule to 03:00 PM."
              className="w-full p-3 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingRecord(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm Rejection &amp; Notify Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT BLOCK MODAL */}
      {rejectingBlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-red-500 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-base text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Reject Date Blackout Request
              </h3>
              <button onClick={() => setRejectingBlock(null)} className="p-1 text-stone-400 hover:text-stone-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Provide feedback for the Temple Admin regarding why blackout for &quot;{rejectingBlock.sevaTitle}&quot; was rejected:
            </p>

            <textarea
              rows={3}
              value={blockRejectReason}
              onChange={(e) => setBlockRejectReason(e.target.value)}
              placeholder="e.g. Sanctum closure not justified on this date. Darshan must remain open."
              className="w-full p-3 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingBlock(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectBlock}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm Rejection &amp; Notify Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT SUSPENSION MODAL */}
      {rejectingSuspension && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-red-500 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-base text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Reject Seva Suspension Request
              </h3>
              <button onClick={() => setRejectingSuspension(null)} className="p-1 text-stone-400 hover:text-stone-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Provide feedback for the Temple Admin regarding why suspension of &quot;{rejectingSuspension.sevaTitle}&quot; was rejected:
            </p>

            <textarea
              rows={3}
              value={suspensionRejectReason}
              onChange={(e) => setSuspensionRejectReason(e.target.value)}
              placeholder="e.g. Seva must remain active. Substitute priest will be arranged."
              className="w-full p-3 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingSuspension(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectSuspension}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm Rejection &amp; Notify Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODIFICATION / DELETION MODAL */}
      {rejectingModification && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-red-500 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-base text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Reject Seva {rejectingModification.action === 'DELETE' ? 'Deletion' : rejectingModification.action === 'CREATE' ? 'Creation' : 'Modification'} Request
              </h3>
              <button onClick={() => setRejectingModification(null)} className="p-1 text-stone-400 hover:text-stone-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Provide feedback for the Temple Admin regarding why {rejectingModification.action.toLowerCase()} of &quot;{rejectingModification.sevaTitle}&quot; was rejected:
            </p>

            <textarea
              rows={3}
              value={modificationRejectReason}
              onChange={(e) => setModificationRejectReason(e.target.value)}
              placeholder="e.g. Ritual timing change conflicts with temple evening aarti."
              className="w-full p-3 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingModification(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectModification}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm Rejection &amp; Notify Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN EDIT SEVA SPECIFICATIONS MODAL (TAB 4) */}
      {editingModRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-purple-500 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-purple-300 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-purple-400" />
                  Super Admin Edit: Seva Specifications
                </h3>
                <p className="text-xs text-stone-400">
                  Fine-tune pricing, deity, timings, and ritual descriptions before granting catalog permission.
                </p>
              </div>
              <button
                onClick={() => setEditingModRecord(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editModError && (
              <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{editModError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    Seva Title
                  </label>
                  <input
                    type="text"
                    value={editModForm.title}
                    onChange={(e) => setEditModForm({ ...editModForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    Deity / Presiding Deity
                  </label>
                  <input
                    type="text"
                    value={editModForm.deity}
                    onChange={(e) => setEditModForm({ ...editModForm, deity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    Offering Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editModForm.price}
                    onChange={(e) => setEditModForm({ ...editModForm, price: Number(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editModForm.duration}
                    onChange={(e) => setEditModForm({ ...editModForm, duration: e.target.value })}
                    placeholder="e.g. 45 mins"
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Daily Time Slots (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editModForm.availableSlots}
                  onChange={(e) => setEditModForm({ ...editModForm, availableSlots: e.target.value })}
                  placeholder="08:00 AM, 10:30 AM, 05:30 PM, 07:00 PM"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Spiritual Benefits / Inclusions (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editModForm.benefits}
                  onChange={(e) => setEditModForm({ ...editModForm, benefits: e.target.value })}
                  placeholder="Family Prosperity, Holy Kumkuma Prasadam, Ammavari Raksha"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Description &amp; Significance
                </label>
                <textarea
                  rows={3}
                  value={editModForm.description}
                  onChange={(e) => setEditModForm({ ...editModForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                onClick={() => setEditingModRecord(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveAndApproveMod(false)}
                className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold text-xs rounded-xl border border-purple-800"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSaveAndApproveMod(true)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save &amp; Grant Permission Immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN EDIT BLACKOUT WINDOW MODAL (TAB 2) */}
      {editingBlockRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-red-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-red-300 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-red-400" />
                  Super Admin Edit: Blackout Window
                </h3>
                <p className="text-xs text-stone-400">
                  {editingBlockRecord.sevaTitle}
                </p>
              </div>
              <button
                onClick={() => setEditingBlockRecord(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editBlockError && (
              <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{editBlockError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editBlockForm.startDate}
                    onChange={(e) => setEditBlockForm({ ...editBlockForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={editBlockForm.startTime}
                    onChange={(e) => setEditBlockForm({ ...editBlockForm, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editBlockForm.endDate}
                    onChange={(e) => setEditBlockForm({ ...editBlockForm, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={editBlockForm.endTime}
                    onChange={(e) => setEditBlockForm({ ...editBlockForm, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Reason for Blackout / Unblock
                </label>
                <input
                  type="text"
                  value={editBlockForm.reason}
                  onChange={(e) => setEditBlockForm({ ...editBlockForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold uppercase text-[10px] mb-1">
                  Operational Notes
                </label>
                <textarea
                  rows={2}
                  value={editBlockForm.notes}
                  onChange={(e) => setEditBlockForm({ ...editBlockForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                onClick={() => setEditingBlockRecord(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndApproveBlock}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save &amp; Grant Blackout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

