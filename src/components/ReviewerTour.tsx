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
      id: 'intake',
      badge: 'Path 1 • Intake Triage',
      title: 'Pre-Consult Intake & Red-Flag Detection',
      desc: 'Screens patient intake submissions against clinical red flags (cauda equina, neuro deficits, unexplained night pain) and matches Cliniko appointment booking types.',
      actionLabel: 'Test Intake Triage',
      icon: ClipboardList,
    },
    {
      id: 'soap',
      badge: 'Path 2 • SOAP Copilot',
      title: 'Dictation to Cliniko Treatment Notes',
      desc: 'Transforms informal clinician dictation into structured SOAP notes with ICD-10/SNOMED terminology and 1-click Cliniko API write-back.',
      actionLabel: 'Generate SOAP Note',
      icon: FileText,
    },
    {
      id: 'recall',
      badge: 'Path 3 • Patient Recall',
      title: 'Lapsed Care Plan Revenue Recovery',
      desc: 'Scans Cliniko appointment histories to flag dropped rehabilitation care plans (e.g. Medicare EPC) and drafts personalized re-engagement SMS messages.',
      actionLabel: 'Inspect Recall Radar',
      icon: Users,
    },
    {
      id: 'cliniko-api',
      badge: 'Path 4 • API Gateway',
      title: 'Cliniko REST API v1 & APP 11 Compliance',
      desc: 'Full interactive test console for Cliniko v1 endpoints, webhook subscriptions, token-bucket rate limiting (150 req/min), and Australian Privacy Principles.',
      actionLabel: 'Open API Explorer',
      icon: Server,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header with Collapsible Toggle */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Executive Briefing: Cliniko Practice Automation Architecture
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Sydney NSW &bull; Cliniko v1 API Ready
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
              Designed for Australian allied health practices. Eliminates 2 hours of daily practitioner documentation admin and recovers lapsed patient treatment plans.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenChaosModal}
            className="hidden sm:inline-flex h-8 text-xs font-semibold border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          >
            <Zap className="h-3.5 w-3.5 mr-1 text-amber-600 dark:text-amber-400" />
            <span>Chaos Test</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            aria-label={isCollapsed ? 'Expand briefing' : 'Collapse briefing'}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Body: 4-Column Evaluation Path Cards */}
      {!isCollapsed && (
        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluationPaths.map((path) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 font-mono">
                        {path.badge}
                      </span>
                      <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1.5">
                      {path.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {path.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => onNavigate(path.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 p-3 text-xs font-mono text-teal-900 dark:text-teal-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                <strong>APP 11 &amp; HIPAA Safe Harbor:</strong> Zero clinical PII transmitted unredacted. Medicare card numbers &amp; AU phone formats auto-masked in memory.
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-teal-700 dark:text-teal-300">
              <span>Dual-Provider: GPT-4o-mini + Gemini Flash</span>
              <span>&bull;</span>
              <span>150 req/min Cliniko Token-Bucket Managed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
