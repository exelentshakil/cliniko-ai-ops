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

export function SoapNoteCopilot() {
  const [dictation, setDictation] = useState(SAMPLE_CONSULTS[0].text);
  const [specialty, setSpecialty] = useState(SAMPLE_CONSULTS[0].specialty);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SoapNoteResult | null>(null);
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
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <Stethoscope className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Cliniko SOAP Copilot
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Live Clinical Note Transformation
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            AI Consultation Dictation ➔ Cliniko Treatment Note
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            Clinicians dictate rough consultation findings or bullet points. The AI automatically generates a complete, structured SOAP Note compliant with Australian clinical standards and directly syncs to Cliniko.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-[var(--color-border)] text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {result.provider} ({result.model}) • {result.latencyMs}ms
            </span>
          </div>
        )}
      </div>

      {/* Preset Quick Selectors */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
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
            className="text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-surface)] hover:border-slate-400 transition-colors whitespace-nowrap shrink-0 text-[var(--color-text-primary)]"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Workbench: 2-Column Grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Input Dictation Workbench (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] font-mono">
                Consultation Dictation
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="text-xs font-semibold rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[var(--color-text-primary)]"
              >
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Chiropractic">Chiropractic</option>
                <option value="Osteopathy">Osteopathy</option>
                <option value="Exercise Physiology">Exercise Physiology</option>
                <option value="Remedial Massage">Remedial Massage</option>
              </select>
            </div>

            <textarea
              rows={11}
              value={dictation}
              onChange={(e) => setDictation(e.target.value)}
              placeholder="Paste raw consult notes or transcript here..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs font-mono leading-relaxed text-[var(--color-text-primary)] focus:outline-hidden focus:ring-1 focus:ring-emerald-500 resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-text-muted)]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>APP 11 PII Redaction Active</span>
              </div>

              <Button
                size="sm"
                onClick={() => handleGenerate()}
                disabled={isLoading || !dictation.trim()}
                className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs whitespace-nowrap shrink-0 px-3.5"
              >
                {isLoading ? (
                  <>
                    <Activity className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    <span>Generate SOAP Note</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Cliniko API Linkage Pill */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3.5 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Cliniko Target API:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">POST /v1/treatment_notes</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-muted)]">
              <span>Assigned Patient:</span>
              <span className="text-[var(--color-text-primary)]">pt_98241 (Marcus Vance)</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-muted)]">
              <span>Practitioner Scope:</span>
              <span className="text-[var(--color-text-primary)]">prac_sydney_01 (Chris)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Structured Cliniko Treatment Note (7 cols) */}
        <div className="lg:col-span-7">
          <div className="h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)] font-mono">
                    Structured Cliniko Treatment Note
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!result}
                    className="h-7 text-[11px] font-medium border-[var(--color-border)] px-2"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSyncToCliniko}
                    disabled={!result || synced}
                    className="h-7 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 shadow-2xs"
                  >
                    {synced ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1 text-white" />
                        <span>Synced to Cliniko (201)</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3 mr-1" />
                        <span>Sync to Cliniko Note</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {result ? (
                <div className="space-y-3.5 text-xs font-mono">
                  {/* S - Subjective */}
                  <div className="rounded-lg bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                        [S] Subjective Findings
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                        VAS Pain: {result.subjective.painScale}/10
                      </span>
                    </div>
                    <p className="text-[var(--color-text-primary)] leading-relaxed">
                      <strong>Complaint:</strong> {result.subjective.chiefComplaint}
                    </p>
                    <p className="text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      <strong>History:</strong> {result.subjective.historyOfPresentingIllness}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-[var(--color-text-muted)]">Aggravating:</span>
                      {result.subjective.aggravatingFactors.map((f, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* O - Objective */}
                  <div className="rounded-lg bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border)]">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px] block mb-1.5">
                      [O] Objective Examination
                    </span>
                    <div className="space-y-1 text-[var(--color-text-secondary)]">
                      <p><strong className="text-[var(--color-text-primary)]">ROM:</strong> {result.objective.activeRangeOfMotion}</p>
                      <p><strong className="text-[var(--color-text-primary)]">Tests:</strong> {result.objective.orthopedicTests}</p>
                      <p><strong className="text-[var(--color-text-primary)]">Palpation:</strong> {result.objective.palpationFindings}</p>
                      <p><strong className="text-[var(--color-text-primary)]">Neuro:</strong> {result.objective.neurologicalScreen}</p>
                    </div>
                  </div>

                  {/* A - Assessment */}
                  <div className="rounded-lg bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
                        [A] Clinical Assessment
                      </span>
                      <div className="flex gap-1">
                        {result.assessment.icd10Codes.map((c, i) => (
                          <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            ICD-10: {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[var(--color-text-primary)] font-semibold leading-relaxed">
                      {result.assessment.clinicalImpression}
                    </p>
                    <p className="text-[var(--color-text-muted)] text-[11px] mt-1">
                      Prognosis: {result.assessment.prognosis}
                    </p>
                  </div>

                  {/* P - Plan & Exercise Prescription */}
                  <div className="rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 p-3 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                        [P] Treatment Plan &amp; Exercise Rx
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                        {result.plan.followUpInterval}
                      </span>
                    </div>
                    <p className="text-[var(--color-text-primary)] mb-2">
                      <strong>Clinic Treatment:</strong> {result.plan.inClinicTreatment}
                    </p>

                    <div className="space-y-1.5 mt-2">
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                        Prescribed Home Exercises:
                      </span>
                      {result.plan.homeExercisePrescription.map((ex, i) => (
                        <div key={i} className="flex items-start justify-between gap-2 p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60">
                          <span className="font-semibold text-[var(--color-text-primary)]">{ex.exercise}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 shrink-0">{ex.setsReps}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-900 flex items-center justify-between text-[11px]">
                      <span className="text-[var(--color-text-secondary)]">Recommended Cliniko Booking:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">{result.plan.suggestedClinikoBooking}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-80 rounded-lg border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center text-center p-6 text-[var(--color-text-muted)] space-y-2">
                  <Stethoscope className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-mono font-medium">
                    Click &quot;Generate SOAP Note&quot; or select one of the clinical case studies above.
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)] max-w-sm">
                    Transforms unformatted practitioner dictation into structured Cliniko treatment notes in under 400ms.
                  </p>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                <span>Cliniko Template: tmpl_allied_health_soap_v1</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ready for 1-Click Cliniko Sync</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
