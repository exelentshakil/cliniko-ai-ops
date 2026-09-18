'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  Cpu,
  Zap,
  TrendingUp,
  ShieldCheck,
  Stethoscope,
  Clock,
  Server,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

// ==========================================
// 1. CLINIKO RATE-LIMIT DEFENSE (AreaChart)
// ==========================================
const rateConfig = {
  calls: {
    label: 'Cliniko v1 Calls (per min)',
    color: '#0d9488',
  },
  limit: {
    label: 'Token-Bucket Ceiling',
    color: '#0f766e',
  },
} satisfies ChartConfig;

const rateData = [
  { t: '11:00', calls: 42, ceiling: 150 },
  { t: '11:05', calls: 68, ceiling: 150 },
  { t: '11:10', calls: 94, ceiling: 150 },
  { t: '11:15', calls: 118, ceiling: 150 },
  { t: '11:20', calls: 104, ceiling: 150 },
  { t: '11:25', calls: 86, ceiling: 150 },
  { t: '11:30', calls: 112, ceiling: 150 },
  { t: '11:35', calls: 124, ceiling: 150 },
  { t: '11:40', calls: 98, ceiling: 150 },
  { t: '11:45', calls: 82, ceiling: 150 },
  { t: '11:50', calls: 90, ceiling: 150 },
];

// ==========================================
// 2. DOCUMENTATION SPEEDUP (Horizontal BarChart)
// ==========================================
const docConfig = {
  mins: {
    label: 'Documentation Time (mins)',
    color: '#0d9488',
  },
} satisfies ChartConfig;

const docData = [
  { method: 'Manual Typing', mins: 12.0, display: '12.0m', fill: '#f43f5e', sub: 'Typing between consults' },
  { method: 'Basic Dictation', mins: 4.5, display: '4.5m', fill: '#f59e0b', sub: 'Raw audio transcribing' },
  { method: 'ClinikoOps AI', mins: 0.8, display: '48s', fill: '#0d9488', sub: 'Full SOAP note formatted' },
  { method: 'Cliniko Sync', mins: 0.2, display: '12s', fill: '#0284c7', sub: '1-click API writeback' },
];

// ==========================================
// 3. APP 11 HEALTHCARE PRIVACY (Donut Chart)
// ==========================================
const piiConfig = {
  medicare: { label: 'Medicare Cards (48%)', color: '#0d9488' },
  phones: { label: 'AU Phones (28%)', color: '#6366f1' },
  dobs: { label: 'DOB & Details (18%)', color: '#f59e0b' },
  injections: { label: 'Prompt Defenses (6%)', color: '#ec4899' },
} satisfies ChartConfig;

const piiData = [
  { name: 'Medicare AU', value: 48, fill: '#0d9488' },
  { name: 'AU Phones', value: 28, fill: '#6366f1' },
  { name: 'DOB Dates', value: 18, fill: '#f59e0b' },
  { name: 'Prompt Defenses', value: 6, fill: '#ec4899' },
];

// ==========================================
// 4. PATIENT RECALL RETENTION (Multi-Line Chart)
// ==========================================
const recallConfig = {
  automated: {
    label: 'With ClinikoOps Recall (91%)',
    color: '#0d9488',
  },
  standard: {
    label: 'Standard Practice (54%)',
    color: '#f43f5e',
  },
} satisfies ChartConfig;

const recallData = [
  { visit: 'Visit 1', automated: 100, standard: 100 },
  { visit: 'Visit 2', automated: 98, standard: 82 },
  { visit: 'Visit 3', automated: 95, standard: 68 },
  { visit: 'Visit 4', automated: 93, standard: 59 },
  { visit: 'Visit 5', automated: 92, standard: 55 },
  { visit: 'Visit 6', automated: 91, standard: 54 },
];

// ==========================================
// 5. DUAL-PROVIDER LATENCY & FAILOVER (BarChart)
// ==========================================
const aiConfig = {
  latency: {
    label: 'Latency (ms)',
    color: '#0d9488',
  },
} satisfies ChartConfig;

const aiData = [
  { provider: 'GPT-4o-mini', latency: 420, share: 'Primary', fill: '#0d9488' },
  { provider: 'Gemini Flash', latency: 260, share: 'Failover', fill: '#6366f1' },
  { provider: 'Deterministic', latency: 8, share: 'Offline Rule', fill: '#0284c7' },
];

// ==========================================
// 6. CLINIKO SYNC STAGES (BarChart)
// ==========================================
const pipelineConfig = {
  duration: {
    label: 'Duration (s)',
    color: '#0d9488',
  },
} satisfies ChartConfig;

const pipelineData = [
  { stage: 'Ingest', duration: 0.15, fill: '#0d9488' },
  { stage: 'Firewall', duration: 0.04, fill: '#0d9488' },
  { stage: 'AI SOAP', duration: 1.12, fill: '#0d9488' },
  { stage: 'Verify', duration: 0.01, fill: '#0d9488' },
  { stage: 'Cliniko', duration: 0.38, fill: '#0284c7' },
];

