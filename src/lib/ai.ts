/**
 * Dual-Provider AI Engine for Social Listening & Opportunity Classification
 * Zero-dependency native HTTP fetch implementation:
 * Primary: OpenAI gpt-4o-mini
 * Fallback: Google Gemini gemini-2.0-flash
 * Offline / Local: Deterministic Rule Engine
 */

import { scanAndSanitizePrompt } from './llm-firewall';

export type OpportunityCategory =
  | 'fee/payout/policy complaints'
  | 'actively asking for alternatives'
  | 'leaving service / boycott'
  | 'fraud / scam concerns'
  | 'customer service problems'
  | 'genuine product complaints'
  | 'positive / endorsement'
  | 'neutral / general discussion'
  | 'spam / duplicate / promotion';

export interface OpportunityAnalysisResult {
  category: OpportunityCategory;
  opportunityScore: number; // 1-10
  switchingIntent: boolean;
  reasoning: string;
  suggestedResponse: string;
  provider: 'OPENAI' | 'GEMINI' | 'DETERMINISTIC_RULES';
  model: string;
  latencyMs: number;
  matchedKeywords: string[];
  firewallStatus: {
    passed: boolean;
    piiRedacted: boolean;
    riskScore: number;
  };
}

export interface ClassifyParams {
  title: string;
  content: string;
  platform: string;
  author: string;
  brandList?: string[];
  complaintKeywords?: string[];
  highIntentPhrases?: string[];
  promptTone?: string;
  simulatedOutage?: boolean; // For chaos testing
}

const DEFAULT_BRANDS = ['Reverb', 'eBay', 'Sweetwater Gear Exchange', 'Guitar Center Used'];
const DEFAULT_COMPLAINTS = ['seller fee', 'payout delay', 'unfair return', 'support won\'t respond', 'buyer scam', 'fee increase'];
const DEFAULT_HIGH_INTENT = ['alternative to reverb', 'where to sell guitar', 'leaving reverb', 'switching from ebay', 'better marketplace for pedals'];

