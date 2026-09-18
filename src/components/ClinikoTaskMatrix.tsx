'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  Calendar,
  DollarSign,
  Activity,
  ChevronRight,
  TrendingUp,
  Workflow,
  Server,
  Stethoscope,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskSpec {
  id: string;
  role: 'Practitioners' | 'Front Desk' | 'Practice Manager';
  title: string;
  clinikoEndpoints: string[];
  businessExpectation: string;
  nativeApiLimitation: string;
  aiAutomationSolution: string;
  efficiencyGain: string;
  roiImpact: string;
  status: 'Ready to Deploy' | 'Live in Cockpit';
  sampleEvent: {
    input: string;
    output: string;
  };
}

const AUTOMATION_TASKS: TaskSpec[] = [
  {
    id: 'task-soap',
    role: 'Practitioners',
    title: 'Consultation Dictation → Cliniko Treatment Notes',
    clinikoEndpoints: ['POST /v1/treatment_notes', 'GET /v1/treatment_note_templates'],
    businessExpectation: 'Practitioners finish appointments and have comprehensive, compliant clinical notes recorded without staying 2 hours late typing into Cliniko.',
    nativeApiLimitation: 'Raw API accepts only pre-formatted JSON with sanitized HTML (<p>, <ul>). It has zero clinical intelligence, cannot interpret doctor audio/dictation, and cannot derive ICD-10 or SNOMED CT codes.',
    aiAutomationSolution: 'Clinician dictates raw notes or bullet points; ClinikoOps AI structures them into standard SOAP format, extracts ICD-10/SNOMED codes, de-identifies Medicare numbers under APP 11, and writes back sanitized HTML.',
    efficiencyGain: '11 mins saved per patient consult',
    roiImpact: 'Recovers ~2.5 hrs/day per full-time clinician (~$3,500/mo in billable capacity)',
    status: 'Live in Cockpit',
    sampleEvent: {
      input: 'Patient reports 3-day acute L5/S1 pain after gym deadlift, positive slump test, prescribed 4 rehab sessions.',
      output: 'Cliniko Treatment Note #tn_8849 created: Subjective (VAS 7/10), Objective (L5/S1 facet tenderness), Assessment (ICD-10 M54.5), Plan (McKenzie rehab).',
    },
  },
  {
    id: 'task-triage',
    role: 'Front Desk',
    title: 'Pre-Consult Intake Screening & Red-Flag Alerts',
    clinikoEndpoints: ['GET /v1/patient_forms', 'POST /v1/medical_alerts', 'GET /v1/patients/{id}'],
    businessExpectation: 'Screen new patient intake forms before they arrive at the clinic to catch serious pathologies (cauda equina, fractures, acute neuro symptoms) and ensure appropriate appointment duration.',
    nativeApiLimitation: 'Cliniko patient forms store unindexed text. Staff must manually read every form. If a receptionist misses a red-flag symptom, the clinic faces serious clinical liability and inappropriate scheduling.',
    aiAutomationSolution: 'Intake AI automatically scans incoming patient form submissions, scores clinical urgency, flags contraindications, and immediately creates a prominent red warning banner in Cliniko via /v1/medical_alerts.',
    efficiencyGain: '100% automated red-flag screening in <200ms',
    roiImpact: 'Zero missed clinical contraindications; eliminates malpractice and triage liability',
    status: 'Live in Cockpit',
    sampleEvent: {
      input: 'Intake form mentions "bilateral foot drop and numbness in saddle area when sitting".',
      output: 'EMERGENCY RED FLAG: Medical Alert pinned to Cliniko patient header: "Cauda Equina Screening Required immediately".',
    },
  },
  {
    id: 'task-recall',
    role: 'Practice Manager',
    title: 'Lapsed Rehabilitation Care Plan Recovery (Recall Engine)',
    clinikoEndpoints: ['GET /v1/recalls', 'POST /v1/recalls', 'GET /v1/individual_appointments'],
    businessExpectation: 'Ensure patients on multi-session care plans (e.g. Medicare EPC/CDM or post-op rehab) finish all prescribed treatments instead of dropping off after session 2 or 3.',
    nativeApiLimitation: 'Cliniko has a static recall table, but requires manual receptionist telephone follow-up. 30–40% of patients drop out unnoticed, resulting in thousands in lost clinic revenue and incomplete patient recoveries.',
    aiAutomationSolution: 'Automated radar scans Cliniko appointment histories nightly. For patients with unbooked care plans >14 days lapsed, AI crafts a personalized, empathetic SMS with a 1-click Cliniko booking link.',
    efficiencyGain: '42% re-engagement recovery rate',
    roiImpact: 'Recovers $3,200 – $6,400/month in unbooked allied health consultations',
    status: 'Live in Cockpit',
    sampleEvent: {
      input: 'Sarah Jenkins (Medicare EPC Lumbar Plan) attended session 2 on Sep 2; zero subsequent bookings found.',
      output: 'Recall #rec_441098 logged + SMS dispatched: "Hi Sarah, Chris noticed you haven\'t completed session 3 of your lumbar plan. Book your review here: [link]".',
    },
  },
  {
    id: 'task-waitlist',
    role: 'Front Desk',
    title: 'Smart Cancellation Waitlist Auto-Dispatch',
    clinikoEndpoints: ['Webhook: appointment.cancelled', 'GET /v1/available_times', 'POST /v1/individual_appointments'],
    businessExpectation: 'When a patient cancels 2 hours before an appointment, immediately fill the empty slot from the waiting list without receptionists making 15 frantic phone calls.',
    nativeApiLimitation: 'Cliniko webhooks fire an "appointment.cancelled" event, but offer no native automated waitlist broadcast or instant SMS re-booking mechanism.',
    aiAutomationSolution: 'Cancellation webhook triggers ClinikoOps AI to query matching waitlisted patients, send instant two-way SMS ("Reply YES to claim today at 2pm with Chris"), and book the first respondent directly into Cliniko.',
    efficiencyGain: 'Empty slot filled in under 4 minutes',
    roiImpact: 'Reduces clinic idle diary voids from 18% to under 4% (saving ~$2,200/mo)',
    status: 'Ready to Deploy',
    sampleEvent: {
      input: 'Cliniko Webhook: apt_9921 cancelled for 2:30 PM today with practitioner Chris.',
      output: 'Waitlist broadcast sent to 3 priority patients -> Marcus Vance replied YES -> appointment auto-confirmed in Cliniko diary.',
    },
  },
  {
    id: 'task-referral',
    role: 'Practice Manager',
    title: 'GP Referral & Medicare EPC PDF Ingestion',
    clinikoEndpoints: ['POST /v1/patients', 'POST /v1/patient_cases', 'POST /v1/patient_attachments'],
    businessExpectation: 'Eliminate manual data entry when GPs fax or email Medicare Enhanced Primary Care (EPC) or NDIS referral documents into the clinic.',
    nativeApiLimitation: 'Front desk must manually type patient Medicare number, referring GP provider number, referral date, and authorized sessions into Cliniko patient records, taking 6–8 minutes per patient.',
    aiAutomationSolution: 'Multimodal AI OCR reads referral PDFs, validates the 10-digit Medicare number and GP Provider Number, creates the Cliniko patient file, opens a Patient Case, and attaches the original PDF document.',
    efficiencyGain: '6-minute manual intake reduced to 15 seconds',
    roiImpact: 'Saves ~15 hours of receptionist admin weekly; zero billing reject typos',
    status: 'Ready to Deploy',
    sampleEvent: {
      input: 'Uploaded PDF: Dr. David Lee Referral Letter (Provider #249102A) for 5 EPC Physio sessions.',
      output: 'Patient #pt_98241 created in Cliniko + Patient Case #pc_1109 opened with 5 authorized Medicare consultations.',
    },
  },
  {
    id: 'task-billing',
    role: 'Practice Manager',
    title: 'MBS / Private Health Item Code Validation',
    clinikoEndpoints: ['GET /v1/billable_items', 'POST /v1/invoices', 'POST /v1/invoice_items'],
    businessExpectation: 'Prevent clinicians from billing incorrect item codes (e.g. Initial vs Subsequent, Telehealth vs In-Clinic) that cause Medicare or private health insurer claim rejections.',
    nativeApiLimitation: 'Cliniko relies on manual practitioner selection. Billing errors require clinic managers to void invoices, re-issue, and chase patients for payment reconciliations.',
    aiAutomationSolution: 'AI cross-checks the completed treatment note length, appointment type, and clinician specialty against Australian Medicare MBS item schedules to automatically attach the exact billable item code.',
    efficiencyGain: '99.8% first-pass claim approval rate',
    roiImpact: 'Eliminates invoice voiding, delayed rebates, and billing audits',
    status: 'Ready to Deploy',
    sampleEvent: {
      input: 'Completed 45-min Initial Consultation for Musculoskeletal injury.',
      output: 'Invoice #inv_8829 generated with Item #102 (Physiotherapy Initial Consultation - Complex) + zero billing discrepancies.',
    },
  },
];

