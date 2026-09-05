'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Initiative,
  InitiativeType,
  InitiativePriority,
  InitiativeStage,
  InitiativeStatus,
  createInitiative,
  INITIATIVE_TYPE_LABELS,
} from '@/lib/initiatives-data';
import { useConfirmAlert } from '@/lib/confirm-alert-context';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MapPin,
  IndianRupee,
  PieChart,
  Image as ImageIcon,
  Send,
  Plus,
  Trash2,
  ShieldCheck,
  Flame,
  Calendar,
  Clock,
  Bell,
  Sun,
  Moon,
  Radio,
  FileText,
  AlertCircle,
  HelpCircle,
  Timer,
} from 'lucide-react';

const WIZARD_STEPS = [
  { id: 1, name: 'Basic', desc: 'Title & Type' },
  { id: 2, name: 'Location', desc: 'Devasthanam & GPS' },
  { id: 3, name: 'Funds', desc: 'Sanctioned Target' },
  { id: 4, name: 'Breakdown', desc: 'Itemized Budget' },
  { id: 5, name: 'Media', desc: 'Cover & Blueprints' },
  { id: 6, name: 'Audit Review', desc: 'Verify All Stages' },
  { id: 7, name: 'Schedule & Launch', desc: 'Muhurtham & Release' },
];