export async function classifyOpportunity(params: ClassifyParams): Promise<OpportunityAnalysisResult> {
  const startTime = Date.now();

  const title = params.title || '';
  const content = params.content || '';
  const combinedText = `${title}\n${content}`;

  // 1. Run Firewall & Security Scan
  const firewall = scanAndSanitizePrompt(combinedText);

  // 2. Keyword Pre-Matching
  const brands = params.brandList || DEFAULT_BRANDS;
  const complaints = params.complaintKeywords || DEFAULT_COMPLAINTS;
  const highIntent = params.highIntentPhrases || DEFAULT_HIGH_INTENT;

  const matchedKeywords: string[] = [];
  const lowerText = combinedText.toLowerCase();

  for (const b of brands) {
    if (lowerText.includes(b.toLowerCase())) matchedKeywords.push(b);
  }
  for (const c of complaints) {
    if (lowerText.includes(c.toLowerCase())) matchedKeywords.push(c);
  }
  for (const h of highIntent) {
    if (lowerText.includes(h.toLowerCase())) matchedKeywords.push(h);
  }

  // 3. Provider Resolution: Check API Keys
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const canUseOpenAI = !!openAiKey && !params.simulatedOutage;
  const canUseGemini = !!geminiKey;

  const promptTone = params.promptTone || 'Helpful, peer musician, transparent, zero hard-sell, authentic community voice';

  const systemInstructions = `You are a specialized musical gear marketplace intelligence agent.
Your task is to analyze social media and forum posts from guitarists and gearheads (from Reddit, TheGearPage, TalkBass, YouTube) and determine if this is a high-value commercial opportunity for a modern, fair, musician-owned gear marketplace.

Categories to classify into:
1. "fee/payout/policy complaints" - Complaints about Reverb/eBay seller fees, payment holds, tax forms, or fee increases.
2. "actively asking for alternatives" - Directly asking where else to sell/buy gear instead of Reverb/eBay.
3. "leaving service / boycott" - Saying they closed their shop or are boycotting Reverb/eBay.
4. "fraud / scam concerns" - Reports of buyer scams, fake returns, or chargebacks.
5. "customer service problems" - Unhelpful support, closed tickets, or slow resolution.
6. "genuine product complaints" - Shipping damage or gear defects.
7. "positive / endorsement" - Praising existing platforms.
8. "neutral / general discussion" - Standard guitar/gear discussions.
9. "spam / duplicate / promotion" - Bot spam or affiliate links.

Opportunity Score: 1 to 10 (10 = highest commercial value).
Give 9-10 to anyone actively asking for alternatives or leaving a service.
Give 8-9 to fee/payout complaints with high frustration.
Give 1-3 to neutral/positive posts.

Suggested Response Draft:
Write a short (2-3 sentences), natural, authentic comment/reply from a fellow gear enthusiast.
Tone: ${promptTone}.
Never sound like corporate marketing or an aggressive advertisement. Mention genuine community alternatives or invite them to check out a musician-friendly platform with lower fees and fast payouts.

Return ONLY a valid JSON object matching this exact schema:
{
  "category": "fee/payout/policy complaints",
  "opportunityScore": 9,
  "switchingIntent": true,
  "reasoning": "Author is frustrated by Reverb's 5% + payment fee increase and actively asking where vintage pedals sell best without gouging.",
  "suggestedResponse": "Man, totally feel you on those recent fee hikes. A lot of builders and vintage guys have been testing newer musician-first platforms that cap fees under 3%. Check out TalkBass classifieds too if it's bass gear!"
}`;

  // 4. Try Primary: OpenAI gpt-4o-mini
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
              content: `Platform: ${params.platform || 'Forum'}\nAuthor: ${params.author || 'Anonymous'}\nPost Title: ${title}\nPost Body: ${firewall.sanitizedInput}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.choices?.[0]?.message?.content;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            category: parsed.category || 'fee/payout/policy complaints',
            opportunityScore: Math.min(10, Math.max(1, Number(parsed.opportunityScore) || 8)),
            switchingIntent: Boolean(parsed.switchingIntent),
            reasoning: parsed.reasoning || 'Evaluated via OpenAI gpt-4o-mini',
            suggestedResponse: parsed.suggestedResponse || '',
            provider: 'OPENAI',
            model: 'gpt-4o-mini',
            latencyMs: Date.now() - startTime,
            matchedKeywords,
            firewallStatus: {
              passed: firewall.passed,
              piiRedacted: firewall.piiRedacted,
              riskScore: firewall.riskScore,
            },
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI classification failed, falling back to Gemini:', err);
    }
  }

  // 5. Try Secondary Fallback: Google Gemini 2.0 Flash
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
                { text: `${systemInstructions}\n\nPlatform: ${params.platform}\nAuthor: ${params.author}\nTitle: ${title}\nBody: ${firewall.sanitizedInput}` },
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
          return {
            category: parsed.category || 'fee/payout/policy complaints',
            opportunityScore: Math.min(10, Math.max(1, Number(parsed.opportunityScore) || 8)),
            switchingIntent: Boolean(parsed.switchingIntent),
            reasoning: parsed.reasoning || 'Evaluated via Google Gemini 2.0 Flash',
            suggestedResponse: parsed.suggestedResponse || '',
            provider: 'GEMINI',
            model: 'gemini-2.0-flash',
            latencyMs: Date.now() - startTime,
            matchedKeywords,
            firewallStatus: {
              passed: firewall.passed,
              piiRedacted: firewall.piiRedacted,
              riskScore: firewall.riskScore,
            },
          };
        }
      }
    } catch (err) {
      console.warn('Gemini classification failed, falling back to deterministic rules:', err);
    }
  }

  // 6. Deterministic Rule Engine Fallback (Instant & 100% reliable offline)
  const isHighIntent = matchedKeywords.some(k => highIntent.includes(k)) || lowerText.includes('alternative') || lowerText.includes('where to sell') || lowerText.includes('leaving');
  const isFeeComplaint = lowerText.includes('fee') || lowerText.includes('payout') || lowerText.includes('cut') || lowerText.includes('expensive');
  const isScam = lowerText.includes('scam') || lowerText.includes('fake') || lowerText.includes('dispute') || lowerText.includes('chargeback');

  let category: OpportunityCategory = 'neutral / general discussion';
  let score = 3;
  let switchingIntent = false;

  if (isHighIntent) {
    category = 'actively asking for alternatives';
    score = 10;
    switchingIntent = true;
  } else if (isFeeComplaint) {
    category = 'fee/payout/policy complaints';
    score = 9;
    switchingIntent = true;
  } else if (isScam) {
    category = 'fraud / scam concerns';
    score = 8;
  } else if (matchedKeywords.length > 0) {
    category = 'customer service problems';
    score = 7;
  }

  const defaultDraft = switchingIntent
    ? `Hey! Completely agree on the marketplace fee frustration. I've been using a new musician-focused marketplace with capped 2.5% fees and instant payouts—way better protection for sellers. Might be worth checking out for your gear.`
    : `Tough situation with that dispute. When platforms side with buyers without checking shipping receipts, it really hurts sellers. Hope you get your funds released soon!`;

  return {
    category,
    opportunityScore: score,
    switchingIntent,
    reasoning: `Deterministic Rule Engine match: [${matchedKeywords.join(', ') || 'semantic tone analysis'}] with ${switchingIntent ? 'high switching intent' : 'moderate interest'}.`,
    suggestedResponse: defaultDraft,
    provider: 'DETERMINISTIC_RULES',
    model: 'rule-engine-v1',
    latencyMs: Date.now() - startTime,
    matchedKeywords,
    firewallStatus: {
      passed: firewall.passed,
      piiRedacted: firewall.piiRedacted,
      riskScore: firewall.riskScore,
    },
  };
}
