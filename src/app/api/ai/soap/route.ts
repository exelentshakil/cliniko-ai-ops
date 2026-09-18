import { NextRequest, NextResponse } from 'next/server';
import { generateSoapNote } from '@/lib/cliniko-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dictation = body.dictation || '';
    const specialty = body.specialty || 'Physiotherapy';
    const patientId = body.patientId || 'pt_98241';
    const simulatedOutage = Boolean(body.simulatedOutage);

    if (!dictation.trim()) {
      return NextResponse.json(
        { error: 'Consultation dictation or notes required' },
        { status: 400 }
      );
    }

    const result = await generateSoapNote(dictation, specialty, patientId, simulatedOutage);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('SOAP Generation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate SOAP note' },
      { status: 500 }
    );
  }
}
