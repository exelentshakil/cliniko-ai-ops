'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IntakeTriageResult } from '@/lib/cliniko-ai';

const SAMPLE_INTAKES = [
  {
    patientName: 'Emma Richardson',
    dob: '14/05/1988',
    painLocation: 'Cervical Spine & Right Trapezius',
    symptoms: 'Constant dull ache radiating across right shoulder blade after 8 hours daily computer work. Mild headache in occipital region.',
    duration: '3 weeks',
    painScale: 5,
    medicalHistory: 'No prior surgeries. Mild asthma.',
  },
  {
    patientName: 'David Thompson',
    dob: '02/11/1975',
    painLocation: 'Severe Lumbar Spine & Bilateral Legs',
    symptoms: 'Sudden onset excruciating low back pain after deadlifting. Patient mentions difficulty urinating since yesterday and tingling around groin area.',
    duration: '24 hours',
    painScale: 9,
    medicalHistory: 'Hypertension. Previous L4/L5 laminectomy 6 years ago.',
  },
  {
    patientName: 'Chloe Zhang',
    dob: '28/09/2001',
    painLocation: 'Right Ankle & Lateral Ligament',
    symptoms: 'Inverted ankle during netball match. Immediate swelling and bruising. Able to bear weight with limp. No crack or pop heard.',
    duration: '2 days',
    painScale: 6,
    medicalHistory: 'None. First ankle injury.',
  },
];

export function PatientIntakeTriage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [intake, setIntake] = useState(SAMPLE_INTAKES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<IntakeTriageResult | null>(null);

  const handleTriage = async (intakeData?: typeof SAMPLE_INTAKES[0]) => {
    setIsLoading(true);
    const data = intakeData || intake;
    try {
      const res = await fetch('/api/ai/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: data.symptoms,
          painLocation: data.painLocation,
          duration: data.duration,
          painScale: data.painScale,
          medicalHistory: data.medicalHistory,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setTriageResult(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0">
              <FileCheck2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              Patient Intake &amp; Triage Engine
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Automated Cliniko Booking Optimization
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            AI Pre-Consultation Screening &amp; Red-Flag Detection
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-3xl">
            Automatically scans incoming patient intake forms for clinical contraindications and red flags, scores urgency, and matches the patient to the right practitioner and Cliniko consultation duration.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => handleTriage()}
            disabled={isLoading}
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs whitespace-nowrap shrink-0 px-3.5"
          >
            {isLoading ? (
              <>
                <Activity className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                <span>Screening...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                <span>Run Intake Triage</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Intake Samples Selector */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_INTAKES.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedIdx(idx);
              setIntake(item);
              handleTriage(item);
            }}
            className={`text-left p-3 rounded-xl border transition-all ${
              selectedIdx === idx
                ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20'
                : 'border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-surface)]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                {item.patientName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                VAS {item.painScale}/10
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {item.painLocation}
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] font-mono mt-1">
              Duration: {item.duration}
            </p>
          </button>
        ))}
      </div>

      {/* Triage Detail Display Grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Raw Intake Form Data (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <span className="font-bold text-[var(--color-text-secondary)] uppercase">
              Incoming Intake Payload
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Cliniko Webhook: patient.intake_submitted
            </span>
          </div>

          <div className="space-y-1.5 text-[var(--color-text-primary)]">
            <p><strong>Patient:</strong> {intake.patientName}</p>
            <p><strong>Primary Complaint:</strong> {intake.painLocation}</p>
            <p><strong>Symptom Onset:</strong> {intake.duration}</p>
            <p><strong>Reported VAS Pain:</strong> {intake.painScale}/10</p>
            <p><strong>Medical History:</strong> {intake.medicalHistory}</p>
          </div>

          <div className="pt-2 border-t border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block mb-1">Patient Description:</span>
            <p className="text-[11px] bg-[var(--color-surface)] p-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] leading-relaxed">
              &quot;{intake.symptoms}&quot;
            </p>
          </div>
        </div>

        {/* Right: AI Clinical Triage & Cliniko Recommendation (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex flex-col justify-between shadow-xs">
          {triageResult ? (
            <div className="space-y-3 font-mono text-xs">
              {/* Category Alert Banner */}
              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  triageResult.triageCategory === 'Urgent'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                    : triageResult.triageCategory === 'Priority'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {triageResult.triageCategory === 'Urgent' ? (
                    <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <div>
                    <span className="font-bold uppercase text-[11px]">
                      Triage Category: {triageResult.triageCategory}
                    </span>
                    <p className="text-[11px] font-normal opacity-90">
                      {triageResult.triageCategory === 'Urgent'
                        ? 'Red flag contraindications detected. Senior clinician notification dispatched.'
                        : 'Suitable for standard allied health treatment protocol.'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border font-bold">
                  {triageResult.durationMinutes} min
                </span>
              </div>

              {/* Red Flags If Any */}
              {triageResult.redFlagsIdentified.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300">
                  <span className="font-bold text-[11px] uppercase block mb-1">
                    ⚠️ Clinical Red Flags Flagged:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {triageResult.redFlagsIdentified.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Appointment Booking Recommendation */}
              <div className="p-3 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text-secondary)] uppercase text-[11px]">
                    Recommended Cliniko Appointment Type
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {triageResult.recommendedPractitionerSpecialty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>{triageResult.recommendedAppointmentType}</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  {triageResult.clinicalSummary}
                </p>
              </div>

              {/* Preliminary Care Notes */}
              <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)]">
                <strong>Preliminary Care Directive:</strong> {triageResult.preliminaryCareNotes}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[var(--color-text-muted)] space-y-2">
              <FileCheck2 className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-mono">
                Click &quot;Run Intake Triage&quot; or select a patient above to test clinical screening.
              </p>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
            <span>Cliniko Patient Sync: Instant</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Zero Unbooked Gaps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
