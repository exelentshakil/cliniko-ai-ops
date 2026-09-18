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
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IntakeTriageResult } from '@/lib/cliniko-ai';

const SAMPLE_INTAKES = [
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
    patientName: 'Emma Richardson',
    dob: '14/05/1988',
    painLocation: 'Cervical Spine & Right Trapezius',
    symptoms: 'Constant dull ache radiating across right shoulder blade after 8 hours daily computer work. Mild headache in occipital region.',
    duration: '3 weeks',
    painScale: 5,
    medicalHistory: 'No prior surgeries. Mild asthma.',
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

const INITIAL_TRIAGE_RESULT: IntakeTriageResult = {
  triageCategory: 'Urgent',
  durationMinutes: 60,
  recommendedAppointmentType: 'Emergency Neurological Assessment & GP Referral (60 min)',
  recommendedPractitionerSpecialty: 'Senior Musculoskeletal Physiotherapist',
  clinicalSummary: 'Patient presents with severe acute lumbar pain accompanied by bilateral leg tingling, subjective groin/saddle paresthesia, and acute urinary hesitancy. These constitutional symptoms represent red flags for Cauda Equina Syndrome.',
  redFlagsIdentified: [
    'Acute urinary retention / bladder hesitancy',
    'Subjective saddle / groin paresthesia',
    'Progressive bilateral lower extremity neurological symptoms',
    'History of prior lumbar spinal surgery (L4/L5 laminectomy)',
  ],
  preliminaryCareNotes: 'Immediate practitioner alert dispatched. Perform urgent lower limb neurological examination (S2-S4 dermatomes, anal tone inquiry, bilateral motor/reflex test). Prepare immediate emergency department escalation protocol if confirmed.',
  clinikoMedicalAlertPayload: {
    patient_id: 'pt_55102',
    name: 'CLINICAL RED FLAG: Cauda Equina Protocol',
    content: 'Urgent screening required: Urinary hesitancy and saddle paresthesia reported in online intake.',
  },
};

export function PatientIntakeTriage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [intake, setIntake] = useState(SAMPLE_INTAKES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<IntakeTriageResult>(INITIAL_TRIAGE_RESULT);

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
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-bold text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 whitespace-nowrap shrink-0">
              <FileCheck2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Patient Intake &amp; Triage Engine
            </span>
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap shrink-0">
              Automated Red-Flag Screening
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
            Pre-Consultation Screening &amp; Red-Flag Detection
          </h2>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            Scans incoming patient intake forms for serious clinical contraindications (e.g. Cauda Equina), scores urgency, and matches the patient to the right practitioner and Cliniko appointment duration.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Button
            size="sm"
            onClick={() => handleTriage()}
            disabled={isLoading}
            className="h-9 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs whitespace-nowrap shrink-0 px-4"
          >
            {isLoading ? (
              <>
                <Activity className="h-4 w-4 mr-1.5 animate-spin" />
                <span>Screening Intake...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1.5 text-blue-200" />
                <span>Run Intake Triage</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Intake Samples Selector */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_INTAKES.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setIntake(item);
                handleTriage(item);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-500/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {item.patientName}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  item.painScale >= 8
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                }`}>
                  VAS {item.painScale}/10
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                {item.painLocation}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 font-semibold">
                Duration: {item.duration}
              </p>
            </button>
          );
        })}
      </div>

      {/* Triage Detail Display Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw Intake Form Data (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3 font-mono text-xs shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Incoming Intake Payload
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              Cliniko Webhook: patient.intake
            </span>
          </div>

          <div className="space-y-2 text-slate-800 dark:text-slate-200 font-medium">
            <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Patient:</strong> {intake.patientName} (DOB: {intake.dob})</p>
            <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Chief Complaint:</strong> {intake.painLocation}</p>
            <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Symptom Onset:</strong> {intake.duration}</p>
            <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Reported VAS Pain:</strong> {intake.painScale}/10</p>
            <p><strong className="text-slate-900 dark:text-slate-100 font-bold">Medical History:</strong> {intake.medicalHistory}</p>
          </div>

          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase">Patient Self-Description:</span>
            <p className="text-xs bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium shadow-2xs">
              &quot;{intake.symptoms}&quot;
            </p>
          </div>
        </div>

        {/* Right: AI Clinical Triage & Cliniko Recommendation (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 p-5 flex flex-col justify-between shadow-xs">
          {triageResult && (
            <div className="space-y-3.5 font-mono text-xs">
              {/* Category Alert Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  triageResult.triageCategory === 'Urgent'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : triageResult.triageCategory === 'Priority'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {triageResult.triageCategory === 'Urgent' ? (
                    <ShieldAlert className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-extrabold uppercase text-xs tracking-wider">
                      Triage Category: {triageResult.triageCategory}
                    </span>
                    <p className="text-xs font-medium mt-0.5 opacity-95">
                      {triageResult.triageCategory === 'Urgent'
                        ? 'Red flag contraindications detected. Senior clinician notification dispatched.'
                        : 'Suitable for standard allied health treatment protocol.'}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-extrabold shrink-0">
                  {triageResult.durationMinutes} min
                </span>
              </div>

              {/* Red Flags If Any */}
              {triageResult.redFlagsIdentified.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                  <span className="font-extrabold text-xs uppercase block mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                    Clinical Red Flags Flagged:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs font-medium">
                    {triageResult.redFlagsIdentified.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Appointment Booking Recommendation */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-600 dark:text-slate-400 uppercase text-[11px]">
                    Recommended Cliniko Appointment Type
                  </span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    {triageResult.recommendedPractitionerSpecialty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{triageResult.recommendedAppointmentType}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                  {triageResult.clinicalSummary}
                </p>
              </div>

              {/* Preliminary Care Directive */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 shadow-2xs font-sans">
                <strong className="text-slate-900 dark:text-slate-100 font-bold">Preliminary Care Directive:</strong>{' '}
                {triageResult.preliminaryCareNotes}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>Cliniko Patient Sync: Automated</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              Zero Unbooked Gaps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
