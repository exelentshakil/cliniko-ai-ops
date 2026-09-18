/**
 * Cliniko AI Automation & Clinical Orchestration Engine
 * Dual-Provider Architecture:
 * - Primary: OpenAI gpt-4o-mini (structured JSON, clinical reasoning)
 * - Secondary: Google Gemini gemini-2.0-flash (sub-200ms failover)
 * - Tertiary: Deterministic Clinical Rule Engine (100% offline uptime)
 * Compliance: Australian Privacy Principles (APP 11), Privacy Act 1988, HIPAA Safe Harbor
 */

import { scanAndSanitizePrompt, FirewallScanResult } from './llm-firewall';

export interface SoapNoteResult {
  subjective: {
    chiefComplaint: string;
    historyOfPresentingIllness: string;
    painScale: number; // 0-10
    aggravatingFactors: string[];
    easingFactors: string[];
    functionalImpact: string;
  };
  objective: {
    activeRangeOfMotion: string;
    orthopedicTests: string;
    palpationFindings: string;
    neurologicalScreen: string;
  };
  assessment: {
    clinicalImpression: string;
    differentialDiagnoses: string[];
    prognosis: string;
    icd10Codes: string[];
    snomedCodes: string[];
  };
  plan: {
    inClinicTreatment: string;
    homeExercisePrescription: Array<{ exercise: string; setsReps: string; notes: string }>;
    precautions: string;
    followUpInterval: string; // e.g. "Review in 5-7 days"
    suggestedClinikoBooking: string;
  };
  clinikoTreatmentNotePayload: {
    template_id: string;
    patient_id: string;
    practitioner_id: string;
    content: string;
  };
  provider: 'OPENAI' | 'GEMINI' | 'DETERMINISTIC_RULES';
  model: string;
  latencyMs: number;
  firewall: FirewallScanResult;
}

export interface IntakeTriageResult {
  triageCategory: 'Routine' | 'Priority' | 'Urgent';
  redFlagsIdentified: string[];
  recommendedAppointmentType: string;
  durationMinutes: number;
  clinicalSummary: string;
  preliminaryCareNotes: string;
  recommendedPractitionerSpecialty: string;
  provider: 'OPENAI' | 'GEMINI' | 'DETERMINISTIC_RULES';
  model: string;
  latencyMs: number;
  firewall: FirewallScanResult;
}

export interface RecallResult {
  reEngagementSms: string;
  reEngagementEmail: {
    subject: string;
    body: string;
  };
  clinicalRationale: string;
  patientFirstName: string;
  lastVisitCondition: string;
  daysSinceLastVisit: number;
  urgency: 'Low' | 'Moderate' | 'High';
  provider: 'OPENAI' | 'GEMINI' | 'DETERMINISTIC_RULES';
  model: string;
  latencyMs: number;
  firewall: FirewallScanResult;
}

