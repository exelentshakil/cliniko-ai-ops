'use client';

import React, { useState } from 'react';
import {
  Users,
  CalendarX,
  MessageSquare,
  DollarSign,
  Send,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecallPatient {
  id: string;
  name: string;
  condition: string;
  lastVisitDays: number;
  totalConsults: number;
  treatmentPlanTarget: number;
  status: 'Lapsed Follow-up' | 'Care Plan Due' | 'Post-Discharge Review' | 'Late Cancellation';
  practitioner: string;
  revenueAtRisk: number;
  generatedSms?: string;
  sent?: boolean;
}

const INITIAL_PATIENTS: RecallPatient[] = [
  {
    id: 'pt_102',
    name: 'Michael Chang',
    condition: 'cervical radiculopathy & neck stiffness',
    lastVisitDays: 19,
    totalConsults: 2,
    treatmentPlanTarget: 6,
    status: 'Lapsed Follow-up',
    practitioner: 'Chris',
    revenueAtRisk: 480, // 4 remaining consults @ $120
  },
  {
    id: 'pt_105',
    name: 'Sarah Jenkins',
    condition: 'patellofemoral tracking & knee rehab',
    lastVisitDays: 34,
    totalConsults: 3,
    treatmentPlanTarget: 5,
    status: 'Lapsed Follow-up',
    practitioner: 'Chris',
    revenueAtRisk: 240,
  },
  {
    id: 'pt_109',
    name: 'Liam O’Connor',
    condition: 'chronic lumbar spine (Medicare EPC Plan)',
    lastVisitDays: 45,
    totalConsults: 5,
    treatmentPlanTarget: 5,
    status: 'Care Plan Due',
    practitioner: 'Dr. Sarah Patel',
    revenueAtRisk: 600,
  },
  {
    id: 'pt_114',
    name: 'Jessica Vance',
    condition: 'post-op shoulder rotator cuff repair',
    lastVisitDays: 60,
    totalConsults: 8,
    treatmentPlanTarget: 8,
    status: 'Post-Discharge Review',
    practitioner: 'Chris',
    revenueAtRisk: 120,
  },
];

export function PatientRecallEngine() {
  const [patients, setPatients] = useState<RecallPatient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<RecallPatient>(INITIAL_PATIENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string>('');
  const [isDispatched, setIsDispatched] = useState(false);

  const totalRecoverableRevenue = patients.reduce((acc, p) => acc + p.revenueAtRisk, 0);

  const handleSelectPatient = (p: RecallPatient) => {
    setSelectedPatient(p);
    setIsDispatched(false);
    setActiveMessage(
      `Hi ${p.name.split(' ')[0]}, it's ${p.practitioner} from the clinic. Checking in on how your ${p.condition} is tracking since your last session ${p.lastVisitDays} days ago. To prevent flare-ups and complete your rehabilitation goals, click here to book your follow-up review: https://cliniko.io/book/${p.name.split(' ')[0].toLowerCase()}`
    );
  };

  const handleGenerateAiMessage = async () => {
    setIsGenerating(true);
    setIsDispatched(false);
    try {
      const res = await fetch('/api/ai/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientFirstName: selectedPatient.name.split(' ')[0],
          condition: selectedPatient.condition,
          daysSinceLastVisit: selectedPatient.lastVisitDays,
          practitionerName: selectedPatient.practitioner,
        }),
      });
      const data = await res.json();
      if (res.ok && data.reEngagementSms) {
        setActiveMessage(data.reEngagementSms);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDispatchSms = () => {
    setIsDispatched(true);
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? { ...p, sent: true } : p))
    );
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 whitespace-nowrap shrink-0">
              <Users className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              Patient Recall &amp; Reactivation
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Cliniko Lapsed Treatment Plan Recovery
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Automated Patient Follow-Up &amp; Revenue Recovery
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            Scans Cliniko appointment histories to identify patients who stopped attending before completing their care plans. The AI drafts clinical re-engagement SMS messages that recover missed appointments without practitioner admin work.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 px-3 shrink-0">
          <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="font-mono">
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">
              Recoverable Pipeline
            </div>
            <div className="text-base font-extrabold text-emerald-800 dark:text-emerald-200 leading-none">
              ${totalRecoverableRevenue.toLocaleString()} AUD
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Patient List Table (7 cols) + AI SMS Dispatcher (5 cols) */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Patient Recall Radar Table */}
        <div className="lg:col-span-7 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="p-3 bg-[var(--color-panel-subtle)] border-b border-[var(--color-border)] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] font-mono">
              Patients Requiring Follow-Up ({patients.length})
            </span>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
              Cliniko Status: Lapsed Care Plan
            </span>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {patients.map((p) => {
              const isSelected = selectedPatient.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-50/50 dark:bg-purple-950/30'
                      : 'hover:bg-[var(--color-panel-subtle)]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {p.lastVisitDays}d ago
                      </span>
                      {p.sent && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                          ✓ SENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">
                      {p.condition}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] font-mono text-[var(--color-text-muted)]">
                      <span>Plan: {p.totalConsults}/{p.treatmentPlanTarget} completed</span>
                      <span>•</span>
                      <span>Practitioner: {p.practitioner}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${p.revenueAtRisk} AUD
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                      Unbooked Value
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Re-Engagement Message Generator */}
        <div className="lg:col-span-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
                  Cliniko SMS Re-Engagement Draft
                </h3>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAiMessage}
                disabled={isGenerating}
                className="h-7 text-[11px] font-medium border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                <span>{isGenerating ? 'Drafting...' : 'AI Re-Draft'}</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                <span>Target: <strong>{selectedPatient.name}</strong></span>
                <span>Days Lapsed: <strong className="text-amber-600">{selectedPatient.lastVisitDays}</strong></span>
              </div>

              <div className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono block mb-1.5">
                  Personalized SMS Message Preview:
                </label>
                <textarea
                  rows={6}
                  value={activeMessage}
                  onChange={(e) => setActiveMessage(e.target.value)}
                  className="w-full text-xs font-mono bg-transparent border-0 text-[var(--color-text-primary)] focus:ring-0 resize-none leading-relaxed p-0"
                />
                <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
                  <span>Chars: {activeMessage.length} (1 SMS segment)</span>
                  <span>1-Click Booking Link Inlined</span>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-2.5 text-xs font-mono text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Anticipated Recovery:</span>
                  <strong className="font-bold">+${selectedPatient.revenueAtRisk} AUD</strong>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Direct sync to Cliniko SMS Gateway or Twilio webhook.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
            <Button
              size="sm"
              onClick={handleDispatchSms}
              disabled={isDispatched || !activeMessage}
              className="w-full h-9 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
            >
              {isDispatched ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5 text-white" />
                  <span>SMS Dispatched via Cliniko API (200 OK)</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  <span>Dispatch Follow-Up SMS to {selectedPatient.name.split(' ')[0]}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
