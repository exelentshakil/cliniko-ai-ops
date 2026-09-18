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
    }, 700);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Practice Automation Engine
            </span>
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-mono font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
              Cliniko REST API v1
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              6 Core Operational Workflows
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Cliniko Operations Matrix: Practice Expectation vs. Native API vs. ClinikoOps AI
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            A concrete architectural comparison showing why raw Cliniko API calls alone aren't enough, and how our autonomous AI layer bridges the gap to eliminate manual clinic admin.
          </p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-1 shrink-0 overflow-x-auto">
          {(['All', 'Practitioners', 'Front Desk', 'Practice Manager'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeRole === role
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-2xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid & Deep Dive */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Task Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)] px-1">
            Automated Clinical Tasks ({filteredTasks.length})
          </div>
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredTasks.map((task) => {
              const isSelected = selectedTask.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500/50 shadow-xs ring-1 ring-teal-500/30'
                      : 'bg-[var(--color-panel-subtle)] border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-teal-700 dark:text-teal-300">
                      {task.role}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] leading-snug">
                    {task.title}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
                    <span className="truncate">{task.clinikoEndpoints[0]}</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0">
                      {task.efficiencyGain}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3-Pillar Architectural Deep-Dive (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5">
          <div className="space-y-4">
            
            {/* Active Task Header & Endpoints */}
            <div className="border-b border-[var(--color-border)] pb-3.5">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                  {selectedTask.role} Operational Workflow
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedTask.clinikoEndpoints.map((ep) => (
                    <span key={ep} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-blue-700 dark:text-blue-300 font-medium">
                      {ep}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--color-text-primary)]">
                {selectedTask.title}
              </h3>
            </div>

            {/* 3-Way Comparative Analysis */}
            <div className="space-y-3 text-xs">
              
              {/* Pillar 1: Practice Expectation & Pain */}
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-3">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>1. What the Practice Expects (Headache Today)</span>
                </div>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedTask.businessExpectation}
                </p>
              </div>

              {/* Pillar 2: Raw Cliniko API Limitation */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] p-3">
                <div className="flex items-center gap-1.5 text-[var(--color-text-primary)] font-bold text-xs mb-1">
                  <Server className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span>2. Raw Cliniko REST API Limitation</span>
                </div>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedTask.nativeApiLimitation}
                </p>
              </div>

              {/* Pillar 3: ClinikoOps AI Solution */}
              <div className="rounded-lg border border-teal-200 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 p-3">
                <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-300 font-bold text-xs mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>3. The ClinikoOps AI Automated Layer</span>
                </div>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedTask.aiAutomationSolution}
                </p>
              </div>

            </div>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-text-muted)] block">
                  Workflow Efficiency Gain
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-0.5 block">
                  {selectedTask.efficiencyGain}
                </span>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-text-muted)] block">
                  Monthly Financial Impact
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {selectedTask.roiImpact}
                </span>
              </div>
            </div>

            {/* Live Simulation Trace Preview */}
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-xs">
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
                <span>Automated Execution Trace</span>
                <span className="text-emerald-600 dark:text-emerald-400">APP 11 Redacted</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-[var(--color-panel-subtle)] border border-[var(--color-border)]">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mr-1.5">Input:</span>
                  <span className="text-[var(--color-text-secondary)]">{selectedTask.sampleEvent.input}</span>
                </div>
                <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1.5">Cliniko API Output:</span>
                  <span className="text-[var(--color-text-primary)]">{selectedTask.sampleEvent.output}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Trigger Bar */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3 mt-4">
            <div className="text-[11px] font-mono text-[var(--color-text-muted)]">
              {simulatedSuccess === selectedTask.id ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Dispatched in 42ms • Cliniko v1 Synced
                </span>
              ) : (
                <span>Zero-friction setup • 100% Client Codebase Ownership</span>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => handleSimulate(selectedTask)}
              disabled={simulatingId === selectedTask.id}
              className="h-8 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs px-3"
            >
              {simulatingId === selectedTask.id ? (
                <>
                  <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 mr-1.5 text-teal-200" />
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
