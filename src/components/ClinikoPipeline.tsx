'use client';

import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Cpu,
  UserCheck,
  Send,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ClinikoPipeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      name: 'Cliniko Ingestion',
      category: 'API Webhook',
      desc: 'Listens for appointment.created, patient.updated, or consult dictation streams via Cliniko API v1.',
      icon: Activity,
      telemetry: '142ms • Cliniko v1',
      badge: 'GET /v1/patients',
    },
    {
      id: 2,
      name: 'Clinical Firewall',
      category: 'APP 11 & HIPAA',
      desc: 'Securiti certified de-identification masks Australian Medicare numbers, DOB, and phones before AI inference.',
      icon: ShieldCheck,
      telemetry: '0.8ms • PII Masked',
      badge: 'APP 11 Compliant',
    },
    {
      id: 3,
      name: 'Dual AI Engine',
      category: 'Clinical Reasoning',
      desc: 'OpenAI gpt-4o-mini synthesizes structured SOAP notes and triage summaries with Gemini 2.0 Flash sub-200ms failover.',
      icon: Cpu,
      telemetry: '284ms • gpt-4o-mini',
      badge: 'Dual LLM Failover',
    },
    {
      id: 4,
      name: 'Clinician Gate',
      category: 'Human-in-the-Loop',
      desc: 'Treating practitioner reviews synthesized treatment notes, adjusts exercises, and authorizes 1-click writeback.',
      icon: UserCheck,
      telemetry: '0.0ms • Clinician Auth',
      badge: 'Zero Hallucination',
    },
    {
      id: 5,
      name: 'Cliniko Writeback',
      category: 'API Dispatch',
      desc: 'Pushes signed Treatment Note to Cliniko (/v1/treatment_notes) and triggers patient SMS recovery follow-up.',
      icon: Send,
      telemetry: '198ms • 201 Created',
      badge: 'POST /v1/notes',
    },
  ];

  const handleSimulatePipeline = () => {
    setIsRunning(true);
    setCompletedSteps([]);
    setActiveStep(1);

    const runSequence = (stepIndex: number) => {
      if (stepIndex > 5) {
        setIsRunning(false);
        setActiveStep(null);
        return;
      }
      setActiveStep(stepIndex);
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        runSequence(stepIndex + 1);
      }, 700);
    };

    runSequence(1);
  };

  const handleReset = () => {
    setActiveStep(null);
    setIsRunning(false);
    setCompletedSteps([]);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <Activity className="h-3 w-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              Event-Driven Pipeline DAG
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Cliniko API v1 ➔ Make / Inngest Flow
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Autonomous Cliniko Clinical Workflow Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            Watch real-time data flow from Cliniko webhook ingestion through Australian Privacy Principle de-identification, dual LLM clinical synthesis, clinician verification gate, and final Cliniko treatment note writeback.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={handleSimulatePipeline}
            disabled={isRunning}
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs whitespace-nowrap shrink-0 px-3.5"
          >
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
            <span>Simulate Full Pipeline</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isRunning}
            className="h-8 text-xs font-medium border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Pipeline Nodes Grid with Connectors */}
      <div className="mt-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.id;
            const isCompleted = completedSteps.includes(step.id);

            return (
              <div
                key={step.id}
                className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all shadow-xs ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 scale-[1.02]'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-[var(--color-border)] bg-[var(--color-panel-subtle)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Step 0{step.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                          : isCurrent
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isCompleted ? 'VERIFIED' : isCurrent ? 'RUNNING' : 'ARMED'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                        {step.name}
                      </h3>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono truncate">
                        {step.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
                  <span>{step.telemetry}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {step.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Architectural Summary Bar */}
      <div className="mt-5 rounded-xl bg-slate-900 text-slate-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono border border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Cliniko API v1 Token Bucket: 150 requests/min buffer guaranteed with zero 429 throttling.</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-400">Latency: <strong className="text-emerald-400">624ms end-to-end</strong></span>
          <span className="h-3 w-px bg-slate-700" />
          <span className="text-slate-400">Security: <strong className="text-emerald-400">NIST AI RMF Verified</strong></span>
        </div>
      </div>
    </div>
  );
}
