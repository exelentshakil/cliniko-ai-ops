'use client';

import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Copy,
  Check,
  Play,
  Server,
  ShieldCheck,
  Clock,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EndpointSpec {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Clinical Records' | 'Appointments' | 'Patients' | 'Webhooks';
  description: string;
  samplePayload?: Record<string, any>;
  sampleResponse: Record<string, any>;
}

const CLINIKO_ENDPOINTS: EndpointSpec[] = [
  {
    id: 'post-treatment-notes',
    name: 'Create Treatment Note',
    method: 'POST',
    path: '/v1/treatment_notes',
    category: 'Clinical Records',
    description: 'Writes finalized SOAP clinical notes directly into the Cliniko patient treatment history.',
    samplePayload: {
      patient_id: 'pt_98241',
      appointment_id: 'apt_33102',
      practitioner_id: 'pr_5501',
      treatment_note_template_id: 'tmpl_allied_soap_v2',
      content: {
        subjective: 'Patient reports persistent lower back pain following gym deadlifts...',
        objective: 'Active lumbar flexion limited to 45 deg with pain...',
        assessment: 'L4/L5 facet joint irritation secondary to acute mechanical strain.',
        plan: 'Manual therapy, dry needling to gluteus medius, prescribed McKenzie extensions.',
      },
      finalised: true,
      app11_sanitized: true,
    },
    sampleResponse: {
      id: 'tn_8849201',
      created_at: '2026-09-18T11:15:30Z',
      patient: { id: 'pt_98241', name: 'James Morrison' },
      practitioner: { id: 'pr_5501', name: 'Chris' },
      status: 'finalised',
      synced_via: 'ClinikoOps-AI-Worker',
    },
  },
  {
    id: 'get-patients',
    name: 'Get Patient Demographics',
    method: 'GET',
    path: '/v1/patients/pt_98241',
    category: 'Patients',
    description: 'Retrieves patient profile, Medicare card number, emergency contact, and medical alerts.',
    sampleResponse: {
      id: 'pt_98241',
      first_name: 'James',
      last_name: 'Morrison',
      date_of_birth: '1984-06-12',
      medicare_number: '2345 67890 1',
      medicare_reference_number: '1',
      phone_number: '+61 412 345 678',
      email: 'james.m@example.com.au',
      medical_alerts: ['No known drug allergies', 'Previous right knee ACL reconstruction 2019'],
      concession_type: 'Private Health',
    },
  },
  {
    id: 'get-appointments',
    name: 'Query Practitioner Schedule',
    method: 'GET',
    path: '/v1/appointments?practitioner_id=pr_5501&starts_at=2026-09-18',
    category: 'Appointments',
    description: 'Reads daily clinic appointments to feed pre-consultation AI triage and post-session note copilot.',
    sampleResponse: {
      total_entries: 6,
      appointments: [
        {
          id: 'apt_33102',
          starts_at: '2026-09-18T09:00:00+10:00',
          ends_at: '2026-09-18T09:45:00+10:00',
          appointment_type: 'Initial Physiotherapy Consultation',
          patient_name: 'James Morrison',
          status: 'Arrived',
          intake_completed: true,
        },
        {
          id: 'apt_33103',
          starts_at: '2026-09-18T10:00:00+10:00',
          ends_at: '2026-09-18T10:30:00+10:00',
          appointment_type: 'Standard Follow-Up',
          patient_name: 'Sarah Jenkins',
          status: 'Booked',
          intake_completed: false,
        },
      ],
    },
  },
  {
    id: 'post-webhooks',
    name: 'Register Cliniko Event Webhooks',
    method: 'POST',
    path: '/v1/webhooks',
    category: 'Webhooks',
    description: 'Configures real-time Cliniko event subscriptions for automated intake triage and note triggers.',
    samplePayload: {
      event_type: 'appointment.created',
      target_url: 'https://cliniko-ai-ops.vercel.app/api/webhooks/cliniko',
      secret: 'whsec_cliniko_prod_998124',
      subscribed_at: '2026-09-18T11:00:00Z',
    },
    sampleResponse: {
      id: 'wh_77192',
      event_type: 'appointment.created',
      target_url: 'https://cliniko-ai-ops.vercel.app/api/webhooks/cliniko',
      active: true,
      delivery_success_rate: '99.98%',
    },
  },
];

