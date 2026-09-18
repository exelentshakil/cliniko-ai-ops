import { NextRequest, NextResponse } from 'next/server';
import { generateRecallMessage } from '@/lib/cliniko-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateRecallMessage(
      body.patientFirstName || 'Alex',
      body.condition || 'lumbar rehabilitation',
      Number(body.daysSinceLastVisit) || 45,
      body.practitionerName || 'Chris'
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Recall Generator API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recall message' },
      { status: 500 }
    );
  }
}
