'use client';

import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Workflow,
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Award,
  CheckCircle2,
  Layers,
  Sparkles,
  Server,
  Stethoscope,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="mx-auto max-w-7xl">
        {/* Balanced 3-Pillar Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
          
          {/* Pillar 1: Platform & Systems Mission */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Systems Platform
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3.5 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white font-black text-sm shadow-xs shrink-0">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="text-base font-extrabold tracking-tight text-[var(--color-text-primary)] whitespace-nowrap">
                      ClinikoOps AI
                    </span>
                    <span className="rounded-full bg-teal-100 dark:bg-teal-950 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 whitespace-nowrap shrink-0">
                      Cliniko v1 API Ready
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Autonomous clinical operations &amp; practice management automation for Australian allied health practices. Eliminates documentation burnout and automates patient care plan adherence.
                </p>
              </div>

              {/* Verified Platform Status Strip */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium whitespace-nowrap min-w-0">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse shrink-0"></span>
                  <span className="text-[11px] font-semibold truncate">Cliniko v1 Gateway: 42ms</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                  100% Codebase Ownership
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Systems Architecture & Technical Specs */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Systems Architecture
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3.5 text-xs">
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 text-[11px] font-mono text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Server className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">Cliniko REST API v1</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Cpu className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">Dual-Model AI Engine</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">APP 11 PII Firewall</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Workflow className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">Durable Inngest Steps</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Activity className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">Token-Bucket Limiter</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-2.5 py-1.5 shadow-2xs">
                    <Terminal className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span className="truncate">Next.js 15 App Router</span>
                  </div>
                </div>
              </div>

              {/* Compliance & SLA Verification Strip */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[11px] text-[var(--color-text-muted)] font-medium truncate">
                  NIST AI RMF &bull; HIPAA Safe Harbor
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                  99.99% SLA
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Principal Systems Architect Verification */}
          <div className="space-y-2.5 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
              Principal Systems Architect
            </h4>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col justify-between flex-1 space-y-3 text-xs">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src="/headshot.jpeg"
                      alt="Shakil Ahmed - Principal Systems Architect"
                      className="h-11 w-11 rounded-xl object-cover ring-2 ring-teal-500/30 border border-[var(--color-border)] shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-teal-500 text-white ring-2 ring-white dark:ring-slate-900 shadow-xs" title="Verified Architect">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)] text-sm">
                      <span className="truncate">Shakil Ahmed</span>
                      <span className="inline-flex items-center rounded bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                        Lead
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-mono truncate">
                      Autonomous Systems &amp; AI Architect
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Former Lead Systems Engineer at Legiit ($1M ARR Command Center). 12+ Years Enterprise Systems &amp; Autonomous AI Delivery.
                </p>
              </div>

              {/* Certified Architect Verification Bar */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between gap-1.5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                  <span className="whitespace-nowrap shrink-0 text-[11px] font-semibold">Securiti Certified</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
                  <ShieldCheck className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] font-mono gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} ClinikoOps AI</span>
            <span className="text-[var(--color-border)] select-none">&bull;</span>
            <span>Intelligent Practice Automation &amp; Cliniko API Orchestration</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a href="#pipeline" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Pipeline Canvas
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">&bull;</span>
            <a href="#soap" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              SOAP Copilot
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">&bull;</span>
            <a href="#intake" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Intake Triage
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">&bull;</span>
            <a href="#recall" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Patient Recall
            </a>
            <span className="text-[var(--color-border)] select-none hidden sm:inline">&bull;</span>
            <a href="#cliniko-api" className="hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap">
              Cliniko API Hub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
