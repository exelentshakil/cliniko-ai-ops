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
  Globe,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EndpointSpec {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  category: 'Clinical Records' | 'Appointments' | 'Patients' | 'Recalls' | 'Safety Alerts' | 'Webhooks';
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
    description: 'Writes finalized SOAP clinical notes directly into the Cliniko patient treatment history using Cliniko sanitized HTML formatting.',
    samplePayload: {
      patient_id: 'pt_98241',
      appointment_id: 'apt_33102',
      practitioner_id: 'pr_5501',
      treatment_note_template_id: 'tmpl_allied_soap_v1',
      content: {
        subjective: '<p><strong>Chief Complaint:</strong> Acute lower back pain radiating to left glute.</p><p><strong>History:</strong> Pain started 48 hours ago after heavy deadlift. Pain score: 6/10.</p>',
        objective: '<p><strong>ROM:</strong> Lumbar flexion limited to 45 degrees with pain.</p><ul><li>Slump test: Positive left side</li><li>Palpation: Tenderness over L4-L5 facet joint</li></ul>',
        assessment: '<p><strong>Clinical Impression:</strong> Acute L4-L5 lumbar facet joint sprain with referred gluteal radiculopathy.</p><p><strong>ICD-10:</strong> M54.5, M51.26 | <strong>SNOMED CT:</strong> 279039007</p>',
        plan: '<p>Manual therapy, soft tissue release, McKenzie extension exercises. Prescribe 4 bi-weekly rehabilitation consultations.</p>',
      },
      finalised: true,
      app11_sanitized: true,
    },
    sampleResponse: {
      id: 'tn_8849201',
      created_at: '2026-09-18T11:15:30Z',
      patient: { id: 'pt_98241', name: 'James Morrison' },
      practitioner: { id: 'pr_5501', name: 'Chris' },
      treatment_note_template: { id: 'tmpl_allied_soap_v1', name: 'Allied Health SOAP v1' },
      content: {
        subjective: '<p><strong>Chief Complaint:</strong> Acute lower back pain radiating to left glute.</p>...',
      },
      finalised: true,
      url: 'https://api.au1.cliniko.com/v1/treatment_notes/tn_8849201',
    },
  },
  {
    id: 'get-patient',
    name: 'Sync Patient Record',
    method: 'GET',
    path: '/v1/patients/pt_98241',
    category: 'Patients',
    description: 'Retrieves patient demographic data and past treatment history with automated APP 11 redaction of sensitive identifiers.',
    sampleResponse: {
      id: 'pt_98241',
      first_name: 'James',
      last_name: 'Morrison',
      medicare_card_number: '[REDACTED - APP 11 ENCRYPTED]',
      date_of_birth: '1984-**-**',
      phone_numbers: [{ type: 'Mobile', number: '[REDACTED-AU-PHONE]' }],
      concession_type: 'Medicare EPC / CDM Referral',
      referring_doctor: 'Dr. Michael Watson (North Sydney Medical Practice)',
      active_care_plan: {
        total_allocated: 5,
        used: 2,
        remaining: 3,
        expires_at: '2026-12-31',
      },
    },
  },
  {
    id: 'post-medical-alerts',
    name: 'Dispatch Safety Alert',
    method: 'POST',
    path: '/v1/medical_alerts',
    category: 'Safety Alerts',
    description: 'Posts clinical red-flag warnings directly to the Cliniko patient banner so practitioners see urgent safety alerts on arrival.',
    samplePayload: {
      patient_id: 'pt_98241',
      name: 'RED FLAG: Cauda Equina Screening Required',
      description: 'Pre-consult triage detected progressive lower-limb weakness & saddle sensory changes.',
      priority: 'Urgent',
    },
    sampleResponse: {
      id: 'ma_33109',
      created_at: '2026-09-18T11:19:02Z',
      patient_id: 'pt_98241',
      name: 'RED FLAG: Cauda Equina Screening Required',
      active: true,
      displayed_in_header: true,
    },
  },
  {
    id: 'get-appointments',
    name: 'Query Individual Appointments',
    method: 'GET',
    path: '/v1/individual_appointments?practitioner_id=pr_5501&starts_at=2026-09-18',
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
  const [activeShard, setActiveShard] = useState<'au1' | 'global'>('au1');
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedResponse, setExecutedResponse] = useState<any>(null);
  const [responseMeta, setResponseMeta] = useState<{ status: number; latency: number; remainingRate: number } | null>(null);

  const baseUrl = activeShard === 'au1' ? 'https://api.au1.cliniko.com' : 'https://api.cliniko.com';

  const handleCopy = () => {
    const curl = `curl -X ${selectedEndpoint.method} "${baseUrl}${selectedEndpoint.path}" \\
  -H "Authorization: Bearer clk_live_********************" \\
  -H "User-Agent: ClinikoOps-AI/1.0 (Chris Practice Automation - dev@practice.com.au)" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json"${
    selectedEndpoint.samplePayload
      ? ` \\\n  -d '${JSON.stringify(selectedEndpoint.samplePayload)}'`
      : ''
  }`;
    navigator.clipboard.writeText(curl);
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
        latency: Math.floor(Math.random() * 32) + 36, // 36ms - 68ms
        remainingRate: 147, // Cliniko gives 150/min
      });
    }, 550);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-bold text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 whitespace-nowrap shrink-0">
              <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Cliniko API Hub
            </span>
            <span className="rounded-md bg-teal-100 dark:bg-teal-950 px-2 py-0.5 text-xs font-mono font-bold text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 whitespace-nowrap shrink-0">
              AU Shard (150 req/min)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Cliniko API Gateway
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Interactive playground for official Cliniko REST API v1 endpoints and rate limits.
          </p>
        </div>

        {/* Shard Selector & Gateway Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 p-1 text-xs font-mono">
            <button
              onClick={() => setActiveShard('au1')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                activeShard === 'au1'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="Official Australian Shard"
            >
              api.au1.cliniko.com
            </button>
            <button
              onClick={() => setActiveShard('global')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                activeShard === 'global'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title="Global Gateway"
            >
              api.cliniko.com
            </button>
          </div>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="mt-5 flex items-center gap-2.5 overflow-x-auto pb-2 border-b border-[var(--color-border)] scrollbar-none">
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap shrink-0 border transition-all ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-100 font-extrabold shadow-2xs ring-1 ring-blue-400/30'
                  : 'bg-[var(--color-surface)] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  ep.method === 'POST'
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700'
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
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 p-3.5">
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded shadow-2xs ${
              selectedEndpoint.method === 'POST'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {selectedEndpoint.method}
          </span>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            {baseUrl}{selectedEndpoint.path}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {selectedEndpoint.description}
        </p>
      </div>

      {/* Code / Request / Response Workspace (2 cols) */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Request Payload & cURL Generator (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-surface)] overflow-hidden flex flex-col justify-between shadow-xs">
          <div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-extrabold font-mono uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  {selectedEndpoint.samplePayload ? 'Request Payload (JSON)' : 'Request Parameters'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-emerald-600" />
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

            <div className="p-4 max-h-[340px] overflow-y-auto">
              {selectedEndpoint.samplePayload ? (
                <pre className="text-xs font-mono leading-relaxed text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto font-semibold">
                  {JSON.stringify(selectedEndpoint.samplePayload, null, 2)}
                </pre>
              ) : (
                <div className="space-y-2.5 text-xs font-mono text-slate-800 dark:text-slate-200">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      Query Parameters:
                    </span>
                    <p className="mt-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {selectedEndpoint.path.includes('?') ? selectedEndpoint.path.split('?')[1] : 'Direct Resource Lookup by UUID'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      Cliniko v1 Mandatory Headers:
                    </span>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
                      Authorization: Bearer clk_live_********************<br />
                      User-Agent: ClinikoOps-AI/1.0 (dev@practice.com.au)<br />
                      Accept: application/json<br />
                      APP-11-Audit-Id: sec_au_sydney_9941
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
              Simulate Live Call to Cliniko AU Shard
            </span>
            <Button
              size="sm"
              onClick={handleExecute}
              disabled={isExecuting}
              className="h-8 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs px-4"
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
        <div className="lg:col-span-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-surface)] overflow-hidden flex flex-col justify-between shadow-xs">
          <div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-extrabold font-mono uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  Cliniko API Response (200 OK)
                </span>
              </div>
              {responseMeta && (
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700">
                    {responseMeta.status} OK
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {responseMeta.latency}ms
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Rate: {responseMeta.remainingRate}/150
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 max-h-[340px] overflow-y-auto">
              <pre className="text-xs font-mono leading-relaxed text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto font-semibold">
                {JSON.stringify(executedResponse || selectedEndpoint.sampleResponse, null, 2)}
              </pre>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Cliniko v1 Token-Bucket Protected &bull; Zero Rate Violations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
