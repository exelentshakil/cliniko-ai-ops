'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Terminal,
  Activity,
  Trash2,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogEntry {
  id: string;
  timestamp: string;
  stage: 'Ingestion' | 'Dedupe' | 'AI Inference' | 'Slack Dispatch';
  status: '200 OK' | 'Filtered' | 'Blocked' | 'Dispatched';
  details: string;
  durationMs: number;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log_01',
    timestamp: '16:12:04.218',
    stage: 'Slack Dispatch',
    status: 'Dispatched',
    details: 'Block Kit card posted to #gear-leads-alerts for u/analog_delay_junkie (Score: 10/10)',
    durationMs: 84,
  },
  {
    id: 'log_02',
    timestamp: '16:12:04.134',
    stage: 'AI Inference',
    status: '200 OK',
    details: 'OpenAI gpt-4o-mini classified "actively asking for alternatives" with OpportunityScore 10',
    durationMs: 142,
  },
  {
    id: 'log_03',
    timestamp: '16:12:03.992',
    stage: 'Dedupe',
    status: '200 OK',
    details: 'Hash sha256:7f9a2b8c91 verified unique in 14-day LRU cache',
    durationMs: 3,
  },
  {
    id: 'log_04',
    timestamp: '16:12:03.989',
    stage: 'Ingestion',
    status: '200 OK',
    details: 'Polled r/GuitarPedals new.json (HTTP 200). 1 post matched trigger "Reverb • fee increase"',
    durationMs: 310,
  },
  {
    id: 'log_05',
    timestamp: '16:10:15.820',
    stage: 'Dedupe',
    status: 'Blocked',
    details: 'Duplicate post detected: sha256:7f9a2b8c91 exists. Halting execution at Node 3.',
    durationMs: 2,
  },
  {
    id: 'log_06',
    timestamp: '16:05:00.112',
    stage: 'AI Inference',
    status: 'Filtered',
    details: 'Classified post as "neutral / general discussion" with OpportunityScore 3. Below threshold (7). Dropped.',
    durationMs: 118,
  },
];

interface ExecutionLogDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExecutionLogDrawer({ open, onOpenChange }: ExecutionLogDrawerProps) {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [filter, setFilter] = useState<string>('All');

  const filteredLogs = logs.filter((l) => filter === 'All' || l.stage === filter);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-[var(--color-surface)] border-l border-[var(--color-border)] p-6 text-[var(--color-text-primary)]">
        <SheetHeader className="border-b border-[var(--color-border)] pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <Terminal className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                Live Execution Traces
              </span>
              <span className="text-xs text-emerald-600 font-mono font-bold">
                ● Connected
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setLogs([])}
              className="h-7 text-xs text-[var(--color-text-muted)] hover:text-red-600 px-2"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              <span>Clear</span>
            </Button>
          </div>
          <SheetTitle className="text-lg font-bold">
            Real-Time Pipeline Event Log
          </SheetTitle>
          <SheetDescription className="text-xs text-[var(--color-text-secondary)]">
            End-to-end execution logs capturing community scraping, hash deduplication, LLM inference latency, and Slack Block Kit dispatches.
          </SheetDescription>
        </SheetHeader>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-4 text-xs font-mono overflow-x-auto pb-1">
          {['All', 'Ingestion', 'Dedupe', 'AI Inference', 'Slack Dispatch'].map((stage) => (
            <button
              key={stage}
              onClick={() => setFilter(stage)}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                filter === stage
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Log Entries List */}
        <div className="space-y-2.5 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <p className="text-[var(--color-text-muted)] italic text-center py-8">
              No log entries match the selected filter.
            </p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[var(--color-text-primary)]">
                      [{log.stage}]
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-xs font-semibold ${
                        log.status === 'Dispatched' || log.status === '200 OK'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.status === 'Blocked'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs">
                    <span>{log.durationMs}ms</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {log.details}
                </p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