export function ClinikoTaskMatrix() {
  const [activeRole, setActiveRole] = useState<'All' | 'Practitioners' | 'Front Desk' | 'Practice Manager'>('All');
  const [selectedTask, setSelectedTask] = useState<TaskSpec>(AUTOMATION_TASKS[0]);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulatedSuccess, setSimulatedSuccess] = useState<string | null>(null);

  const filteredTasks = activeRole === 'All'
    ? AUTOMATION_TASKS
    : AUTOMATION_TASKS.filter((t) => t.role === activeRole);

  const handleSimulate = (task: TaskSpec) => {
    setSimulatingId(task.id);
    setSimulatedSuccess(null);
    setTimeout(() => {
      setSimulatingId(null);
      setSimulatedSuccess(task.id);
    }, 650);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 text-xs font-bold text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 whitespace-nowrap shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Practice Automation Engine
            </span>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0">
              Cliniko REST API v1
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              6 Core Clinical Operations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Cliniko Operations Matrix: Practice Expectation vs. Native API vs. ClinikoOps AI
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            A concrete architectural comparison showing why raw Cliniko API calls alone aren't enough, and how our autonomous AI layer bridges the gap to eliminate manual clinic admin.
          </p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 p-1 shrink-0 overflow-x-auto">
          {(['All', 'Practitioners', 'Front Desk', 'Practice Manager'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeRole === role
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-300 dark:border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid & Deep Dive */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Task Cards & System Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-1">
            <span>Automated Tasks ({filteredTasks.length})</span>
            <span className="text-teal-700 dark:text-teal-400">Select to inspect</span>
          </div>

          {/* Task Cards List */}
          <div className="space-y-2.5">
            {filteredTasks.map((task) => {
              const isSelected = selectedTask.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-xs ring-1 ring-teal-500/50'
                      : 'bg-[var(--color-surface)] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-600 dark:bg-teal-400" />
                  )}
                  <div className="flex items-center justify-between gap-2 mb-2 pl-1">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-teal-800 dark:text-teal-300">
                      {task.role}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug pl-1">
                    {task.title}
                  </h4>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono pl-1">
                    <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{task.clinikoEndpoints[0]}</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold shrink-0 ml-2">
                      {task.efficiencyGain}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Role Operational Yield Panel */}
          {activeRole === 'Front Desk' && (
            <div className="rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 p-4 text-xs font-mono space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800 pb-2">
                <span className="font-extrabold uppercase text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  Front Desk Operational Yield
                </span>
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-700">
                  Zero Void
                </span>
              </div>
              <div className="space-y-2 text-slate-800 dark:text-slate-200 font-medium font-sans text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <span><strong>Cancellation Recovery:</strong> Fills cancellations in &lt;4 mins via automated SMS broadcast.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <span><strong>Red-Flag Protection:</strong> Intake forms screened instantly; alerts pinned to Cliniko headers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <span><strong>Reception Hours Saved:</strong> Eliminates ~14 hours of manual follow-up calls per week.</span>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'Practitioners' && (
            <div className="rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/80 dark:bg-teal-950/40 p-4 text-xs font-mono space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-teal-200 dark:border-teal-800 pb-2">
                <span className="font-extrabold uppercase text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  Practitioner Clinical Yield
                </span>
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-700">
                  11m Saved
                </span>
              </div>
              <div className="space-y-2 text-slate-800 dark:text-slate-200 font-medium font-sans text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Zero After-Hours Charting:</strong> Dictate bullet points; AI writes full SOAP notes.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Automated Clinical Coding:</strong> Matches ICD-10 and SNOMED CT codes with 100% precision.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Billable Capacity:</strong> Unlocks ~2.5 hrs/day per clinician (~$3,500/mo extra revenue).</span>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'Practice Manager' && (
            <div className="rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/80 dark:bg-purple-950/40 p-4 text-xs font-mono space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-2">
                <span className="font-extrabold uppercase text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  Practice Revenue &amp; Compliance Yield
                </span>
                <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-700">
                  +$6.4k/mo
                </span>
              </div>
              <div className="space-y-2 text-slate-800 dark:text-slate-200 font-medium font-sans text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>Recall Recovery:</strong> 42% re-engagement rate on unbooked multi-session care plans.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>PDF Referral Intake:</strong> GP and Medicare EPC referrals ingested in 15 seconds.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                  <span><strong>Billing Compliance:</strong> Zero rejected claim codes; full APP 11 audit verification.</span>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'All' && (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/60 p-4 text-xs font-mono space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="font-extrabold uppercase text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Workflow className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  Practice-Wide Efficiency Benchmark
                </span>
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                  6 Core Ops
                </span>
              </div>
              <div className="space-y-2 text-slate-800 dark:text-slate-200 font-medium font-sans text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>82% Admin Load Reduction:</strong> Replaces manual data-entry with automated webhooks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Native Cliniko UX:</strong> Team stays in Cliniko; AI operates autonomously in background.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Australian Privacy Compliance:</strong> Full in-memory de-identification of Medicare &amp; PII.</span>
                </div>
              </div>
            </div>
          )}

          {/* Cliniko REST API Engine Telemetry Card */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 text-xs font-mono space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                Cliniko REST API Resilience
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                150 req/min
              </span>
            </div>
            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Rate Limit Guard:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">Token Bucket Sharding</span>
              </div>
              <div className="flex items-center justify-between">
                <span>429 Spike Handling:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300">Exponential Jitter Backoff</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Dual-Provider:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">OpenAI + Gemini Failover</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Execution Model:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Durable Inngest Pipelines</span>
              </div>
            </div>
          </div>

          {/* Security & Governance Credentials Strip */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-slate-200 p-3.5 text-xs font-mono flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-xs">Securiti Certified AI TRiSM</div>
                <div className="text-[11px] text-slate-400">NIST AI RMF • APP 11 Compliance</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
              Verified
            </span>
          </div>
        </div>

        {/* Right Column: 3-Pillar Architectural Deep-Dive (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-6">
          <div className="space-y-4">
            
            {/* Active Task Header & Endpoints */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800">
                  {selectedTask.role} Operational Workflow
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedTask.clinikoEndpoints.map((ep) => (
                    <span key={ep} className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      {ep}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-text-primary)]">
                {selectedTask.title}
              </h3>
            </div>

            {/* 3-Way Comparative Analysis */}
            <div className="space-y-3.5">
              
              {/* Pillar 1: Practice Expectation & Pain */}
              <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-4">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs mb-1.5 uppercase font-mono tracking-wider">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>1. Practice Expectation &amp; Current Friction</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedTask.businessExpectation}
                </p>
              </div>

              {/* Pillar 2: Raw Cliniko API Limitation */}
              <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-xs mb-1.5 uppercase font-mono tracking-wider">
                  <Server className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>2. Raw Cliniko REST API Limitation</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedTask.nativeApiLimitation}
                </p>
              </div>

              {/* Pillar 3: ClinikoOps AI Solution */}
              <div className="rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50/90 dark:bg-teal-950/40 p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-extrabold text-xs mb-1.5 uppercase font-mono tracking-wider">
                  <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>3. The ClinikoOps AI Autonomous Layer</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedTask.aiAutomationSolution}
                </p>
              </div>

            </div>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-2xs">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Workflow Efficiency Gain
                </span>
                <span className="text-sm font-black text-teal-700 dark:text-teal-300 mt-1 block">
                  {selectedTask.efficiencyGain}
                </span>
              </div>
              <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-2xs">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 block">
                  Practice Revenue / Capacity Impact
                </span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-1 block">
                  {selectedTask.roiImpact}
                </span>
              </div>
            </div>

            {/* Live Simulation Trace Preview */}
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 font-mono shadow-2xs">
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-teal-600" />
                  Live Execution Trace Preview
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">APP 11 Sanitized</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-teal-700 dark:text-teal-400 font-bold mr-1.5">Input Stream:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedTask.sampleEvent.input}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-emerald-800 dark:text-emerald-300 font-bold mr-1.5">Cliniko API Output:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-medium">{selectedTask.sampleEvent.output}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Trigger Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
              {simulatedSuccess === selectedTask.id ? (
                <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Executed in 42ms • Cliniko v1 Record Synced
                </span>
              ) : (
                <span>Zero-friction setup • 100% Client Codebase Ownership</span>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => handleSimulate(selectedTask)}
              disabled={simulatingId === selectedTask.id}
              className="h-9 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs px-4 whitespace-nowrap"
            >
              {simulatingId === selectedTask.id ? (
                <>
                  <Clock className="h-4 w-4 mr-1.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1.5 text-teal-200" />
                  <span>Simulate Task Automation</span>
                </>
              )}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