export default function CreateInitiativeWizardPage() {
  const router = useRouter();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Step 1: Basic
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [initiativeType, setInitiativeType] = useState<InitiativeType>('TEMPLE_CONSTRUCTION');
  const [customType, setCustomType] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [priority, setPriority] = useState<InitiativePriority>('NORMAL');
  const [isUrgent, setIsUrgent] = useState(false);

  // Step 2: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Penugonda');
  const [district, setDistrict] = useState('West Godavari');
  const [state, setState] = useState('Andhra Pradesh');
  const [pinCode, setPinCode] = useState('534320');
  const [hasPhysicalLocation, setHasPhysicalLocation] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Step 3: Financials
  const [targetAmount, setTargetAmount] = useState('2500000');
  const [minDonation, setMinDonation] = useState('100');
  const [suggestedAmounts, setSuggestedAmounts] = useState('501, 1001, 2501, 5001, 10001');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [excessFundsPolicy, setExcessFundsPolicy] = useState(
    'Excess contributions will be utilized transparently for continuous Matha Annadanam, devotee medical welfare, and student scholarships.'
  );

  // Step 4: Budget Breakdown Items
  const [breakdownItems, setBreakdownItems] = useState([
    { category: 'Foundation & Agamic Sanctum', target_amount: 800000, description: 'Deep reinforced stone foundation' },
    { category: 'Granite Pillars & Carving', target_amount: 1200000, description: 'Sculpted Dravidian pillars' },
    { category: 'Marble Flooring & Electrification', target_amount: 500000, description: 'Makrana marble and Vedic lighting' },
  ]);

  // Step 5: Media
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=1200&q=80');
  const [galleryImages, setGalleryImages] = useState([
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=800&q=80',
  ]);
  const [docName, setDocName] = useState('Agamic Structural Blueprint.pdf');

  // Step 6: Verification Checkbox
  const [isStage6Confirmed, setIsStage6Confirmed] = useState(false);

  // Step 7: Launch & Scheduling Protocol State
  const [launchMode, setLaunchMode] = useState<'INSTANT' | 'SCHEDULED'>('SCHEDULED');
  
  // Default tomorrow at 06:00 AM IST
  const getTomorrowMorning = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(6, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [scheduledDateTime, setScheduledDateTime] = useState(getTomorrowMorning());
  const [muhurthamName, setMuhurthamName] = useState('Brahma Muhurtham (04:30 AM - 06:00 AM)');
  const [isTeaserEnabled, setIsTeaserEnabled] = useState(true);
  const [broadcastOnPublish, setBroadcastOnPublish] = useState(true);

  // Quick Auspicious Muhurtham Presets
  const applyMuhurthamPreset = (presetName: string, hour: number, minute: number, dayOffset = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    // Format YYYY-MM-DDTHH:mm
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:${pad(minute)}`;
    setScheduledDateTime(formatted);
    setMuhurthamName(presetName);
  };

  // Add / Remove Breakdown Row
  const handleAddBreakdownRow = () => {
    setBreakdownItems([
      ...breakdownItems,
      { category: '', target_amount: 100000, description: '' },
    ]);
  };

  const handleRemoveBreakdownRow = (index: number) => {
    setBreakdownItems(breakdownItems.filter((_, i) => i !== index));
  };

  const handleBreakdownChange = (index: number, field: string, val: string | number) => {
    const updated = [...breakdownItems];
    updated[index] = {
      ...updated[index],
      [field]: field === 'target_amount' ? parseFloat(val as string) || 0 : val,
    };
    setBreakdownItems(updated);
  };

  // Final Submit Handler
  const handleFinalSubmit = async (actionType: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED') => {
    if (!title.trim()) {
      showAlert({
        type: 'warning',
        title: 'Initiative Title Required',
        message: 'Please enter a sacred initiative title on Step 1 before saving or publishing.',
      });
      setCurrentStep(1);
      return;
    }

    const confirmed = await confirmAction({
      title:
        actionType === 'PUBLISHED'
          ? 'Publish Initiative Immediately?'
          : actionType === 'SCHEDULED'
          ? 'Schedule Initiative Launch?'
          : 'Save Initiative as Draft?',
      message:
        actionType === 'PUBLISHED'
          ? `Publishing "${title}" will immediately make this initiative live and publicly visible to devotees across the portal.`
          : actionType === 'SCHEDULED'
          ? `This will schedule "${title}" for auto-launch on ${scheduledDateTime || 'the chosen auspicious muhurtham'}.`
          : `Save "${title}" as a draft for ongoing review by temple trustees?`,
      confirmText:
        actionType === 'PUBLISHED' ? 'Publish Now' : actionType === 'SCHEDULED' ? 'Schedule Launch' : 'Save Draft',
      variant: 'change',
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const finalStatus: InitiativeStatus = actionType === 'SCHEDULED' ? 'SCHEDULED' : actionType === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';

      await createInitiative({
        title,
        short_title: shortTitle || title.slice(0, 30),
        initiative_type: initiativeType,
        custom_type: customType || undefined,
        description: description || 'Sacred Arya Vysya Matha & Temple Initiative.',
        objective: objective || undefined,
        priority,
        is_urgent: isUrgent,
        address,
        city,
        district,
        state,
        pin_code: pinCode,
        has_physical_location: hasPhysicalLocation,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        target_amount: parseFloat(targetAmount || '0'),
        min_donation: parseFloat(minDonation || '100'),
        suggested_amounts: suggestedAmounts
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter(Boolean),
        start_date: startDate,
        end_date: endDate || undefined,
        excess_funds_policy: excessFundsPolicy,
        breakdown_items: breakdownItems
          .filter((b) => b.category.trim() !== '')
          .map((b, idx) => ({
            id: `item-${idx + 1}`,
            category: b.category,
            target_amount: b.target_amount,
            description: b.description,
            order: idx + 1,
          })),
        cover_image: coverImage,
        gallery_images: galleryImages,
        documents: docName ? [{ name: docName, size: '2.4 MB', type: 'PDF' }] : [],
        status: finalStatus,
        scheduled_publish_at: finalStatus === 'SCHEDULED' ? scheduledDateTime : undefined,
        muhurtham_name: finalStatus === 'SCHEDULED' ? muhurthamName : undefined,
        is_teaser_enabled: isTeaserEnabled,
        broadcast_on_publish: broadcastOnPublish,
      });

      showAlert({
        type: 'change',
        title: 'Initiative Created',
        message: `Initiative "${title}" has been saved successfully.`,
      });
      router.push('/admin/super/initiatives');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const parsedTarget = parseFloat(targetAmount || '0');
  const sumBreakdown = breakdownItems.reduce((acc, b) => acc + (b.target_amount || 0), 0);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-24">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/super/initiatives"
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/30">
            Step {currentStep} of 7: {WIZARD_STEPS[currentStep - 1].name}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-200">
          Create New Initiative & Dharma Project
        </h1>
        <p className="text-xs text-stone-400">
          Configure verified temple construction, matha development, and welfare initiatives with itemized transparency and sacred launch scheduling.
        </p>
      </div>

      {/* 7-Step Progress Pill Indicator */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center min-w-[700px] bg-stone-950 p-2 rounded-2xl border border-stone-800">
          {WIZARD_STEPS.map((step, idx) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    // Only allow navigating back or to current
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  disabled={step.id > currentStep}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-devotional-maroon text-amber-200 font-bold border border-amber-400/60 shadow-md'
                      : isDone
                      ? 'text-stone-300 hover:bg-stone-900 cursor-pointer font-medium'
                      : 'text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : step.id}
                  </span>
                  <div className="text-left whitespace-nowrap">
                    <p className="leading-tight text-[11px] font-semibold">{step.name}</p>
                    <p className="text-[9px] text-stone-500">{step.desc}</p>
                  </div>
                </button>
                {idx < WIZARD_STEPS.length - 1 && (
                  <div className="w-4 h-0.5 bg-stone-800 mx-1 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Body */}
      <div className="bg-stone-950 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl space-y-6">
        {/* STEP 1: BASIC INFO */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-lg text-amber-300 border-b border-stone-800 pb-3">
              Step 1: Initiative Overview & Categorization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Full Initiative Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sri Vasavi Moola Mandira Raja Gopuram Construction"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Short Title (For Badges & Mobile Cards)
                </label>
                <input
                  type="text"
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="e.g. Raja Gopuram 2026"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Initiative Type *
                </label>
                <select
                  value={initiativeType}
                  onChange={(e) => setInitiativeType(e.target.value as InitiativeType)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none cursor-pointer"
                >
                  {Object.entries(INITIATIVE_TYPE_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.icon} {val.label}
                    </option>
                  ))}
                </select>
              </div>

              {initiativeType === 'OTHER' && (
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Custom Initiative Type Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. Veda Pathashala Heritage Library"
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Spiritual Purpose & Narrative *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the significance, Agamic inspiration, and blessings of this project..."
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Tangible Deliverables & Community Impact
                </label>
                <textarea
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. Construct a 7-tier Dravidian Gopuram with 12 Panchaloha Kalashams..."
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as InitiativePriority)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none cursor-pointer"
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent Devotee Appeal</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded bg-stone-900 border-stone-800 text-devotional-saffron focus:ring-devotional-saffron cursor-pointer"
                />
                <label htmlFor="urgentCheck" className="text-xs font-bold text-stone-200 flex items-center gap-1.5 cursor-pointer">
                  <Flame className="w-3.5 h-3.5 text-devotional-saffron" /> Mark as Urgent Cause (Highlights on Devotee Home)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-lg text-amber-300 border-b border-stone-800 pb-3">
              Step 2: Physical Location & Site Coordinates
            </h3>

            <div className="flex items-center gap-3 pb-2">
              <input
                type="checkbox"
                id="physLocCheck"
                checked={hasPhysicalLocation}
                onChange={(e) => setHasPhysicalLocation(e.target.checked)}
                className="w-4 h-4 rounded bg-stone-900 border-stone-800 text-devotional-gold focus:ring-devotional-gold cursor-pointer"
              />
              <label htmlFor="physLocCheck" className="text-xs font-bold text-stone-200 cursor-pointer">
                This initiative is tied to a physical temple / land site
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Site / Devasthanam Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Sri Vasavi Kanyaka Parameswari Temple Sanctum Complex"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Postal PIN Code
                </label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  GPS Latitude (Optional)
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 16.5167"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  GPS Longitude (Optional)
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 81.7333"
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIALS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-lg text-amber-300 border-b border-stone-800 pb-3">
              Step 3: Target Sanctions & Financial Policy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Sanctioned Target Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full p-3 pl-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none font-bold font-serif text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Minimum Donation (₹)
                </label>
                <input
                  type="number"
                  value={minDonation}
                  onChange={(e) => setMinDonation(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Preset Suggested Amounts (Comma separated)
              </label>
              <input
                type="text"
                value={suggestedAmounts}
                onChange={(e) => setSuggestedAmounts(e.target.value)}
                placeholder="501, 1001, 2501, 5001, 10001"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Fundraising Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Target Completion Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Surplus / Excess Funds Policy Statement
              </label>
              <textarea
                rows={3}
                value={excessFundsPolicy}
                onChange={(e) => setExcessFundsPolicy(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET BREAKDOWN */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-300">
                  Step 4: Itemized Budget Breakdown
                </h3>
                <p className="text-xs text-stone-400">
                  Provide item-by-item capital allocations to guarantee donor transparency.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBreakdownRow}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1 border border-amber-400/40"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="space-y-3">
              {breakdownItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-stone-900 border border-stone-800 items-center"
                >
                  <div className="sm:col-span-4 space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Category</span>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleBreakdownChange(index, 'category', e.target.value)}
                      placeholder="e.g. Granite Stone Carving"
                      className="w-full p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Amount (₹)</span>
                    <input
                      type="number"
                      value={item.target_amount}
                      onChange={(e) => handleBreakdownChange(index, 'target_amount', e.target.value)}
                      className="w-full p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Description</span>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleBreakdownChange(index, 'description', e.target.value)}
                      placeholder="Scope details..."
                      className="w-full p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-1 text-right sm:text-center pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveBreakdownRow(index)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">Total Itemized Sum:</span>
              <span className="font-serif font-bold text-amber-300 text-sm">
                ₹{sumBreakdown.toLocaleString('en-IN')} / ₹{parsedTarget.toLocaleString('en-IN')} Target
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: MEDIA & DOCUMENTS */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-lg text-amber-300 border-b border-stone-800 pb-3">
              Step 5: Visual Media & Documentation
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Primary Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
              />
              {coverImage && (
                <div className="h-44 w-full rounded-2xl overflow-hidden mt-2 border border-stone-800">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                Architectural Blueprint / Project Estimation Document
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Agamic Structural Blueprint.pdf"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW ALL PRIOR STAGES & MANDATORY CONFIRMATION */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-amber-300">
                Step 6: Comprehensive Multi-Stage Audit Review
              </h3>
              <p className="text-xs text-stone-400">
                Examine all parameters configured across Stages 1 to 5 before unlocking the release protocol.
              </p>
            </div>

            {/* STAGE 1 REVIEW */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Stage 1: Basic Information & Classification
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-[10px] text-stone-400 hover:text-amber-300 underline font-semibold"
                >
                  Edit Stage 1
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-stone-100">{title || 'Untitled Initiative'}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    {INITIATIVE_TYPE_LABELS[initiativeType]?.label || initiativeType}
                  </span>
                  {isUrgent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-950 text-red-400 border border-red-800">
                      Urgent Cause
                    </span>
                  )}
                </div>
                {shortTitle && <p className="text-xs text-stone-400 font-mono">Short Title: {shortTitle}</p>}
                <p className="text-xs text-stone-300 line-clamp-2 pt-1">{description || 'No description provided.'}</p>
                {objective && <p className="text-[11px] text-stone-400 italic">Objective: {objective}</p>}
              </div>
            </div>

            {/* STAGE 2 REVIEW */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Stage 2: Physical Site & GPS Coordinates
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-[10px] text-stone-400 hover:text-amber-300 underline font-semibold"
                >
                  Edit Stage 2
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Site Address</span>
                  <p className="text-stone-200">{address || 'Sanctum Devasthanam'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">City, State & PIN</span>
                  <p className="text-stone-200">{city}, {district ? `${district}, ` : ''}{state} - {pinCode}</p>
                </div>
                {latitude && longitude && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">GPS Geolocation</span>
                    <p className="font-mono text-[11px] text-amber-300">{latitude}° N, {longitude}° E</p>
                  </div>
                )}
              </div>
            </div>

            {/* STAGE 3 REVIEW */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5" /> Stage 3: Sanctioned Target & Policy
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-[10px] text-stone-400 hover:text-amber-300 underline font-semibold"
                >
                  Edit Stage 3
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Target Budget</span>
                  <span className="font-serif font-bold text-amber-400 text-sm">₹{parsedTarget.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Min Donation</span>
                  <span className="font-bold text-stone-200">₹{minDonation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Start Date</span>
                  <span className="text-stone-300">{startDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">End Date</span>
                  <span className="text-stone-300">{endDate || 'Ongoing'}</span>
                </div>
              </div>
              <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/40">
                <span className="font-bold text-stone-300">Excess Funds Policy: </span>
                {excessFundsPolicy}
              </div>
            </div>

            {/* STAGE 4 REVIEW */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5" /> Stage 4: Itemized Budget Breakdown ({breakdownItems.length} Allocations)
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-[10px] text-stone-400 hover:text-amber-300 underline font-semibold"
                >
                  Edit Stage 4
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                {breakdownItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-stone-950 border border-stone-800/60">
                    <span className="font-medium text-stone-200">{item.category || 'Untitled Category'}</span>
                    <span className="font-serif font-bold text-amber-300">₹{(item.target_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STAGE 5 REVIEW */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/60 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Stage 5: Cover Asset & Blueprints
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="text-[10px] text-stone-400 hover:text-amber-300 underline font-semibold"
                >
                  Edit Stage 5
                </button>
              </div>
              <div className="flex items-center gap-4">
                {coverImage && (
                  <div className="w-20 h-14 rounded-xl overflow-hidden border border-stone-700 shrink-0">
                    <img src={coverImage} alt="Thumb" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-stone-200">Sanctioned Document: {docName || 'None'}</p>
                  <p className="text-stone-400 text-[11px]">Certified by Sompura Temple Architect</p>
                </div>
              </div>
            </div>

            {/* MANDATORY CONFIRMATION CHECKBOX */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-2 border-amber-500/60 shadow-xl space-y-3">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isStage6Confirmed}
                  onChange={(e) => setIsStage6Confirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-devotional-gold cursor-pointer shrink-0"
                />
                <div className="space-y-1">
                  <p className="font-serif font-bold text-sm text-amber-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Sacred Trustee Audit & Final Certification
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    I confirm and certify that I have thoroughly audited all 5 stages above. The architectural plans, budget figures, geographic location, and legal transparency policies are verified, approved by the Arya Vysya Matha Trust Board, and ready to proceed to launch scheduling.
                  </p>
                </div>
              </label>

              {!isStage6Confirmed && (
                <p className="text-[11px] text-amber-400/90 flex items-center gap-1 font-semibold pl-8">
                  <AlertCircle className="w-3.5 h-3.5" /> Please check the certification box above to proceed to Stage 7.
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: SCHEDULE & LAUNCH MANAGEMENT (NEW STAGE 7) */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Timer className="w-3 h-3 text-amber-400" /> Stage 7: Launch Protocol
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Muhurtham & Devotee Activation</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-amber-200 mt-1">
                Release Mode & Auspicious Muhurtham Scheduling
              </h3>
              <p className="text-xs text-stone-400">
                Choose whether to release this initiative into the devotee network immediately or schedule an auspicious Vedic Muhurtham.
              </p>
            </div>

            {/* Launch Mode Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Scheduled Auspicious Release */}
              <div
                onClick={() => setLaunchMode('SCHEDULED')}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all space-y-3 ${
                  launchMode === 'SCHEDULED'
                    ? 'bg-devotional-maroon/40 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                    : 'bg-stone-900 border-stone-800 hover:border-stone-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-devotional-saffron" /> Scheduled Auspicious Release
                  </span>
                  <input
                    type="radio"
                    name="launchMode"
                    checked={launchMode === 'SCHEDULED'}
                    onChange={() => setLaunchMode('SCHEDULED')}
                    className="w-4 h-4 text-amber-400 bg-stone-950 border-stone-700 focus:ring-devotional-gold"
                  />
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Release at a sacred Vedic Muhurtham. The system will automatically publish and release to devotees at the exact date and time.
                </p>
                <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Recommended for Temple Projects
                </span>
              </div>

              {/* Option 2: Instant Release */}
              <div
                onClick={() => setLaunchMode('INSTANT')}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all space-y-3 ${
                  launchMode === 'INSTANT'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                    : 'bg-stone-900 border-stone-800 hover:border-stone-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Instant Immediate Release
                  </span>
                  <input
                    type="radio"
                    name="launchMode"
                    checked={launchMode === 'INSTANT'}
                    onChange={() => setLaunchMode('INSTANT')}
                    className="w-4 h-4 text-emerald-400 bg-stone-950 border-stone-700 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Publish immediately right now into the devotee feed, home carousel, and donation gateway without any delay.
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  Ideal for Emergency Relief
                </span>
              </div>
            </div>

            {/* Scheduled Release Configuration Pane */}
            {launchMode === 'SCHEDULED' && (
              <div className="space-y-5 p-5 sm:p-6 rounded-2xl bg-stone-900/90 border border-amber-500/40 shadow-xl">
                <div className="space-y-1 border-b border-stone-800 pb-3">
                  <h4 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-devotional-saffron" /> Auspicious Muhurtham Timing
                  </h4>
                  <p className="text-xs text-stone-400">
                    Pick a sacred Vedic timing preset or configure a custom date and time for automated launch.
                  </p>
                </div>

                {/* 1-Tap Vedic Muhurtham Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    1-Tap Auspicious Muhurtham Presets (IST)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => applyMuhurthamPreset('Brahma Muhurtham', 4, 30, 1)}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400 text-left transition-all group"
                    >
                      <span className="text-[10px] text-amber-400 font-bold block flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400" /> Tomorrow 04:30 AM
                      </span>
                      <p className="font-serif font-bold text-stone-100 text-xs mt-0.5">Brahma Muhurtham</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Vedic creation hour</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyMuhurthamPreset('Abhijit Muhurtham', 11, 45, 1)}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400 text-left transition-all group"
                    >
                      <span className="text-[10px] text-devotional-saffron font-bold block flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-devotional-saffron" /> Tomorrow 11:45 AM
                      </span>
                      <p className="font-serif font-bold text-stone-100 text-xs mt-0.5">Abhijit Muhurtham</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Auspicious for Dharma</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyMuhurthamPreset('Pradosha Sandhya', 18, 0, 1)}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400 text-left transition-all group"
                    >
                      <span className="text-[10px] text-rose-400 font-bold block flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-400" /> Tomorrow 06:00 PM
                      </span>
                      <p className="font-serif font-bold text-stone-100 text-xs mt-0.5">Pradosha Sandhya</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Dusk Aarti hour</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyMuhurthamPreset('Shubha Ekadashi Dawn', 6, 0, 2)}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-400 text-left transition-all group"
                    >
                      <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1">
                        <Moon className="w-3 h-3 text-emerald-400" /> In 2 Days 06:00 AM
                      </span>
                      <p className="font-serif font-bold text-stone-100 text-xs mt-0.5">Shubha Ekadashi Dawn</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Lord Vishnu & Matha</p>
                    </button>
                  </div>
                </div>

                {/* Custom Date & Time Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Scheduled Launch Timestamp (IST) *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Muhurtham / Occasion Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={muhurthamName}
                      onChange={(e) => setMuhurthamName(e.target.value)}
                      placeholder="e.g. Brahma Muhurtham / Sri Vasavi Jayanthi"
                      className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:ring-2 focus:ring-devotional-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Devotional Features Toggle Strip */}
                <div className="pt-3 border-t border-stone-800/80 space-y-3 text-xs">
                  {/* Feature 1: Pre-Launch Teaser */}
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-stone-700">
                    <input
                      type="checkbox"
                      checked={isTeaserEnabled}
                      onChange={(e) => setIsTeaserEnabled(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-stone-900 border-stone-700 text-devotional-gold focus:ring-devotional-gold cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-stone-200 flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-devotional-saffron" /> Show Pre-Launch Muhurtham Countdown Teaser to Devotees
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Devotees will see an auspicious countdown clock on the initiatives catalog with the upcoming release time and a reminder alert.
                      </p>
                    </div>
                  </label>

                  {/* Feature 2: Automated Broadcast */}
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-stone-700">
                    <input
                      type="checkbox"
                      checked={broadcastOnPublish}
                      onChange={(e) => setBroadcastOnPublish(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-stone-900 border-stone-700 text-devotional-gold focus:ring-devotional-gold cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-stone-200 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-emerald-400" /> Automated Devotee Broadcast Notification Upon Release
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Automatically trigger push notification, SMS, and WhatsApp announcement to devotee community when the release time strikes.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls Strip */}
        <div className="flex items-center justify-between pt-6 border-t border-stone-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:text-white text-xs font-bold active:scale-95 transition-all"
            >
              Back
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {/* Steps 1 to 5: Standard Next */}
            {currentStep < 6 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-saffron to-amber-600 text-white text-xs font-bold shadow-gold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Step 6: Proceed to Stage 7 (Locked behind confirmation checkbox) */}
            {currentStep === 6 && (
              <button
                type="button"
                disabled={!isStage6Confirmed}
                onClick={() => setCurrentStep(7)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-gold active:scale-95 transition-all flex items-center gap-1.5 ${
                  isStage6Confirmed
                    ? 'bg-gradient-to-r from-devotional-saffron to-amber-500 text-white hover:brightness-110 cursor-pointer shadow-lg'
                    : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                }`}
              >
                Proceed to Stage 7 (Launch & Scheduling) <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Step 7: Final Action (Save Draft / Schedule / Publish Now) */}
            {currentStep === 7 && (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinalSubmit('DRAFT')}
                  className="px-4 py-2.5 rounded-xl border border-stone-700 hover:border-amber-400 text-stone-300 text-xs font-bold active:scale-95 transition-all"
                >
                  Save Draft
                </button>

                {launchMode === 'SCHEDULED' ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleFinalSubmit('SCHEDULED')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-devotional-saffron to-amber-500 text-white text-xs font-bold shadow-gold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 border border-amber-300/40"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Scheduling...' : 'Schedule Release'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleFinalSubmit('PUBLISHED')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-devotional-maroon via-red-800 to-devotional-maroon text-white text-xs font-bold shadow-gold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 border border-amber-300/40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {isSubmitting ? 'Publishing...' : 'Publish Now'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