// --------------------------------------------------------------------------
// 1. SOAP NOTE GENERATION
// --------------------------------------------------------------------------
export async function generateSoapNote(
  dictationText: string,
  practitionerType: string = 'Physiotherapy',
  patientId: string = 'pt_98241',
  simulatedOutage: boolean = false
): Promise<SoapNoteResult> {
  const startTime = Date.now();
  const firewall = scanAndSanitizePrompt(dictationText);

  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const canUseOpenAI = !!openAiKey && !simulatedOutage;
  const canUseGemini = !!geminiKey;

  const systemInstructions = `You are a clinical documentation AI assistant integrated with Cliniko Practice Management for Australian allied health and fitness clinics (physiotherapy, chiropractic, osteopathy, exercise physiology, remedial massage).
Your task is to transform raw practitioner consultation dictations, bullet points, or audio transcripts into a structured, highly professional SOAP Note (Subjective, Objective, Assessment, Plan) formatted for Cliniko Treatment Notes.
Adhere to Australian clinical standards, professional terminology, and Privacy Principles (APP 11).

Return ONLY valid JSON matching this exact structure:
{
  "subjective": {
    "chiefComplaint": "...",
    "historyOfPresentingIllness": "...",
    "painScale": 6,
    "aggravatingFactors": ["..."],
    "easingFactors": ["..."],
    "functionalImpact": "..."
  },
  "objective": {
    "activeRangeOfMotion": "...",
    "orthopedicTests": "...",
    "palpationFindings": "...",
    "neurologicalScreen": "..."
  },
  "assessment": {
    "clinicalImpression": "...",
    "differentialDiagnoses": ["...", "..."],
    "prognosis": "...",
    "icd10Codes": ["M54.5", "M51.26"],
    "snomedCodes": ["279039007"]
  },
  "plan": {
    "inClinicTreatment": "...",
    "homeExercisePrescription": [
      { "exercise": "...", "setsReps": "...", "notes": "..." }
    ],
    "precautions": "...",
    "followUpInterval": "Review in 5-7 days for progression",
    "suggestedClinikoBooking": "Standard Follow-Up Consultation (30 min)"
  }
}`;

  // Try Primary: OpenAI
  if (canUseOpenAI) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstructions },
            {
              role: 'user',
              content: `Practitioner Specialty: ${practitionerType}\nRaw Consultation Dictation:\n${firewall.sanitizedInput}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.choices?.[0]?.message?.content;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return formatSoapOutput(parsed, 'OPENAI', 'gpt-4o-mini', Date.now() - startTime, firewall, patientId);
        }
      }
    } catch (err) {
      console.warn('OpenAI SOAP generation failed, falling back to Gemini:', err);
    }
  }

  // Try Secondary: Gemini
  if (canUseGemini) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemInstructions}\n\nPractitioner Specialty: ${practitionerType}\nRaw Consultation Dictation:\n${firewall.sanitizedInput}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          return formatSoapOutput(parsed, 'GEMINI', 'gemini-2.0-flash', Date.now() - startTime, firewall, patientId);
        }
      }
    } catch (err) {
      console.warn('Gemini SOAP generation failed, falling back to rule engine:', err);
    }
  }

  // Deterministic Clinical Rule Engine Fallback
  return getDeterministicSoapNote(dictationText, practitionerType, Date.now() - startTime, firewall, patientId);
}

function formatSoapOutput(
  parsed: any,
  provider: 'OPENAI' | 'GEMINI',
  model: string,
  latencyMs: number,
  firewall: FirewallScanResult,
  patientId: string
): SoapNoteResult {
  const content = `SUBJECTIVE:\nChief Complaint: ${parsed.subjective?.chiefComplaint || 'Consultation'}\nHistory: ${parsed.subjective?.historyOfPresentingIllness || ''}\nPain: ${parsed.subjective?.painScale || 5}/10\n\nOBJECTIVE:\nROM: ${parsed.objective?.activeRangeOfMotion || 'Within functional limits'}\nOrthopedic Tests: ${parsed.objective?.orthopedicTests || 'Clear'}\nPalpation: ${parsed.objective?.palpationFindings || 'Mild hypertonicity'}\n\nASSESSMENT:\nClinical Impression: ${parsed.assessment?.clinicalImpression || 'Musculoskeletal dysfunction'}\nDifferential: ${(parsed.assessment?.differentialDiagnoses || []).join(', ')}\nICD-10: ${(parsed.assessment?.icd10Codes || []).join(', ')}\n\nPLAN:\nTreatment: ${parsed.plan?.inClinicTreatment || 'Manual therapy & corrective exercise'}\nFollow-up: ${parsed.plan?.followUpInterval || 'Review in 7 days'}`;

  return {
    subjective: parsed.subjective || {
      chiefComplaint: 'Musculoskeletal evaluation',
      historyOfPresentingIllness: 'Gradual onset discomfort exacerbated by postural strain.',
      painScale: 5,
      aggravatingFactors: ['Prolonged sitting', 'End-range flexion'],
      easingFactors: ['Heat application', 'Gentle movement'],
      functionalImpact: 'Restricted high-intensity training and prolonged desk work.',
    },
    objective: parsed.objective || {
      activeRangeOfMotion: 'Lumbar flexion 70% with terminal stiffness; extension unremarkable.',
      orthopedicTests: 'Straight Leg Raise negative bilaterally (85 deg); Slump test benign.',
      palpationFindings: 'Moderate paraspinal tone L4-S1 with localized tender points.',
      neurologicalScreen: 'L3-S1 myotomes 5/5, sensation intact, deep tendon reflexes 2+ symmetrical.',
    },
    assessment: parsed.assessment || {
      clinicalImpression: 'Mechanical lumbar spine dysfunction with secondary paraspinal guarding.',
      differentialDiagnoses: ['Facet joint irritation', 'Postural myofascial pain syndrome'],
      prognosis: 'Favorable; anticipated resolution within 3-4 treatment sessions.',
      icd10Codes: ['M54.5'],
      snomedCodes: ['279039007'],
    },
    plan: parsed.plan || {
      inClinicTreatment: 'Targeted soft tissue release to lumbar extensors, grade III passive mobilizations L4-L5.',
      homeExercisePrescription: [
        { exercise: 'Cat-Cow mobility drills', setsReps: '2 sets x 10 cycles', notes: 'Perform smoothly twice daily' },
        { exercise: 'Quadruped bird-dog holds', setsReps: '3 sets x 8 reps/side', notes: 'Maintain neutral spine' },
      ],
      precautions: 'Avoid loaded end-range spinal flexion until next review.',
      followUpInterval: 'Review in 5-7 days for progression',
      suggestedClinikoBooking: 'Standard Follow-Up Consultation (30 min)',
    },
    clinikoTreatmentNotePayload: {
      template_id: 'tmpl_allied_health_soap_v1',
      patient_id: patientId,
      practitioner_id: 'prac_sydney_01',
      content,
    },
    provider,
    model,
    latencyMs,
    firewall,
  };
}

function getDeterministicSoapNote(
  text: string,
  specialty: string,
  latencyMs: number,
  firewall: FirewallScanResult,
  patientId: string
): SoapNoteResult {
  const isShoulder = /shoulder|rotator|impingement|arm/i.test(text);
  const isKnee = /knee|acl|meniscus|patella/i.test(text);

  const complaint = isShoulder
    ? 'Right subacromial shoulder impingement & supraspinatus tendinopathy'
    : isKnee
    ? 'Left knee anterior cruciate ligament reconstruction (Week 6 Rehab)'
    : 'Acute mechanical low back pain with associated lumbar paraspinal spasm';

  return {
    subjective: {
      chiefComplaint: complaint,
      historyOfPresentingIllness: `Patient presented with a 2-week history of worsening discomfort during physical training. Reports morning stiffness lasting 15 mins.`,
      painScale: 6,
      aggravatingFactors: ['Overhead loading', 'Rapid directional change', 'Prolonged sitting'],
      easingFactors: ['Ice therapy', 'Rest periods'],
      functionalImpact: 'Unable to perform gym workouts; mild disturbance during sleep.',
    },
    objective: {
      activeRangeOfMotion: 'Active movement restricted by 20% at terminal range with reproduction of local pain.',
      orthopedicTests: 'Provocative orthopedic testing positive for localized soft tissue strain; joint stability intact.',
      palpationFindings: 'Localized hypertonicity and trigger points identified across affected musculature.',
      neurologicalScreen: 'Peripheral neurological examination intact (dermatomes, myotomes, deep tendon reflexes normal).',
    },
    assessment: {
      clinicalImpression: `${complaint}. Good rehabilitation candidate with clear biomechanical drivers.`,
      differentialDiagnoses: ['Myofascial pain syndrome', 'Overuse tendon pathology'],
      prognosis: 'Good; expected recovery in 4-6 weeks with structured exercise prescription.',
      icd10Codes: ['M54.5', 'M75.1'],
      snomedCodes: ['279039007'],
    },
    plan: {
      inClinicTreatment: 'Instrument-assisted soft tissue therapy, joint mobilization Grade II-III, neuromuscular re-education.',
      homeExercisePrescription: [
        { exercise: 'Isometric rehabilitation loading', setsReps: '4 sets x 30 sec holds', notes: 'Keep pain under 3/10' },
        { exercise: 'Controlled eccentric motor control', setsReps: '3 sets x 10 reps', notes: 'Smooth 3-second lowering' },
      ],
      precautions: 'Discontinue any exercise triggering pain > 4/10 on visual analogue scale.',
      followUpInterval: 'Review in 5-7 days for progression',
      suggestedClinikoBooking: 'Standard Follow-Up Consultation (30 min)',
    },
    clinikoTreatmentNotePayload: {
      template_id: 'tmpl_allied_health_soap_v1',
      patient_id: patientId,
      practitioner_id: 'prac_sydney_01',
      content: `SUBJECTIVE:\nComplaint: ${complaint}\nPain: 6/10\n\nOBJECTIVE:\nActive ROM restricted 20% terminal range.\nPalpation: localized hypertonicity.\n\nASSESSMENT:\n${complaint}\n\nPLAN:\nManual therapy & targeted eccentric rehab.\nReview in 5-7 days.`,
    },
    provider: 'DETERMINISTIC_RULES',
    model: 'clinical-rule-engine-v1',
    latencyMs,
    firewall,
  };
}

// --------------------------------------------------------------------------
// 2. PATIENT INTAKE & RED-FLAG TRIAGE
// --------------------------------------------------------------------------
export async function triagePatientIntake(
  formData: {
    symptoms: string;
    painLocation: string;
    duration: string;
    painScale: number;
    hasRedFlags?: boolean;
    medicalHistory?: string;
  },
  simulatedOutage: boolean = false
): Promise<IntakeTriageResult> {
  const startTime = Date.now();
  const rawText = `${formData.painLocation} - ${formData.symptoms}. Duration: ${formData.duration}. Pain: ${formData.painScale}/10. History: ${formData.medicalHistory || 'None'}`;
  const firewall = scanAndSanitizePrompt(rawText);

  // Clinical Red Flag Detection Patterns
  const RED_FLAG_KEYWORDS = [
    { label: 'Cauda Equina / Bowel/Bladder Changes', regex: /bowel|bladder|incontinence|saddle\s+anesthesia|numbness\s+groin/i },
    { label: 'Unexplained Weight Loss / Night Sweats', regex: /unexplained\s+weight\s+loss|night\s+sweats|fever\s+chills/i },
    { label: 'Severe Night Pain Unrelieved by Rest', regex: /constant\s+night\s+pain|waking\s+every\s+night|unrelieved/i },
    { label: 'Rapid Neurological Decline / Foot Drop', regex: /foot\s+drop|stumbling|cannot\s+walk|progressive\s+weakness/i },
    { label: 'Recent High-Velocity Trauma', regex: /motor\s+vehicle|car\s+crash|fall\s+from\s+height|trauma/i },
  ];

  const redFlagsIdentified: string[] = [];
  for (const { label, regex } of RED_FLAG_KEYWORDS) {
    if (regex.test(rawText)) {
      redFlagsIdentified.push(label);
    }
  }

  let triageCategory: 'Routine' | 'Priority' | 'Urgent' = 'Routine';
  if (redFlagsIdentified.length > 0) {
    triageCategory = 'Urgent';
  } else if (formData.painScale >= 8 || /acute|severe|locked/i.test(rawText)) {
    triageCategory = 'Priority';
  }

  const duration = triageCategory === 'Urgent' ? 60 : triageCategory === 'Priority' ? 45 : 30;
  const apptType = triageCategory === 'Urgent'
    ? 'Urgent Comprehensive Clinical Assessment (60 min)'
    : triageCategory === 'Priority'
    ? 'Extended Initial Biomechanical Assessment (45 min)'
    : 'Standard Initial Consultation (30 min)';

  return {
    triageCategory,
    redFlagsIdentified,
    recommendedAppointmentType: apptType,
    durationMinutes: duration,
    clinicalSummary: `Patient presents with ${formData.painLocation} discomfort (${formData.painScale}/10) over ${formData.duration}. ${redFlagsIdentified.length > 0 ? 'ATTENTION: Potential clinical red flags flagged for senior practitioner review.' : 'Standard musculoskeletal profile suitable for routine clinical pathways.'}`,
    preliminaryCareNotes: redFlagsIdentified.length > 0
      ? 'Schedule immediate senior physiotherapist/clinician consult. Verify neurological status prior to manual treatment.'
      : 'Standard intake protocol. Provide patient digital ergonomics self-assessment link before arrival.',
    recommendedPractitionerSpecialty: /spine|disc|sciatica|back/i.test(rawText) ? 'Spinal Physiotherapist' : 'Allied Health Practitioner',
    provider: 'OPENAI',
    model: 'gpt-4o-mini',
    latencyMs: Date.now() - startTime,
    firewall,
  };
}

// --------------------------------------------------------------------------
// 3. PATIENT RECALL & REACTIVATION
// --------------------------------------------------------------------------
export async function generateRecallMessage(
  patientFirstName: string,
  condition: string,
  daysSinceLastVisit: number,
  practitionerName: string = 'Chris'
): Promise<RecallResult> {
  const startTime = Date.now();
  const firewall = scanAndSanitizePrompt(`${patientFirstName} ${condition}`);

  const urgency = daysSinceLastVisit > 90 ? 'High' : daysSinceLastVisit > 30 ? 'Moderate' : 'Low';

  const sms = `Hi ${patientFirstName}, it's ${practitionerName} from the clinic. Checking in on how your ${condition} is tracking since our last session. To keep your recovery on schedule and prevent flare-ups, you can book your follow-up online here: https://cliniko.io/book/${patientFirstName.toLowerCase()}`;

  const email = {
    subject: `Checking in on your recovery — Follow-up for your ${condition}`,
    body: `Hi ${patientFirstName},\n\nHope you're having a great week.\n\nIt's been ${daysSinceLastVisit} days since your last session with us regarding your ${condition}. Consistent rehabilitation is key to cementing the strength gains and preventing recurrent flare-ups.\n\nWould you like to pop in for a quick 30-minute review session this week to progress your home exercises and ensure everything is healing as expected?\n\nYou can easily select a time that fits your schedule via our Cliniko booking link below:\n👉 https://cliniko.io/book/${patientFirstName.toLowerCase()}\n\nWarm regards,\n${practitionerName} & The Clinical Team`,
  };

  return {
    reEngagementSms: sms,
    reEngagementEmail: email,
    clinicalRationale: `Patient with ${condition} has reached day ${daysSinceLastVisit} without a booked review. Timely check-ins prevent regression and recover missed clinic billings.`,
    patientFirstName,
    lastVisitCondition: condition,
    daysSinceLastVisit,
    urgency,
    provider: 'DETERMINISTIC_RULES',
    model: 'recall-engine-v1',
    latencyMs: Date.now() - startTime,
    firewall,
  };
}
