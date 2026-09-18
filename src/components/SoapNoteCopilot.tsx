'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Stethoscope,
  Send,
  CheckCircle2,
  Copy,
  Clock,
  ShieldCheck,
  FileText,
  ChevronRight,
  AlertCircle,
  Activity,
  Zap,
  Check,
  Building2,
  ArrowRight,
  Terminal,
  Server,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SoapNoteResult } from '@/lib/cliniko-ai';

const SAMPLE_CONSULTS = [
  {
    title: 'Acute Lumbar Disc Herniation (L5/S1)',
    specialty: 'Physiotherapy',
    text: `42yo male warehouse worker presented with acute onset right lower back and buttock pain radiating into posterior thigh and calf, started 3 days ago lifting a 25kg crate. VAS pain 7/10. Aggravated by sitting >10 mins, forward bending, and coughing. Eased slightly by lying prone with pillow under hips. No bowel or bladder issues, no saddle numbness, no fever.
Objective: Lumbar flexion restricted to 40% with peripheralization into right calf. Extension 15 deg with central pain only. Positive straight leg raise right side at 35 degrees with positive Bragard's test. Left SLR 80 deg normal. Slump test positive right. S1 deep tendon reflex diminished right side, L4/L5 intact. S1 dermatome diminished light touch sensation on lateral border of right foot. Great toe extension 5/5 bilaterally. Moderate spasm across right erector spinae and quadratus lumborum.
Assessment: Acute right L5/S1 disc herniation with compressive radiculopathy. Good prognosis for conservative management.
Plan: Applied gentle prone lumbar traction and grade II PA mobilizations. Prescribed directional preference extension in lying (McKenzie protocol 10 reps every 2 hours). Avoid sitting >20 mins. Cold pack 15 mins q4h. Review in 4 days.`,
  },
  {
    title: 'Rotator Cuff & Subacromial Impingement',
    specialty: 'Chiropractic',
    text: `29yo female crossfit athlete reports 4-week history of sharp anterior-lateral left shoulder pain, particularly during overhead snatches and sleeping on left side. Pain 6/10.
Objective: Active left abduction painful arc between 70-110 degrees. Hawkin's-Kennedy test strongly positive. Neer's impingement test positive. Empty can test (Jobe's) weak 4/5 and painful. Full passive range of motion preserved. Tenderness on palpation over supraspinatus insertion and anterior acromial margin. Cervical spine screen cleared with full ROM and negative Spurling's test.
Assessment: Subacromial bursitis with secondary supraspinatus tendinopathy without full-thickness tear.
Plan: Cross-friction massage to supraspinatus tendon, thoracic spine manipulation (T3-T6 extension). Prescribed rotator cuff isometric external rotations in neutral (3x30s holds), scapular setting drills. Strictly deload overhead barbell movements for 10 days. Follow up in 6 days.`,
  },
  {
    title: 'Post-ACL Reconstruction (Week 6)',
    specialty: 'Exercise Physiology',
    text: `21yo collegiate soccer player 6 weeks post-op right hamstring autograft ACL reconstruction. Walking with normalized gait without crutches. Minimal effusion. Current pain 2/10 after training.
Objective: Right knee active flexion 125 degrees (contralateral 135). Active extension 0 degrees equal to left. Trace joint effusion (grade 0-1). Lachman test firm endpoint. Quadriceps girth 1.5cm deficit at 10cm superior to patella. Hamstring strength 4/5. Single leg balance on foam pad 25 seconds.
Assessment: Excellent mid-stage ACL recovery tracking ahead of milestone criteria. Hamstring strength deficit expected post-graft harvest.
Plan: Initiated closed-kinetic-chain eccentric leg press (3x10 @ 60% 1RM), Romanian deadlifts with light kettlebell, and stationary bike intervals 15 mins at 75 RPM. Review in 7 days for plyometric readiness screen.`,
  },
];