export function ClinikoApiHub() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec>(CLINIKO_ENDPOINTS[0]);
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedResponse, setExecutedResponse] = useState<any>(null);
  const [responseMeta, setResponseMeta] = useState<{ status: number; latency: number; remainingRate: number } | null>(null);

  const curlCommand = `curl -X ${selectedEndpoint.method} "https://api.cliniko.com${selectedEndpoint.path}" \\
  -H "Authorization: Bearer clk_test_apiKey_sydney_99412" \\
  -H "User-Agent: ClinikoOps-AI/1.0 (Chris Practice Automation)" \\
  -H "Accept: application/json"${
    selectedEndpoint.samplePayload
      ? ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(selectedEndpoint.samplePayload, null, 2)}'`
      : ''
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutedResponse(null);
    setResponseMeta(null);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutedResponse(selectedEndpoint.sampleResponse);
      setResponseMeta({
        status: 200,
        latency: Math.floor(Math.random() * 40) + 38, // 38ms - 78ms
        remainingRate: 147, // Cliniko gives 150/min
      });
    }, 600);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
              <Server className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              Cliniko REST API v1 Hub
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Token-Bucket: 150 Req / Min
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Live Cliniko API Gateway &amp; Webhook Orchestrator
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            Interactive playground demonstrating two-way integration with Cliniko’s REST API v1. Supports high-throughput treatment note write-backs, patient synchronization, and automated appointment event webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-secondary)]">
            <span className="text-emerald-500 font-bold mr-1.5">●</span>
            v1.api.cliniko.com: <strong className="text-[var(--color-text-primary)]">Ready</strong>
          </div>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--color-border)] scrollbar-none">
        {CLINIKO_ENDPOINTS.map((ep) => {
          const isSelected = selectedEndpoint.id === ep.id;
          return (
            <button
              key={ep.id}
              onClick={() => {
                setSelectedEndpoint(ep);
                setExecutedResponse(null);
                setResponseMeta(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 border transition-all ${
                isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-semibold shadow-2xs'
                  : 'bg-[var(--color-panel-subtle)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                  ep.method === 'POST'
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                    : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                }`}
              >
                {ep.method}
              </span>
              <span>{ep.name}</span>
            </button>
          );
        })}
      </div>

      {/* Endpoint Detail Banner */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-[var(--color-panel-subtle)] border border-[var(--color-border)] p-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              selectedEndpoint.method === 'POST'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {selectedEndpoint.method}
          </span>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            https://api.cliniko.com{selectedEndpoint.path}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {selectedEndpoint.description}
        </p>
      </div>

      {/* Code / Request / Response Workspace (2 cols) */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Request Payload & cURL Generator (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 bg-[var(--color-panel-subtle)] border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-bold font-mono uppercase text-[var(--color-text-secondary)]">
                  {selectedEndpoint.samplePayload ? 'Request Payload (JSON)' : 'Request Parameters'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-[10px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-emerald-500" />
                    <span>Copied cURL</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    <span>Copy cURL</span>
                  </>
                )}
              </Button>
            </div>

            <div className="p-3 max-h-[340px] overflow-y-auto">
              {selectedEndpoint.samplePayload ? (
                <pre className="text-[11px] font-mono leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-panel-subtle)] p-3 rounded-lg border border-[var(--color-border)] overflow-x-auto">
                  {JSON.stringify(selectedEndpoint.samplePayload, null, 2)}
                </pre>
              ) : (
                <div className="space-y-2 text-xs font-mono text-[var(--color-text-secondary)]">
                  <div className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] block uppercase">
                      Query Parameters:
                    </span>
                    <p className="mt-1 text-[var(--color-text-primary)]">
                      {selectedEndpoint.path.includes('?') ? selectedEndpoint.path.split('?')[1] : 'Direct Resource Lookup by UUID'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)]">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] block uppercase">
                      Security &amp; Headers:
                    </span>
                    <p className="mt-1 text-[var(--color-text-primary)]">
                      Authorization: Bearer &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;<br />
                      User-Agent: ClinikoOps-AI/1.0 (Australia/Sydney)<br />
                      APP-11-Audit-Id: sec_au_9941
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-[var(--color-panel-subtle)] border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
              Simulate Live Call to Cliniko Sandbox
            </span>
            <Button
              size="sm"
              onClick={handleExecute}
              disabled={isExecuting}
              className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
            >
              {isExecuting ? (
                <>
                  <Clock className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  <span>Execute Test Call</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Live Response & Telemetry (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-3 bg-[var(--color-panel-subtle)] border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-bold font-mono uppercase text-[var(--color-text-secondary)]">
                  Cliniko API Response (200 OK)
                </span>
              </div>
              {responseMeta && (
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                    {responseMeta.status} OK
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    {responseMeta.latency}ms
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    Rate-Limit: {responseMeta.remainingRate}/150
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 max-h-[340px] overflow-y-auto">
              <pre className="text-[11px] font-mono leading-relaxed text-[var(--color-text-primary)] bg-[var(--color-panel-subtle)] p-3 rounded-lg border border-[var(--color-border)] overflow-x-auto">
                {JSON.stringify(executedResponse || selectedEndpoint.sampleResponse, null, 2)}
              </pre>
            </div>
          </div>

          <div className="p-3 bg-[var(--color-panel-subtle)] border-t border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Cliniko v1 Token-Bucket Protected &bull; Zero Rate Violations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
