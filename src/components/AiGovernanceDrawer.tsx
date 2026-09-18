'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  ShieldCheck,
  Award,
  Lock,
  FileCheck,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AiGovernanceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiGovernanceDrawer({ open, onOpenChange }: AiGovernanceDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-[var(--color-surface)] border-l border-[var(--color-border)] p-6 text-[var(--color-text-primary)]">
        <SheetHeader className="border-b border-[var(--color-border)] pb-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              NIST AI RMF & OWASP LLM Top 10
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              Securiti Certified
            </Badge>
          </div>
          <SheetTitle className="text-lg font-bold">
            AI Security, Governance & Compliance Posture
          </SheetTitle>
          <SheetDescription className="text-xs text-[var(--color-text-secondary)]">
            Built according to NIST AI 100-1 Risk Management Framework and OWASP Top 10 for Large Language Models.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 text-xs font-sans">
          {/* Certification Card */}
          <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0 shadow-xs">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  <span>Securiti Certified AI Architect</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 font-mono">
                  Credential ID: 14B411BCE-14B411A3D-1451CFE76
                </p>
                <p className="text-xs text-emerald-900 dark:text-emerald-200 mt-1 leading-relaxed">
                  Specializing in Gartner AI TRiSM (Trust, Risk & Security Management), inline LLM firewalls, bound hallucination containment, and PII anonymization.
                </p>
              </div>
            </div>
          </div>

          {/* NIST AI RMF Core Functions */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
              NIST AI 100-1 Operational Functions
            </h4>

            <div className="space-y-2.5">
              <div className="rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-panel-subtle)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[var(--color-text-primary)]">
                    1. GOVERN (Governance & Accountability)
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    100% Owned
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  All system prompts, API credentials, and automation workflows run inside your private accounts. Zero vendor lock-in or developer intermediary access.
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-panel-subtle)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[var(--color-text-primary)]">
                    2. MAP (Taxonomy & Risk Categorization)
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    9 Categories
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Rigidly bounded 9-category taxonomy ensures incoming posts are classified predictably without open-ended drift or hallucinated intent.
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-panel-subtle)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[var(--color-text-primary)]">
                    3. MEASURE (Benchmarking & Scoring)
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    1-10 Scale
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  1-10 Opportunity Scoring formula weights switching intent and alternative requests highest (9-10), filtering out noise with sub-second latency telemetry.
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-panel-subtle)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[var(--color-text-primary)]">
                    4. MANAGE (Resilience & Failover)
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Dual-Model
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  OpenAI gpt-4o-mini primary + Google Gemini 2.0 Flash secondary + deterministic offline engine circuit breakers prevent any pipeline outages.
                </p>
              </div>
            </div>
          </div>

          {/* OWASP Top 10 for LLMs Defenses */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
              OWASP Top 10 for LLMs Active Defenses
            </h4>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--color-text-primary)] block">
                    LLM01: Prompt Injection Defense
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    Inline regex scanner blocks system prompt override attempts, roleplay attacks, and delimiter leaks.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--color-text-primary)] block">
                    LLM02: Sensitive Data Disclosure
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    Regex PII filter automatically redacts payment cards, phone numbers, SSNs, and personal emails before LLM ingestion.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--color-text-primary)] block">
                    LLM06: Excessive Agency Protection
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    Zero automated posting. Generated drafts are dispatched exclusively to private Slack for manual human verification.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
