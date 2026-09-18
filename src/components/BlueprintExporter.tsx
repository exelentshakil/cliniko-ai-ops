'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
  FileJson,
  ShieldCheck,
  Layers,
  Terminal,
  ExternalLink,
  BookOpen,
  Server,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SAMPLE_N8N_BLUEPRINT = {
  name: 'Cliniko-AI-Treatment-Note-Automation',
  nodes: [
    {
      id: 'node_1',
      name: 'Cliniko Webhook Receiver',
      type: 'n8n-nodes-base.webhook',
      parameters: {
        httpMethod: 'POST',
        path: 'cliniko-treatment-note-trigger',
        options: { rawBody: true },
      },
    },
    {
      id: 'node_2',
      name: 'APP 11 PII Sanitizer & Firewall',
      type: 'n8n-nodes-base.function',
      parameters: {
        functionCode: `// Redact Australian Medicare, phone numbers, and DOB before LLM transfer
let text = items[0].json.body.dictation;
text = text.replace(/\\b\\d{4}\\s?\\d{5}\\s?\\d{1}\\b/g, '[REDACTED_MEDICARE]');
text = text.replace(/(?:\\+?61|0)[2-478]\\d{8}/g, '[REDACTED_AU_PHONE]');
return [{ json: { ...items[0].json, sanitized_dictation: text } }];`,
      },
    },
    {
      id: 'node_3',
      name: 'OpenAI GPT-4o-mini Clinical SOAP Generator',
      type: 'n8n-nodes-base.openAi',
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.1,
        systemPrompt: 'You are an Australian allied health clinical documentation assistant. Output valid JSON: { subjective, objective, assessment, plan, icd10_codes }',
      },
    },
    {
      id: 'node_4',
      name: 'Cliniko Token-Bucket Rate Limiter',
      type: 'n8n-nodes-base.limit',
      parameters: {
        maxRequestsPerMinute: 140, // 150 limit safety margin
      },
    },
    {
      id: 'node_5',
      name: 'Cliniko REST API v1 Note Writeback',
      type: 'n8n-nodes-base.httpRequest',
      parameters: {
        method: 'POST',
        url: 'https://api.cliniko.com/v1/treatment_notes',
        headers: {
          'Authorization': 'Bearer {{ $env.CLINIKO_API_KEY }}',
          'User-Agent': 'ClinikoOps-AI/1.0 (Australia/Sydney)',
          'Content-Type': 'application/json',
        },
      },
    },
  ],
};

const SAMPLE_MAKE_BLUEPRINT = {
  name: 'Cliniko-Make-Modular-Clinical-Flow',
  flow: [
    { id: 1, module: 'cliniko:watchNewAppointments', label: '1. Cliniko: Watch Completed Consultations' },
    { id: 2, module: 'custom:piiRedaction', label: '2. APP 11 Compliance: Redact Medicare & Phone' },
    { id: 3, module: 'openai:createChatCompletion', label: '3. gpt-4o-mini: Structure SOAP Notes & Plan' },
    { id: 4, module: 'cliniko:createTreatmentNote', label: '4. Cliniko API: Create Treatment Note' },
    { id: 5, module: 'slack:postMessage', label: '5. Clinician Notification: Review & Sign-Off' },
  ],
};

export function BlueprintExporter() {
  const [selectedFormat, setSelectedFormat] = useState<'n8n' | 'make'>('n8n');
  const [copied, setCopied] = useState(false);

  const activeJson =
    selectedFormat === 'n8n'
      ? JSON.stringify(SAMPLE_N8N_BLUEPRINT, null, 2)
      : JSON.stringify(SAMPLE_MAKE_BLUEPRINT, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cliniko-${selectedFormat}-workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap shrink-0">
              <FileJson className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Turnkey Workflow Blueprints
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline">
              100% Client Account Ownership &bull; Zero Vendor Lock-In
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
            One-Click Workflow Blueprint Export (Make.com &amp; n8n)
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 max-w-3xl">
            Export ready-to-import workflow configurations directly into your own private n8n or Make.com workspace. You retain 100% ownership of your Cliniko API keys, webhooks, and automation logic.
          </p>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-0.5 text-xs font-medium">
            <button
              onClick={() => setSelectedFormat('n8n')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFormat === 'n8n'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              n8n Workflow
            </button>
            <button
              onClick={() => setSelectedFormat('make')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFormat === 'make'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Make.com Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Code Display & Download Controls */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] overflow-hidden">
        {/* Sub-bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
              {selectedFormat === 'n8n' ? 'cliniko-n8n-workflow.json' : 'cliniko-make-blueprint.json'}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              (v1.0.0 &bull; Cliniko API v1 Ready)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-7 text-xs border-[var(--color-border)] whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  <span>Copy JSON</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-7 text-xs bg-teal-600 hover:bg-teal-500 text-white whitespace-nowrap shrink-0"
            >
              <Download className="h-3 w-3 mr-1" />
              <span>Download .json</span>
            </Button>
          </div>
        </div>

        {/* Code Body */}
        <div className="p-4 max-h-64 overflow-y-auto font-mono text-xs text-[var(--color-text-secondary)] leading-relaxed">
          <pre>{activeJson}</pre>
        </div>
      </div>

      {/* 3-Step Import Instructions */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-mono text-xs">
              1
            </span>
            <span>Import to Workspace</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Open your private {selectedFormat === 'n8n' ? 'n8n' : 'Make.com'} dashboard, click <strong>"Import Workflow"</strong>, and paste this JSON blueprint.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-mono text-xs">
              2
            </span>
            <span>Add Cliniko API Key</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Generate your private Cliniko API Key in <em>Settings &rarr; Integrations</em> and insert into the HTTP header credentials.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-mono text-xs">
              3
            </span>
            <span>Activate Real-Time Sync</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Toggle the workflow to <strong>Active</strong>. Your Cliniko practice receives instant automated SOAP notes &amp; intake screening.
          </p>
        </div>
      </div>
    </div>
  );
}
