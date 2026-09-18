'use client';

import React, { useState } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RoiCostCalculator() {
  const [practitioners, setPractitioners] = useState<number>(4);
  const [consultsPerDay, setConsultsPerDay] = useState<number>(12);
  const [hourlyBillable, setHourlyBillable] = useState<number>(140); // $140 AUD/hr allied health avg
  const [workingDays, setWorkingDays] = useState<number>(22);

  // Time savings: 11 mins saved per consult (from 12 mins manual typing down to ~1 min AI SOAP review)
  const minsSavedPerConsult = 11;
  const totalConsultsPerMonth = practitioners * consultsPerDay * workingDays;
  const totalHoursSavedMonth = Math.round((totalConsultsPerMonth * minsSavedPerConsult) / 60);

  // Economic value of reclaimed clinical hours
  const monthlyReclaimedValue = totalHoursSavedMonth * hourlyBillable;

  // Patient recall revenue recovery (conservative: ~3 recovered lapsed care plans per practitioner/month @ $120 AUD follow-up)
  const monthlyRecallRevenue = practitioners * 3 * 120;

  // Infrastructure AI API costs (OpenAI gpt-4o-mini is ~$0.15 / 1M input + $0.60 / 1M output)
  // ~800 tokens per consult = $0.0003 AUD per consult
  const monthlyAiCost = +(totalConsultsPerMonth * 0.00035).toFixed(2);
  const monthlyHostingCost = 20.0; // Vercel / serverless runtime
  const totalOperatingCost = +(monthlyHostingCost + monthlyAiCost).toFixed(2);

  const netMonthlyBenefit = Math.round(monthlyReclaimedValue + monthlyRecallRevenue - totalOperatingCost);

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
              <Calculator className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Practice Economics &amp; ROI
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              Clinical Time Reclaimed &bull; Micro-Cent LLM Infrastructure
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Clinical ROI &amp; API Operating Cost Audit
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            Calculates practitioner time saved on SOAP treatment documentation, lapsed care plan recall recovery, and exact LLM token infrastructure costs.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-3.5 py-2 text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] font-mono block">
            Net Monthly Value
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
            +${netMonthlyBenefit.toLocaleString()} AUD
          </span>
        </div>
      </div>

      {/* Interactive Controls & Calculation Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Sliders (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono flex items-center gap-2">
              <span>Practice Operating Metrics</span>
            </h3>

            {/* Slider 1: Practitioners */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[var(--color-text-secondary)]">Active Practitioners:</span>
                <strong className="text-[var(--color-text-primary)] font-bold">{practitioners} clinicians</strong>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={practitioners}
                onChange={(e) => setPractitioners(Number(e.target.value))}
                className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono mt-1">
                <span>1 solo</span>
                <span>4 clinic</span>
                <span>12 multi-site</span>
              </div>
            </div>

            {/* Slider 2: Consults per day */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[var(--color-text-secondary)]">Consultations / Clinician / Day:</span>
                <strong className="text-[var(--color-text-primary)] font-bold">{consultsPerDay} consults</strong>
              </div>
              <input
                type="range"
                min="6"
                max="20"
                value={consultsPerDay}
                onChange={(e) => setConsultsPerDay(Number(e.target.value))}
                className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono mt-1">
                <span>6 light</span>
                <span>12 standard</span>
                <span>20 high volume</span>
              </div>
            </div>

            {/* Slider 3: Hourly billable rate */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[var(--color-text-secondary)]">Clinician Hourly Value:</span>
                <strong className="text-[var(--color-text-primary)] font-bold">${hourlyBillable} AUD/hr</strong>
              </div>
              <input
                type="range"
                min="100"
                max="220"
                step="10"
                value={hourlyBillable}
                onChange={(e) => setHourlyBillable(Number(e.target.value))}
                className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-mono mt-1">
                <span>$100 AUD</span>
                <span>$140 AUD (Sydney Avg)</span>
                <span>$220 AUD</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
            <span>Total Monthly Patient Consultations:</span>
            <span className="font-bold text-[var(--color-text-primary)]">
              {totalConsultsPerMonth.toLocaleString()} consults / mo
            </span>
          </div>
        </div>

        {/* Right: Itemized Economics Output (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Card 1: Time Reclaimed */}
          <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 font-mono">
                  Clinical Documentation Reclaimed
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-teal-900 dark:text-teal-100">
                {totalHoursSavedMonth} hrs / mo
              </span>
            </div>
            <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">
              Saves {minsSavedPerConsult} minutes per patient note. Practitioners finish all notes during sessions rather than typing at night.
            </p>
            <div className="mt-2 text-right font-mono text-sm font-extrabold text-teal-800 dark:text-teal-200">
              Value: +${monthlyReclaimedValue.toLocaleString()} AUD / mo
            </div>
          </div>

          {/* Card 2: Recall Recovery */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 font-mono">
                  Lapsed Patient Recall Recovery
                </span>
              </div>
              <span className="text-sm font-bold font-mono text-purple-900 dark:text-purple-100">
                +{practitioners * 3} consults / mo
              </span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
              Automated clinical SMS reactivates dropped EPC care plans and post-injury patients before condition relapse.
            </p>
            <div className="mt-2 text-right font-mono text-sm font-extrabold text-purple-800 dark:text-purple-200">
              Value: +${monthlyRecallRevenue.toLocaleString()} AUD / mo
            </div>
          </div>

          {/* Card 3: Exact Micro-Cost */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-secondary)]">AI Inference Cost (OpenAI GPT-4o-mini):</span>
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">
              ${monthlyAiCost} AUD / mo (${(monthlyAiCost / totalConsultsPerMonth).toFixed(4)}/consult)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