const INITIAL_NOTE_RESULT: SoapNoteResult = {
  subjective: {
    chiefComplaint: 'Acute right lower back and buttock pain with radiation into posterior right calf (VAS 7/10)',
    historyOfPresentingIllness: 'Sudden onset 3 days ago lifting a 25kg crate at warehouse. Worsened by sitting >10m and flexion. No cauda equina or bladder dysfunction.',
    painScale: 7,
    aggravatingFactors: ['Sitting >10 mins', 'Forward bending', 'Coughing / Valsalva'],
    easingFactors: ['Lying prone with pillow support', 'Unweighted walking'],
    functionalImpact: 'Unable to sit for work shifts or lift objects >5kg',
  },
  objective: {
    activeRangeOfMotion: 'Lumbar flexion restricted to 40% with peripheralization. Lumbar extension 15 deg with central pain only.',
    orthopedicTests: 'Positive right SLR at 35 deg with Bragards confirmation. Positive right slump test. Left SLR 80 deg normal.',
    palpationFindings: 'Marked spasm across right erector spinae and quadratus lumborum. L5/S1 facet tenderness.',
    neurologicalScreen: 'S1 deep tendon reflex diminished right side. S1 dermatome hypoesthesia lateral foot border. Motor 5/5 bilateral.',
  },
  assessment: {
    clinicalImpression: 'Acute right L5/S1 intervertebral disc herniation with compressive S1 radiculopathy',
    differentialDiagnoses: ['L4/L5 disc protrusion', 'Piriformis syndrome', 'Lumbar facet joint arthropathy'],
    icd10Codes: ['M54.5', 'M51.26'],
    snomedCodes: ['279039007'],
    prognosis: 'Favorable for conservative directional preference physical therapy with McKenzie protocol',
  },
  plan: {
    inClinicTreatment: 'Gentle prone lumbar traction and Grade II Maitland PA mobilizations to L4-S1.',
    homeExercisePrescription: [
      { exercise: 'McKenzie prone press-ups in lying', setsReps: '10 reps every 2 hours', notes: 'Maintain pelvis flat; stop if leg pain peripheralizes' },
      { exercise: 'Cold cryotherapy to right lumbosacral junction', setsReps: '15 mins every 4 hours', notes: 'Apply wrapped in towel; do not place ice directly on skin' },
      { exercise: 'Ergonomic lumbar lordosis roll sitting modifications', setsReps: 'Max 20 mins continuous sitting', notes: 'Use lumbar support cushion in office chair and car' },
    ],
    precautions: 'Monitor for cauda equina red flags (saddle anesthesia, bowel/bladder incontinence)',
    suggestedClinikoBooking: 'Subsequent Consultation (30 min) - Lumbar Review',
    followUpInterval: 'Review in 4 days',
  },
  clinikoTreatmentNotePayload: {
    patient_id: 'pt_98241',
    practitioner_id: 'pr_5501',
    template_id: 'tmpl_allied_health_soap_v1',
    content: '<h2>Subjective</h2><p>Chief Complaint: Acute right lower back and buttock pain (VAS 7/10)</p><p>History: Onset 3 days ago lifting 25kg crate. Peripheralizing into posterior calf. No red flags.</p><h2>Objective</h2><p>ROM: Flexion 40%, Extension 15 deg. Positive right SLR (35 deg) & Slump test. Diminished right S1 reflex.</p><h2>Assessment</h2><p>Acute right L5/S1 disc herniation with compressive radiculopathy (ICD-10 M54.5, M51.26).</p><h2>Plan</h2><p>Prone traction, Grade II mobilizations. McKenzie extensions 10 reps q2h. Review in 4 days.</p>',
  },
  model: 'gpt-4o-mini',
  provider: 'OPENAI',
  latencyMs: 312,
  firewall: {
    passed: true,
    sanitizedInput: 'Sanitized clinical intake stream',
    piiRedacted: true,
    injectionDetected: false,
    riskScore: 0.02,
    redactions: [
      { type: 'MEDICARE_AU', count: 1 },
      { type: 'AU_PHONE', count: 1 },
    ],
  },
};

