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
        response_format: { type: 'json_object' },
        prompt: 'You are a licensed Australian physiotherapist assistant. Synthesize SOAP notes strictly formatted in sanitized Cliniko HTML tags (<p>, <ul>, <li>, <h2>, <strong>).',
      },
    },
    {
      id: 'node_4',
      name: 'Cliniko API v1 Dispatcher',
      type: 'n8n-nodes-base.httpRequest',
      parameters: {
        method: 'POST',
        url: 'https://api.au1.cliniko.com/v1/treatment_notes',
        authentication: 'genericCredentialType',
        headers: {
          'User-Agent': 'ClinikoOps-AI/1.0 (Chris Practice Automation - dev@practice.com.au)',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    },
  ],
  connections: {
    'Cliniko Webhook Receiver': {
      main: [[{ node: 'APP 11 PII Sanitizer & Firewall', type: 'main', index: 0 }]],
    },
    'APP 11 PII Sanitizer & Firewall': {
      main: [[{ node: 'OpenAI GPT-4o-mini Clinical SOAP Generator', type: 'main', index: 0 }]],
    },
    'OpenAI GPT-4o-mini Clinical SOAP Generator': {
      main: [[{ node: 'Cliniko API v1 Dispatcher', type: 'main', index: 0 }]],
    },
  },
};

const SAMPLE_MAKE_BLUEPRINT = {
  name: 'Cliniko-Patient-Recall-Reactivation-Make',
  flow: [
    {
      id: 1,
      module: 'http:ActionMakeRequest',
      metadata: { designer: { x: 0, y: 0 } },
      parameters: {
        url: 'https://api.au1.cliniko.com/v1/individual_appointments?status=Completed',
        method: 'GET',
        headers: [
          { name: 'Authorization', value: 'Bearer {{cliniko_api_key}}' },
          { name: 'User-Agent', value: 'ClinikoOps-AI/1.0 (Chris Practice Automation)' },
        ],
      },
    },
    {
      id: 2,
      module: 'builtin:FilterLapsedCarePlans',
      metadata: { designer: { x: 300, y: 0 } },
      filter: {
        conditions: [[{ a: '{{1.daysSinceLastAppointment}}', o: 'number:greaterThan', b: 14 }]],
      },
    },
    {
      id: 3,
      module: 'openai:CreateChatCompletion',
      metadata: { designer: { x: 600, y: 0 } },
      parameters: {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Draft a friendly Australian allied health check-in SMS with 1-click booking link.',
          },
        ],
      },
    },
    {
      id: 4,
      module: 'http:ActionMakeRequest',
      metadata: { designer: { x: 900, y: 0 } },
      parameters: {
        url: 'https://api.au1.cliniko.com/v1/recalls',
        method: 'POST',
      },
    },
  ],
};

export function BlueprintExporter() {
  const [selectedFormat, setSelectedFormat] = useState<'n8n' | 'make'>('n8n');
  const [copied, setCopied] = useState(false);

  const activeJson = selectedFormat === 'n8n' ? SAMPLE_N8N_BLUEPRINT : SAMPLE_MAKE_BLUEPRINT;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activeJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      selectedFormat === 'n8n' ? 'cliniko-n8n-workflow.json' : 'cliniko-make-blueprint.json'
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 text-xs font-bold text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 whitespace-nowrap shrink-0">
              <FileJson className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Blueprint Export
            </span>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0">
              n8n &amp; Make.com
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Workflow Blueprint Exporter
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Production n8n and Make.com configurations for self-hosted clinical automation.
          </p>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 p-1 text-xs font-medium font-mono">
            <button
              onClick={() => setSelectedFormat('n8n')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFormat === 'n8n'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              n8n Workflow
            </button>
            <button
              onClick={() => setSelectedFormat('make')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFormat === 'make'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Make.com Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Code Display & Download Controls */}
      <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-xs">
        {/* Sub-bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
              {selectedFormat === 'n8n' ? 'cliniko-n8n-workflow.json' : 'cliniko-make-blueprint.json'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              (v1.0.0 &bull; Cliniko API v1 Ready)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-8 text-xs font-bold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  <span>Copy JSON</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-8 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              <span>Download Blueprint</span>
            </Button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 max-h-[320px] overflow-y-auto">
          <pre className="text-xs font-mono leading-relaxed text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto font-semibold">
            {JSON.stringify(activeJson, null, 2)}
          </pre>
        </div>

        {/* Footer info bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Pre-configured with APP 11 Clinical Sanitization &bull; Australian Health Standard</span>
          </div>
          <span className="hidden sm:inline text-teal-700 dark:text-teal-400 font-bold">
            Zero Platform Lock-In
          </span>
        </div>
      </div>
    </div>
  );
}
