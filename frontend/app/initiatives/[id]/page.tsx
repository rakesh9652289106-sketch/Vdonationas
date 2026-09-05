'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Initiative,
  getInitiativeByCode,
  INITIATIVE_TYPE_LABELS,
  registerDevoteeMuhurthamReminder,
  isInitiativeReminderSet,
  isInitiativeTeaserVisible,
} from '@/lib/initiatives-data';
import InitiativeTimeline3D from '@/components/3d/InitiativeTimeline3D';
import InitiativeFundsBreakdown3D from '@/components/3d/InitiativeFundsBreakdown3D';
import InitiativeElevation3D from '@/components/3d/InitiativeElevation3D';
import SacredAkhandaDiya3D from '@/components/3d/SacredAkhandaDiya3D';
import SacredSwarnaHundi3D from '@/components/3d/SacredSwarnaHundi3D';
import ShareInitiativeModal from '@/components/initiatives/ShareInitiativeModal';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  ArrowLeft,
  MapPin,
  Flame,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Share2,
  FileText,
  Download,
  Clock,
  Heart,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Bell,
  CheckCircle2,
} from 'lucide-react';

export default function InitiativeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showAlert } = useConfirmAlert();
  const code = (params?.id as string) || '';

  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROGRESS' | 'FUNDS' | 'UPDATES' | '3D_CHAMBER'>('OVERVIEW');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string | null>(null);
  const [reminderSet, setReminderSet] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isPassed: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    async function load() {
      if (!code) return;
      setLoading(true);
      try {
        const item = await getInitiativeByCode(code);
        setInitiative(item);
        if (item?.code) {
          setReminderSet(isInitiativeReminderSet(item.code));
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  useEffect(() => {
    if (initiative?.status !== 'SCHEDULED' || !initiative.scheduled_publish_at) return;

    const target = new Date(initiative.scheduled_publish_at).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [initiative]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-devotional-gold animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading sacred initiative details...</p>
        </div>
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4">
          <div className="text-3xl">🛕</div>
          <h2 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
            Initiative Not Found
          </h2>
          <p className="text-xs text-stone-500">
            The requested initiative code &quot;{code}&quot; could not be located in the trust database.
          </p>
          <Link
            href="/initiatives"
            className="inline-block px-5 py-2.5 rounded-2xl bg-devotional-maroon text-white font-bold text-xs shadow-md"
          >
            Explore
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = INITIATIVE_TYPE_LABELS[initiative.initiative_type] || INITIATIVE_TYPE_LABELS.OTHER;
  const percent = initiative.target_amount > 0
    ? Math.min(Math.round((initiative.current_raised / initiative.target_amount) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans pb-28">
      {/* Top Back Navigation Bar */}
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-16 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-devotional-maroon dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-devotional-saffron bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-300/40">
              {initiative.code}
            </span>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-devotional-gold text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-amber-50/50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-devotional-saffron" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* 3D Immersive Hero Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-devotional-gold/40 bg-stone-950">
          <div className="relative h-64 sm:h-96 w-full">
            <img
              src={initiative.cover_image || 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80'}
              alt={initiative.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md border ${typeConfig.badgeColor}`}>
                <span>{typeConfig.icon}</span>
                <span>{initiative.custom_type || typeConfig.label}</span>
              </span>

              {initiative.is_urgent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-red-600 text-white shadow-lg animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-current" /> Urgent Cause
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-devotional-maroon text-amber-200 border border-amber-400/40 shadow-md uppercase">
                Stage: {initiative.current_stage}
              </span>
            </div>

            {/* Title & Metadata Overlay */}
            <div className="absolute bottom-6 inset-x-6 z-10 space-y-2 text-white">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                <MapPin className="w-4 h-4 text-devotional-saffron" />
                <span>{initiative.city}, {initiative.state} ({initiative.country})</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-200 tracking-tight leading-tight">
                {initiative.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Sacred Auspicious Launch Countdown Banner (When SCHEDULED and Teaser Visible) */}
        {initiative.status === 'SCHEDULED' && isInitiativeTeaserVisible(initiative) && (
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-950 via-stone-900 to-red-950 text-white border-2 border-devotional-gold/60 shadow-2xl overflow-hidden">
            {/* Ambient Background Vedic Glow */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Scheduled Auspicious Release</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                  {initiative.muhurtham_name || 'Vedic Muhurtham Sacred Launch'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  This divine initiative has been sanctified by the Matha and scheduled for public opening. Devotee contributions and seva bookings will commence promptly at the sacred Muhurtham hour.
                </p>
                {initiative.scheduled_publish_at && (
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-amber-300/90 font-mono">
                    <span>📅 {new Date(initiative.scheduled_publish_at).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <span>⏰ {new Date(initiative.scheduled_publish_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>

              {/* 3D Countdown Blocks */}
              <div className="flex items-center gap-2 sm:gap-3 text-center shrink-0">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Mins', val: timeLeft.minutes },
                  { label: 'Secs', val: timeLeft.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="flex flex-col items-center justify-center w-16 sm:w-20 h-20 sm:h-24 rounded-2xl bg-stone-900/90 border border-devotional-gold/50 shadow-inner shadow-black"
                  >
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                      {String(unit.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Devotional Actions / Reminder inside banner */}
            <div className="relative z-10 mt-6 pt-4 border-t border-amber-400/20 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-amber-200/80 italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Devotee pre-launch preview mode active. Notifications will broadcast at launch.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (initiative) {
                    registerDevoteeMuhurthamReminder(initiative);
                    setReminderSet(true);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              >
                {reminderSet ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Reminder Set
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-amber-400" /> Remind
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 3D Real-Time Financial Metric Tracker Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-devotional-gold/40 shadow-xl space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Amount Raised</p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
                ₹{initiative.current_raised.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">{percent}% of goal</p>
            </div>

            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Sanctioned Target</p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 dark:text-stone-200">
                ₹{initiative.target_amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">Approved Budget</p>
            </div>

            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Devotee Donors</p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 dark:text-stone-200">
                {initiative.donor_count}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">Sacred Contributors</p>
            </div>

            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Tax Benefit</p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-devotional-saffron">
                80G
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Tax Deductible</p>
            </div>
          </div>

          {/* 3D Metallic Progress Bar */}
          <div className="space-y-1.5">
            <div className="relative w-full h-4 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden shadow-inner border border-stone-300/40 dark:border-stone-700">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{
                  width: `${percent}%`,
                  background: 'linear-gradient(90deg, #8B0000 0%, #D4AF37 50%, #FFD700 100%)',
                  boxShadow: '0 0 15px rgba(212,175,55,0.6)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 font-medium">
              <span>Initiative Started: {new Date(initiative.start_date).toLocaleDateString()}</span>
              <span>{percent}% Completed</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Dedicated Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 bg-stone-200/80 dark:bg-stone-800/80 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { key: 'OVERVIEW', label: 'Overview' },
              { key: '3D_CHAMBER', label: '🪔 3D Sacred Chamber' },
              { key: 'PROGRESS', label: 'Milestones' },
              { key: 'FUNDS', label: 'Financials' },
              { key: 'UPDATES', label: `Updates (${initiative.updates?.length || 0})` },
            ].map((t) => (
              <button
                type="button"
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold text-center whitespace-nowrap transition-all duration-200 ${
                  activeTab === t.key
                    ? 'bg-devotional-maroon text-amber-200 shadow-md ring-1 ring-amber-400/40'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Narrative & Objectives */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
                  <h3 className="text-xl font-serif font-bold text-devotional-maroon dark:text-amber-300">
                    Sacred Objective & Purpose
                  </h3>
                  <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                    {initiative.description}
                  </p>

                  {initiative.objective && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-devotional-gold/30 text-xs space-y-1">
                      <p className="font-bold text-devotional-maroon dark:text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-devotional-saffron" /> Specific Deliverables
                      </p>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                        {initiative.objective}
                      </p>
                    </div>
                  )}
                </div>

                {/* Photo Gallery */}
                {initiative.gallery_images && initiative.gallery_images.length > 0 && (
                  <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                      Visual Photo Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {initiative.gallery_images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveGalleryImg(img)}
                          className="h-32 rounded-2xl overflow-hidden cursor-pointer border border-stone-200 dark:border-stone-800 hover:border-devotional-gold transition-all duration-300 hover:scale-105"
                        >
                          <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Location & Documents */}
              <div className="space-y-6">
                {/* 3D Virtual Sacred Chamber Teaser Card */}
                <div className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 border-2 border-devotional-gold/70 shadow-2xl text-stone-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-xl border border-amber-500/30">🪔</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-devotional-gold tracking-wider block">
                        IMMERSIVE 3D EXPERIENCE
                      </span>
                      <h4 className="font-serif font-bold text-sm text-amber-200">
                        Virtual Sacred Chamber
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Light a dedicated 3D Akhanda Deepam and drop sacred gold coins in the 3D Swarna Hundi for this initiative.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('3D_CHAMBER')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white font-bold text-xs shadow-gold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Enter 3D Sacred Chamber
                  </button>
                </div>

                {/* Location Card */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-devotional-saffron" /> Physical Location
                  </h3>
                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{initiative.address || 'Temple Sanctum Complex'}</p>
                    <p>{initiative.city}, {initiative.district ? `${initiative.district}, ` : ''}{initiative.state}</p>
                    <p>PIN: {initiative.pin_code || '520001'}, {initiative.country}</p>
                    {initiative.latitude != null && initiative.longitude != null && !isNaN(Number(initiative.latitude)) && !isNaN(Number(initiative.longitude)) && (
                      <p className="font-mono text-[10px] text-stone-400">
                        GPS: {Number(initiative.latitude).toFixed(4)}° N, {Number(initiative.longitude).toFixed(4)}° E
                      </p>
                    )}
                  </div>
                </div>

                {/* Documents & Blueprints */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-devotional-saffron" /> Sanctioned Documents
                  </h3>
                  {(!initiative.documents || initiative.documents.length === 0) ? (
                    <p className="text-xs text-stone-400 italic">No public documents uploaded.</p>
                  ) : (
                    <div className="space-y-2">
                      {initiative.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700 text-xs"
                        >
                          <div className="truncate pr-2">
                            <p className="font-bold text-stone-800 dark:text-stone-200 truncate">{doc.name}</p>
                            <p className="text-[10px] text-stone-400">{doc.size} • {doc.type}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              showAlert({
                                type: 'info',
                                title: 'Document Download Initialized',
                                message: `Downloading public initiative document "${doc.name}" (${doc.size}).`,
                              })
                            }
                            className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-devotional-gold hover:text-stone-950 transition-colors shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D SACRED CHAMBER (AKHANDA DEEPAM & SWARNA HUNDI) */}
          {activeTab === '3D_CHAMBER' && (
            <div className="space-y-10 animate-fadeIn">
              {/* 3D Sacred Akhanda Diya */}
              <SacredAkhandaDiya3D
                initiativeTitle={initiative.title}
                initiativeCode={initiative.code}
                onDeepamLit={(devotee, wish) => {
                  showAlert({
                    type: 'success',
                    title: 'Akhanda Deepam Consecrated! 🪔',
                    message: `May Sri Vasavi Matha shower divine blessings upon ${devotee} for dedicating an eternal deepam to "${initiative.title}". Sankalpam: "${wish}"`,
                  });
                }}
              />

              {/* 3D Swarna Hundi Vessel */}
              <div className="space-y-4">
                <div className="text-center space-y-1.5 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-devotional-saffron text-xs font-bold uppercase tracking-wider border border-devotional-gold/40">
                    🪙 SACRED INITIATIVE E-HUNDI
                  </div>
                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-devotional-maroon dark:text-amber-400">
                    Offer Digital Gold Coins to Swarna Hundi
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Click any coin or enter a custom sum to hear the divine resonance and offer your seva directly to this initiative.
                  </p>
                </div>

                <SacredSwarnaHundi3D
                  templeName="Sri Vasavi Matha Devasthanam"
                  onCoinDropped={(amt) => {
                    showAlert({
                      type: 'success',
                      title: 'Sacred Coin Drop Confirmed! 🙏',
                      message: `Auspicious offering of ₹${amt.toLocaleString('en-IN')} dropped into the Swarna Hundi for "${initiative.title}". May peace and abundance fill your home!`,
                    });
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: PROGRESS / MILESTONES */}
          {activeTab === 'PROGRESS' && (
            <div className="space-y-8">
              <InitiativeElevation3D
                currentStage={initiative.current_stage}
                percentageFunded={percent}
                initiativeType={initiative.initiative_type}
                title={initiative.title}
              />
              <InitiativeTimeline3D
                currentStage={initiative.current_stage}
                updates={initiative.updates}
                startDate={initiative.start_date}
                targetEndDate={initiative.end_date}
              />
            </div>
          )}

          {/* TAB 3: FUNDS / FINANCIALS */}
          {activeTab === 'FUNDS' && (
            <InitiativeFundsBreakdown3D
              targetAmount={initiative.target_amount}
              currentRaised={initiative.current_raised}
              breakdownItems={initiative.breakdown_items || []}
              expenses={initiative.expenses || []}
              excessFundsPolicy={initiative.excess_funds_policy}
            />
          )}

          {/* TAB 4: UPDATES */}
          {activeTab === 'UPDATES' && (
            <div className="space-y-6">
              {(!initiative.updates || initiative.updates.length === 0) ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 shadow-md space-y-2">
                  <div className="text-3xl">📜</div>
                  <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
                    No Field Updates Posted Yet
                  </h4>
                  <p className="text-xs text-stone-500">
                    The temple project coordinators will publish on-site progress statements and photography here as milestones are met.
                  </p>
                </div>
              ) : (
                initiative.updates.map((up) => (
                  <div
                    key={up.id}
                    className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 dark:border-stone-800 pb-3">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-devotional-maroon dark:text-amber-300">
                          {up.title}
                        </h4>
                        <p className="text-xs text-stone-400">
                          Posted by {up.posted_by_name || 'Temple Administrator'}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-stone-500">
                        {new Date(up.posted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                      {up.message}
                    </p>

                    {up.images && up.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        {up.images.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => setActiveGalleryImg(img)}
                            className="h-40 rounded-2xl overflow-hidden cursor-pointer border border-stone-200 dark:border-stone-800 hover:border-devotional-gold transition-all"
                          >
                            <img src={img} alt="Update" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Devotional Donation Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-devotional-gold/40 py-3 px-4 sm:px-8 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Offering To</span>
            <p className="font-serif font-bold text-xs sm:text-sm text-devotional-maroon dark:text-amber-300 truncate max-w-xs sm:max-w-md">
              {initiative.title}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-devotional-gold transition-colors hidden sm:flex items-center gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-4 h-4 text-devotional-saffron" /> Share
            </button>

            {initiative.status === 'SCHEDULED' ? (
              <button
                type="button"
                onClick={() => setReminderSet(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-950/40 active:scale-95 transition-all flex items-center gap-2 border border-amber-300/40"
              >
                {reminderSet ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Reminded
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-amber-200" /> Remind
                  </>
                )}
              </button>
            ) : (
              <Link
                href={`/donate?initiativeId=${encodeURIComponent(initiative.code)}&title=${encodeURIComponent(initiative.title)}`}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-devotional-maroon via-red-800 to-devotional-maroon hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950/40 active:scale-95 transition-all flex items-center gap-2 border border-amber-300/40"
              >
                <Heart className="w-4 h-4 fill-current text-amber-300" /> Donate
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeGalleryImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveGalleryImg(null)}
        >
          <img
            src={activeGalleryImg}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-amber-400/40 shadow-2xl"
          />
        </div>
      )}

      {/* Share Modal */}
      <ShareInitiativeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        initiative={initiative}
      />
    </div>
  );
}