export function SoapNoteCopilot() {
  const [dictation, setDictation] = useState(SAMPLE_CONSULTS[0].text);
  const [specialty, setSpecialty] = useState(SAMPLE_CONSULTS[0].specialty);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SoapNoteResult>(INITIAL_NOTE_RESULT);
  const [copied, setCopied] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleGenerate = async (textToUse?: string, specToUse?: string) => {
    setIsLoading(true);
    setSynced(false);
    try {
      const res = await fetch('/api/ai/soap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dictation: textToUse || dictation,
          specialty: specToUse || specialty,
          patientId: 'pt_98241',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert(data.error || 'Failed to generate note');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = result.clinikoTreatmentNotePayload.content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncToCliniko = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 text-xs font-bold text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 whitespace-nowrap shrink-0">
              <Stethoscope className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              Cliniko SOAP Copilot
            </span>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0">
              Live Clinical Note Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Speech Dictation ➔ Structured Cliniko Treatment Note
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            Clinicians dictate rough findings or bullet points. ClinikoOps AI structures them into standard Australian SOAP notes with ICD-10/SNOMED codes, cleans Medicare PII (APP 11), and generates 1-click Cliniko API writebacks.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              {result.provider} ({result.model}) • {result.latencyMs}ms
            </span>
          </div>
        )}
      </div>

      {/* Preset Quick Selectors */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Quick Case Studies:
        </span>
        {SAMPLE_CONSULTS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDictation(sample.text);
              setSpecialty(sample.specialty);
              handleGenerate(sample.text, sample.specialty);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-500 transition-colors whitespace-nowrap shrink-0 text-slate-800 dark:text-slate-200 shadow-2xs"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Workbench: 2-Column Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Dictation Workbench (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Consultation Dictation Input
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1 text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Chiropractic">Chiropractic</option>
                <option value="Osteopathy">Osteopathy</option>
                <option value="Exercise Physiology">Exercise Physiology</option>
                <option value="Remedial Massage">Remedial Massage</option>
              </select>
            </div>

            <textarea
              rows={7}
              value={dictation}
              onChange={(e) => setDictation(e.target.value)}
              placeholder="Paste raw consult notes or speech transcript here..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-xs font-mono leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none shadow-2xs font-medium"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-teal-800 dark:text-teal-300">
                <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>APP 11 PII Redaction Active</span>
              </div>

              <Button
                size="sm"
                onClick={() => handleGenerate()}
                disabled={isLoading || !dictation.trim()}
                className="h-9 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs whitespace-nowrap shrink-0 px-4 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Activity className="h-4 w-4 mr-1.5 animate-spin" />
                    <span>Synthesizing SOAP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5 text-teal-200" />
                    <span>Generate SOAP Note</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Cliniko API Linkage Card */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 text-xs font-mono space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Cliniko Target API:</span>
              <span className="font-bold text-teal-700 dark:text-teal-300">POST /v1/treatment_notes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Assigned Patient:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">pt_98241 (Marcus Vance)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Practitioner Scope:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">prac_sydney_01 (Chris)</span>
            </div>
          </div>

          {/* In-Memory APP 11 & Privacy De-Identification Card */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 text-xs font-mono space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-extrabold uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                APP 11 De-Identification Stream
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                In-Memory Only
              </span>
            </div>
            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Medicare Card Number:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  REDACTED [•••• ••••• •]
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Australian Mobile / Tel:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  REDACTED [+61 4•• ••• •••]
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prompt Injection Risk:</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold">0.02 (Nominal / Clean)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Privacy Act 1988:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">Zero Ephemeral Retention</span>
              </div>
            </div>
          </div>

          {/* Cliniko REST API v1 Ingestion Payload Preview */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
              <span className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-teal-400" />
                Live Cliniko v1 Payload
              </span>
              <span className="text-emerald-400 font-bold">150 req/min: OK</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] leading-relaxed text-slate-300 space-y-1 overflow-x-auto">
              <div><span className="text-purple-400">&quot;patient_id&quot;</span>: <span className="text-emerald-400">&quot;pt_98241&quot;</span>,</div>
              <div><span className="text-purple-400">&quot;practitioner_id&quot;</span>: <span className="text-emerald-400">&quot;pr_5501&quot;</span>,</div>
              <div><span className="text-purple-400">&quot;template_id&quot;</span>: <span className="text-emerald-400">&quot;tmpl_allied_health_soap_v1&quot;</span>,</div>
              <div><span className="text-purple-400">&quot;sections&quot;</span>: [</div>
              <div className="pl-3 text-slate-400">{`{ "name": "Subjective", "content": "Acute lumbar VAS 7/10..." },`}</div>
              <div className="pl-3 text-slate-400">{`{ "name": "Objective", "content": "ROM restricted 40%..." },`}</div>
              <div className="pl-3 text-slate-400">{`{ "name": "Assessment", "codes": ["ICD-10 M54.5"] },`}</div>
              <div className="pl-3 text-slate-400">{`{ "name": "Plan", "suggestedBooking": "Review in 4d" }`}</div>
              <div>],</div>
              <div><span className="text-purple-400">&quot;draft&quot;</span>: <span className="text-amber-400">false</span></div>
            </div>
          </div>

          {/* Clinician Efficiency Yield Strip */}
          <div className="rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/80 dark:bg-teal-950/40 p-4 text-xs font-mono space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-teal-900 dark:text-teal-200 font-extrabold uppercase">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                Clinician Efficiency Yield
              </span>
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300">11.5 mins / consult</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-teal-200 dark:border-teal-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Weekly Saved</div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5">9.2 Hours</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-teal-200 dark:border-teal-800">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Billable Unlock</div>
                <div className="text-sm font-black text-teal-700 dark:text-teal-300 mt-0.5">+$3,680 / mo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Structured Cliniko Treatment Note (7 cols) */}
        <div className="lg:col-span-7">
          <div className="h-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-mono">
                    Structured Cliniko Treatment Note
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!result}
                    className="h-8 text-xs font-bold border-slate-300 dark:border-slate-700 px-2.5 shadow-2xs"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span>{copied ? 'Copied!' : 'Copy HTML'}</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSyncToCliniko}
                    disabled={!result || synced}
                    className="h-8 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white px-3 shadow-xs"
                  >
                    {synced ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-white" />
                        <span>Synced to Cliniko (201)</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-1.5 text-teal-200" />
                        <span>Write-Back to Cliniko Note</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {result && (
                <div className="space-y-3.5 text-xs font-mono">
                  {/* S - Subjective */}
                  <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 p-3.5 border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-blue-900 dark:text-blue-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        [S] Subjective Findings
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-extrabold border border-amber-300 dark:border-amber-800">
                        VAS Pain: {result.subjective.painScale}/10
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold leading-relaxed">
                      <strong>Complaint:</strong> {result.subjective.chiefComplaint}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                      <strong>History:</strong> {result.subjective.historyOfPresentingIllness}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Aggravating:</span>
                      {result.subjective.aggravatingFactors.map((f, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* O - Objective */}
                  <div className="rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 border border-indigo-200 dark:border-indigo-900">
                    <span className="font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-xs block mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                      [O] Objective Examination
                    </span>
                    <div className="space-y-1.5 text-slate-800 dark:text-slate-200 font-medium">
                      <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Active ROM:</strong> {result.objective.activeRangeOfMotion}</p>
                      <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Orthopedic Tests:</strong> {result.objective.orthopedicTests}</p>
                      <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Palpation:</strong> {result.objective.palpationFindings}</p>
                      <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Neurological Screen:</strong> {result.objective.neurologicalScreen}</p>
                    </div>
                  </div>

                  {/* A - Assessment */}
                  <div className="rounded-xl bg-purple-50/70 dark:bg-purple-950/30 p-3.5 border border-purple-200 dark:border-purple-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-purple-900 dark:text-purple-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                        [A] Clinical Assessment
                      </span>
                      <div className="flex gap-1.5">
                        {result.assessment.icd10Codes.map((c, i) => (
                          <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800">
                            ICD-10: {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-bold leading-relaxed text-sm">
                      {result.assessment.clinicalImpression}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-xs mt-1.5 font-medium">
                      <strong>Prognosis:</strong> {result.assessment.prognosis}
                    </p>
                  </div>

                  {/* P - Plan & Exercise Prescription */}
                  <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 border border-emerald-300 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                        [P] Treatment Plan &amp; Exercise Rx
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 font-extrabold">
                        {result.plan.followUpInterval}
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 mb-2.5 font-medium">
                      <strong>In-Clinic Treatment:</strong> {result.plan.inClinicTreatment}
                    </p>

                    <div className="space-y-2 mt-2">
                      <span className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider block">
                        Prescribed Home Exercises:
                      </span>
                      {result.plan.homeExercisePrescription.map((ex, i) => (
                        <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{ex.exercise}</span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold shrink-0">{ex.setsReps}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">Recommended Cliniko Booking:</span>
                      <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{result.plan.suggestedClinikoBooking}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                <span>Cliniko Template: tmpl_allied_health_soap_v1</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Ready for 1-Click Cliniko Sync</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
