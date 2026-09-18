import { NextRequest, NextResponse } from 'next/server';
import { triagePatientIntake } from '@/lib/cliniko-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await triagePatientIntake({
      symptoms: body.symptoms || '',
      painLocation: body.painLocation || 'General',
      duration: body.duration || '2 weeks',
      painScale: Number(body.painScale) || 5,
      medicalHistory: body.medicalHistory || '',
    }, Boolean(body.simulatedOutage));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Intake Triage API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to triage patient intake' },
      { status: 500 }
    );
  }
}
