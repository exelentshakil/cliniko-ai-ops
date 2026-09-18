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

const DEFAULT_SMS = `Hi Michael, it's Chris from the clinic. Checking in on how your cervical radiculopathy & neck stiffness is tracking since your session 19 days ago. To prevent flare-ups and complete your rehabilitation goals, click here to book your follow-up review: https://cliniko.io/book/michael`;

export function PatientRecallEngine() {
  const [patients, setPatients] = useState<RecallPatient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<RecallPatient>(INITIAL_PATIENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string>(DEFAULT_SMS);
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
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 text-xs font-bold text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800 whitespace-nowrap shrink-0">
              <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              Patient Recall &amp; Reactivation
            </span>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0">
              Care Plan Retention Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Automated Patient Follow-Up &amp; Care Plan Recovery
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            Scans Cliniko appointment histories to flag patients who dropped off before finishing their prescribed care plans (e.g. Medicare EPC). AI crafts empathetic re-engagement SMS with 1-click booking links to recover unbooked consultations.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 p-3 px-4 shrink-0 shadow-2xs">
          <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="font-mono">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-extrabold uppercase tracking-wider">
              Recoverable Pipeline
            </div>
            <div className="text-lg font-black text-emerald-900 dark:text-emerald-100 leading-none mt-0.5">
              ${totalRecoverableRevenue.toLocaleString()} AUD
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Patient List Table (7 cols) + AI SMS Dispatcher (5 cols) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Recall Radar Table */}
        <div className="lg:col-span-7 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-surface)] overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Patients Requiring Follow-Up ({patients.length})
            </span>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
              Cliniko Status: Lapsed Care Plan
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {patients.map((p) => {
              const isSelected = selectedPatient.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-l-4 border-l-purple-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {p.name}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                        {p.lastVisitDays}d lapsed
                      </span>
                      {p.sent && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-800">
                          ✓ DISPATCHED
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {p.condition}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      <span>Plan: {p.totalConsults}/{p.treatmentPlanTarget} completed</span>
                      <span>&bull;</span>
                      <span>Practitioner: {p.practitioner}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono font-black text-emerald-700 dark:text-emerald-400">
                      +${p.revenueAtRisk} AUD
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-bold">
                      Unbooked Value
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Re-Engagement Message Generator */}
        <div className="lg:col-span-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
                  Cliniko SMS Re-Engagement Draft
                </h3>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAiMessage}
                disabled={isGenerating}
                className="h-8 text-xs font-bold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-purple-600 dark:text-purple-400" />
                <span>{isGenerating ? 'Drafting...' : 'AI Re-Draft'}</span>
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                <span>Target: <strong>{selectedPatient.name}</strong></span>
                <span>Days Lapsed: <strong className="text-amber-700 dark:text-amber-300 font-bold">{selectedPatient.lastVisitDays} days</strong></span>
              </div>

              <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-3.5 shadow-2xs">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono block mb-2">
                  Personalized SMS Message:
                </label>
                <textarea
                  rows={6}
                  value={activeMessage}
                  onChange={(e) => setActiveMessage(e.target.value)}
                  className="w-full text-xs font-mono bg-transparent border-0 text-slate-900 dark:text-slate-100 focus:ring-0 resize-none leading-relaxed p-0 font-medium"
                />
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                  <span>Chars: {activeMessage.length} (1 SMS segment)</span>
                  <span className="text-teal-700 dark:text-teal-400">1-Click Booking Link Inlined</span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-3 text-xs font-mono text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Anticipated Revenue Recovery:</span>
                  <strong className="font-extrabold text-sm">+${selectedPatient.revenueAtRisk} AUD</strong>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                  Direct sync to Cliniko SMS Gateway or Twilio webhook via POST /v1/recalls.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800">
            <Button
              size="sm"
              onClick={handleDispatchSms}
              disabled={isDispatched || !activeMessage}
              className="w-full h-9 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
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
