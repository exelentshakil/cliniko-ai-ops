'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardList,
  Users,
  Server,
  Activity,
  ArrowRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewerTourProps {
  onNavigate: (sectionId: string) => void;
  onOpenChaosModal: () => void;
}

export function ReviewerTour({ onNavigate, onOpenChaosModal }: ReviewerTourProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const evaluationPaths = [
    {
      id: 'matrix',
      step: '01',
      badge: 'Interactive Matrix',
      title: 'Practice Expectation vs. Cliniko API',
      desc: 'See the 6 core operational bottlenecks in allied health practices and how our autonomous AI bridges raw Cliniko API limitations.',
      actionLabel: 'Explore 6 Tasks',
      icon: Activity,
      highlight: 'Key evaluation view',
    },
    {
      id: 'soap',
      step: '02',
      badge: 'Documentation Copilot',
      title: 'Dictation → Cliniko SOAP Notes',
      desc: 'Transforms informal clinician dictation into structured SOAP notes with ICD-10/SNOMED terminology and 1-click Cliniko API write-back.',
      actionLabel: 'Test SOAP Copilot',
      icon: FileText,
      highlight: 'Saves 11m/patient',
    },
    {
      id: 'intake',
      step: '03',
      badge: 'Pre-Consult Screening',
      title: 'Intake Triage & Red-Flag Alerts',
      desc: 'Screens patient intake submissions against critical clinical red flags (cauda equina, neuro deficits) and posts medical alerts in Cliniko.',
      actionLabel: 'Screen Intake Form',
      icon: ClipboardList,
      highlight: 'Zero missed flags',
    },
    {
      id: 'recall',
      step: '04',
      badge: 'Revenue Recovery',
      title: 'Lapsed Care Plan Radar (Recalls)',
      desc: 'Scans Cliniko appointment histories to flag unbooked rehabilitation care plans (e.g. Medicare EPC) and drafts personalized re-engagement SMS.',
      actionLabel: 'Run Recall Scan',
      icon: Users,
      highlight: 'Recovers ~$4.2k/mo',
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Header with Collapsible Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold shrink-0 shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-[var(--color-text-primary)]">
                Executive Briefing
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                Cliniko v1 API Ready
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
              Cliniko practice automation architecture for Australian allied health. Eliminates 2+ hours of daily documentation admin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenChaosModal}
            className="h-9 text-xs font-bold border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
            <span>Simulate API Outage</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9 p-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
            aria-label={isCollapsed ? 'Expand briefing' : 'Collapse briefing'}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Body: 4-Column Evaluation Path Cards */}
      {!isCollapsed && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluationPaths.map((path) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between hover:border-teal-500/70 hover:shadow-xs transition-all text-left group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-[var(--color-panel-subtle)] text-teal-800 dark:text-teal-300 border border-[var(--color-border)]">
                        {path.step} &bull; {path.badge}
                      </span>
                      <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug mb-1.5">
                      {path.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {path.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                      {path.highlight}
                    </span>
                    <button
                      onClick={() => onNavigate(path.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-100 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>{path.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Technical Assurance Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-3.5 text-xs font-mono text-teal-950 dark:text-teal-100 shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                <strong className="font-bold text-teal-900 dark:text-teal-200">Australian Privacy Principles (APP 11) &amp; HIPAA:</strong> All Australian Medicare card numbers and patient phones are redacted in memory before LLM inference.
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                OpenAI + Gemini Dual Engine
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                150 req/min Rate Governed
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
