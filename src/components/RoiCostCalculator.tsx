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
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 text-xs font-bold text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 whitespace-nowrap shrink-0">
              <Calculator className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Clinical ROI
            </span>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0">
              Practice Economics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Clinical ROI Engine
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Practitioner hours saved, revenue recovered, and exact LLM token infrastructure costs.
          </p>
        </div>

        <div className="rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 p-3 px-4 text-right shrink-0 shadow-2xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-300 font-mono block">
            Net Monthly Practice Value
          </span>
          <span className="text-xl sm:text-2xl font-black text-teal-900 dark:text-teal-100 font-mono">
            +${netMonthlyBenefit.toLocaleString()} AUD
          </span>
        </div>
      </div>

      {/* Interactive Controls & Calculation Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Sliders (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-5 space-y-5 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono flex items-center gap-2">
              <span>Practice Operating Metrics</span>
            </h3>

            {/* Slider 1: Practitioners */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Active Practitioners:</span>
                <strong className="text-slate-900 dark:text-slate-100 font-black text-sm">{practitioners} clinicians</strong>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={practitioners}
                onChange={(e) => setPractitioners(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1.5 font-medium">
                <span>1 solo</span>
                <span>4 clinic</span>
                <span>12 multi-site</span>
              </div>
            </div>

            {/* Slider 2: Consults per day */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Consultations / Clinician / Day:</span>
                <strong className="text-slate-900 dark:text-slate-100 font-black text-sm">{consultsPerDay} consults</strong>
              </div>
              <input
                type="range"
                min="6"
                max="20"
                value={consultsPerDay}
                onChange={(e) => setConsultsPerDay(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1.5 font-medium">
                <span>6 light</span>
                <span>12 standard</span>
                <span>20 high volume</span>
              </div>
            </div>

            {/* Slider 3: Hourly billable rate */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Clinician Hourly Value:</span>
                <strong className="text-slate-900 dark:text-slate-100 font-black text-sm">${hourlyBillable} AUD/hr</strong>
              </div>
              <input
                type="range"
                min="100"
                max="220"
                step="10"
                value={hourlyBillable}
                onChange={(e) => setHourlyBillable(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1.5 font-medium">
                <span>$100 AUD</span>
                <span>$140 AUD (Sydney Avg)</span>
                <span>$220 AUD</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-surface)] p-3.5 flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
            <span className="font-semibold">Total Monthly Patient Consultations:</span>
            <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
              {totalConsultsPerMonth.toLocaleString()} consults / mo
            </span>
          </div>
        </div>

        {/* Right: Itemized Economics Output (6 cols) */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Card 1: Time Reclaimed */}
          <div className="rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-900 dark:text-teal-200 font-mono">
                  Clinical Documentation Reclaimed
                </span>
              </div>
              <span className="text-sm font-black font-mono text-teal-950 dark:text-teal-100">
                {totalHoursSavedMonth} hrs / mo
              </span>
            </div>
            <p className="text-xs font-medium text-teal-800 dark:text-teal-300 mt-1.5 leading-relaxed">
              Saves {minsSavedPerConsult} minutes per patient note. Practitioners finish all notes during sessions rather than typing at night.
            </p>
            <div className="mt-2.5 pt-2 border-t border-teal-200 dark:border-teal-800/80 text-right font-mono text-sm font-black text-teal-950 dark:text-teal-100">
              Reclaimed Value: +${monthlyReclaimedValue.toLocaleString()} AUD / mo
            </div>
          </div>

          {/* Card 2: Recall Recovery */}
          <div className="rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900 dark:text-purple-200 font-mono">
                  Lapsed Patient Recall Recovery
                </span>
              </div>
              <span className="text-sm font-black font-mono text-purple-950 dark:text-purple-100">
                +{practitioners * 3} consults / mo
              </span>
            </div>
            <p className="text-xs font-medium text-purple-800 dark:text-purple-300 mt-1.5 leading-relaxed">
              Automated clinical SMS reactivates dropped EPC care plans and post-injury patients before condition relapse.
            </p>
            <div className="mt-2.5 pt-2 border-t border-purple-200 dark:border-purple-800/80 text-right font-mono text-sm font-black text-purple-950 dark:text-purple-100">
              Recovered Revenue: +${monthlyRecallRevenue.toLocaleString()} AUD / mo
            </div>
          </div>

          {/* Card 3: Exact Micro-Cost */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-surface)] p-3.5 flex items-center justify-between text-xs font-mono shadow-2xs">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-slate-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">AI Inference Cost (OpenAI GPT-4o-mini):</span>
            </div>
            <span className="font-black text-slate-900 dark:text-slate-100">
              ${monthlyAiCost} AUD / mo (${(monthlyAiCost / totalConsultsPerMonth).toFixed(4)}/consult)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
