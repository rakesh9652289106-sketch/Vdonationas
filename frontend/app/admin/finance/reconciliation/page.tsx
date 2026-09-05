'use client';

import React, { useState } from 'react';
import { MOCK_RECONCILIATION, MOCK_OFFLINE_DONATIONS } from '@/lib/mock-data';
import { TrendingUp, Plus, FileSpreadsheet, DollarSign, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useConfirmAlert } from '@/lib/confirm-alert-context';

export default function FinanceReconciliationPage() {
  const { t } = useLanguage();
  const { confirmAction, showAlert } = useConfirmAlert();
  const [offlineList, setOfflineList] = useState(MOCK_OFFLINE_DONATIONS);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  // New offline form state
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'CASH' | 'CHEQUE' | 'BANK_TRANSFER'>('CASH');
  const [refNo, setRefNo] = useState('');
  const [notes, setNotes] = useState('');

  const handleRecordOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) return;

    const parsedAmt = parseFloat(amount);
    const confirmed = await confirmAction({
      title: 'Record Offline Seva Donation?',
      message: `Confirm recording ₹${parsedAmt.toLocaleString('en-IN')} received via ${method} from ${donorName}? This entry will be reconciled in the temple accounts ledger.`,
      confirmText: 'Record Entry',
      variant: 'change',
    });
    if (!confirmed) return;

    const newRec = {
      id: `off-${Date.now()}`,
      templeId: 'tpl-penugonda-01',
      templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
      donorName,
      amount: parsedAmt,
      paymentMethod: method,
      referenceNo: refNo || 'OFFLINE-MANUAL-REC',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'Financial Controller',
      notes,
    };

    setOfflineList([newRec, ...offlineList]);
    setDonorName('');
    setAmount('');
    setNotes('');
    setShowOfflineModal(false);
    showAlert({
      type: 'change',
      title: 'Offline Donation Recorded',
      message: `₹${parsedAmt.toLocaleString('en-IN')} entry successfully added to offline ledger.`,
    });
  };

  const handleExportCSV = () => {
    showAlert({
      type: 'info',
      title: 'Reconciliation Report Exported',
      message: 'Financial Reconciliation Report exported as CSV / Excel format.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* 3D DEVOTIONAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-emerald-500/60 relative overflow-hidden diya-glow-pulse">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-400/40">
            <DollarSign className="w-4 h-4 text-emerald-400" /> {t('sidebarBankReconciliation')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {t('sidebarBankReconciliation')}
          </h1>
          <p className="text-emerald-100/80 text-xs">
            Gateway Settlements, Offline Hundi Cash / Cheque Records & Reconciliation Audit
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-emerald-400/40 text-emerald-300 font-bold text-xs hover:bg-emerald-400/20 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button
            onClick={() => setShowOfflineModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Record Offline Hundi Cash
          </button>
        </div>
      </div>

      {/* 3D RECONCILIATION SUMMARY MATRIX CARD */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-500/40 p-6 shadow-2xl space-y-4 hover:border-emerald-400 transition-all">
        <h3 className="font-serif font-bold text-xl text-emerald-950 dark:text-amber-400">
          Payment Gateway Settlement Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Donation ID</th>
                <th className="p-3.5">Temple Shrine</th>
                <th className="p-3.5">Internal Amount</th>
                <th className="p-3.5">Gateway Amount</th>
                <th className="p-3.5">Actual Settlement</th>
                <th className="p-3.5">Difference / Fee</th>
                <th className="p-3.5">Reconciliation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {MOCK_RECONCILIATION.map((r) => (
                <tr key={r.id} className="hover:bg-emerald-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-900 dark:text-amber-400">
                    {r.donationId}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{r.templeName}</td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">₹{r.internalAmount}</td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">₹{r.gatewayAmount}</td>
                  <td className="p-3.5 font-bold text-emerald-600">₹{r.actualSettlement}</td>
                  <td className="p-3.5 text-stone-500">₹{r.difference} (1% Fee)</td>
                  <td className="p-3.5">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D OFFLINE DONATIONS TABLE CARD */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-500/40 p-6 shadow-2xl space-y-4 hover:border-emerald-400 transition-all">
        <h3 className="font-serif font-bold text-xl text-emerald-950 dark:text-amber-400">
          Audited Offline Cash & Cheque Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Donor Name</th>
                <th className="p-3.5">Temple</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Mode</th>
                <th className="p-3.5">Reference / Counter</th>
                <th className="p-3.5">Recorded By</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {offlineList.map((off) => (
                <tr key={off.id} className="hover:bg-emerald-50/60 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">{off.donorName}</td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">{off.templeName}</td>
                  <td className="p-3.5 font-bold text-emerald-700 dark:text-amber-400 text-base">
                    ₹{off.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-semibold text-stone-800 dark:text-stone-200">{off.paymentMethod}</td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-400">{off.referenceNo || 'N/A'}</td>
                  <td className="p-3.5 text-stone-500">{off.recordedBy}</td>
                  <td className="p-3.5 text-stone-500">{off.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-stone-900 border-2 border-emerald-500/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-emerald-950 dark:text-amber-400">
              Record Offline Cash / Cheque Donation
            </h3>
            <form onSubmit={handleRecordOffline} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Donor Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subba Rao"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Amount (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={method}
                    onChange={(e: any) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    <option value="CASH">CASH (Hundi)</option>
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Reference / Counter #
                  </label>
                  <input
                    type="text"
                    placeholder="Counter #1"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Auditor Notes
                </label>
                <input
                  type="text"
                  placeholder="Notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfflineModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Save & Audit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
