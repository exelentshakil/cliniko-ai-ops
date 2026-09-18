import { NextRequest, NextResponse } from 'next/server';
import { classifyOpportunity, ClassifyParams } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const params: ClassifyParams = {
      title: String(body.title || ''),
      content: String(body.content || ''),
      platform: String(body.platform || 'Public Forum'),
      author: String(body.author || 'Guitarist'),
      brandList: Array.isArray(body.brandList) ? body.brandList : undefined,
      complaintKeywords: Array.isArray(body.complaintKeywords) ? body.complaintKeywords : undefined,
      highIntentPhrases: Array.isArray(body.highIntentPhrases) ? body.highIntentPhrases : undefined,
      promptTone: typeof body.promptTone === 'string' ? body.promptTone : undefined,
      simulatedOutage: Boolean(body.simulatedOutage),
    };

    const result = await classifyOpportunity(params);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown classification error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