export function BentoGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* CARD 1: Cliniko Token-Bucket Rate Limiter */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Cliniko v1 Token-Bucket Ingestion
              </span>
              <div className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>Zero 429 Errors</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                124 req/min
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                Ceiling: 150 req/min
              </span>
            </div>
          </div>

          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={rateConfig} className="aspect-auto h-[85px] w-full">
                <AreaChart
                  data={rateData}
                  margin={{ top: 6, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <ChartTooltip
                    cursor={{ stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '2 2' }}
                    content={<ChartTooltipContent hideLabel indicator="dot" />}
                  />
                  <ReferenceLine y={150} stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="#0d9488"
                    strokeWidth={2}
                    fill="url(#rateGrad)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Algorithm: Leaky Bucket</span>
            <span>Retry: Exp Backoff</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Headroom: +26 req</span>
          </div>
        </div>

        {/* CARD 2: Documentation Time Reduction */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Documentation Time Reduction
              </span>
              <div className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                <TrendingUp className="h-3 w-3" />
                <span>15x Faster Notes</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                48 seconds
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                down from 12 mins
              </span>
            </div>
          </div>

          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={docConfig} className="aspect-auto h-[85px] w-full">
                <BarChart
                  data={docData}
                  layout="vertical"
                  margin={{ top: 2, right: 12, left: 2, bottom: 2 }}
                >
                  <XAxis type="number" hide domain={[0, 14]} />
                  <YAxis
                    dataKey="method"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                    tick={{ fontSize: 9, fill: 'currentColor' }}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="mins" radius={[0, 4, 4, 0]}>
                    {docData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Per Consult: -11 mins</span>
            <span>Daily: ~2.2 hrs saved</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Zero Clinician Burnout</span>
          </div>
        </div>

        {/* CARD 3: APP 11 Healthcare Privacy Firewall */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                APP 11 &amp; HIPAA Privacy Firewall
              </span>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                <ShieldCheck className="h-3 w-3" />
                <span>100% Redacted</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                0 Leaked PII
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                Australia Privacy Act 1988
              </span>
            </div>
          </div>

          <div className="mt-3 h-[85px] w-full flex items-center justify-center">
            {mounted ? (
              <ChartContainer config={piiConfig} className="aspect-auto h-[85px] w-full">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={piiData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={24}
                    outerRadius={38}
                    paddingAngle={3}
                  >
                    {piiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Medicare Regex: Active</span>
            <span>AU Phone: Masked</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Securiti Cert Verified</span>
          </div>
        </div>

        {/* CARD 4: Patient Care Plan Completion Rate */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Care Plan Retention &amp; Recovery
              </span>
              <div className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                <Users className="h-3 w-3" />
                <span>+37% Adherence</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                91.2%
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                vs 54% clinic baseline
              </span>
            </div>
          </div>

          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={recallConfig} className="aspect-auto h-[85px] w-full">
                <LineChart
                  data={recallData}
                  margin={{ top: 6, right: 6, left: 6, bottom: 0 }}
                >
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="automated"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="standard"
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>EPC Drops: -78%</span>
            <span>SMS Open: 94%</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">+$4,200/mo Recaptured</span>
          </div>
        </div>

        {/* CARD 5: Dual-Provider Clinical AI Latency */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Dual-Provider AI Inference
              </span>
              <div className="flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                <Cpu className="h-3 w-3" />
                <span>Zero Downtime</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                420 ms
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                GPT-4o-mini &bull; Gemini failover
              </span>
            </div>
          </div>

          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={aiConfig} className="aspect-auto h-[85px] w-full">
                <BarChart
                  data={aiData}
                  layout="vertical"
                  margin={{ top: 2, right: 12, left: 2, bottom: 2 }}
                >
                  <XAxis type="number" hide domain={[0, 500]} />
                  <YAxis
                    dataKey="provider"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={85}
                    tick={{ fontSize: 9, fill: 'currentColor' }}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="latency" radius={[0, 4, 4, 0]}>
                    {aiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Primary: OpenAI</span>
            <span>Failover: Gemini Flash</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Offline Rule Engine</span>
          </div>
        </div>

        {/* CARD 6: Cliniko End-to-End Execution Stages */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Full Workflow Pipeline Latency
              </span>
              <div className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
                <Server className="h-3 w-3" />
                <span>1.69s Total</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                1.69 s
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                Dictation to Cliniko Note Saved
              </span>
            </div>
          </div>

          <div className="mt-3 h-[85px] w-full">
            {mounted ? (
              <ChartContainer config={pipelineConfig} className="aspect-auto h-[85px] w-full">
                <BarChart
                  data={pipelineData}
                  margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
                >
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: 'currentColor' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="duration" radius={[3, 3, 0, 0]}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[85px] w-full bg-[var(--color-panel-subtle)] animate-pulse rounded-lg" />
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
            <span>Inngest Step Funcs</span>
            <span>Idempotency Keyed</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">100% Audit Logged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
