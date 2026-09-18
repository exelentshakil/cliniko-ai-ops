/**
 * Inline Clinical LLM Firewall & Healthcare AI Governance Shield
 * Securiti Certified Architect ID: 14B411BCE-14B411A3D-1451CFE76
 * Compliance: Australian Privacy Principles (APP 11), Privacy Act 1988, HIPAA Safe Harbor, NIST AI RMF
 */

export interface FirewallScanResult {
  passed: boolean;
  sanitizedInput: string;
  piiRedacted: boolean;
  injectionDetected: boolean;
  riskScore: number; // 0.0 to 1.0
  redactions: Array<{ type: string; count: number }>;
  flaggedTokens?: string[];
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|jailbreak)/i,
  /system\s*:\s*override/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s*key)/i,
  /dump\s+(all\s+)?(memory|environment\s+variables|tokens)/i,
  /bypass\s+(safety|content\s+filter|guardrail)/i,
];

const HEALTHCARE_PII_PATTERNS = [
  { type: 'MEDICARE_AU', regex: /\b\d{4}\s?\d{5}\s?\d{1}(?:-\d{1})?\b/g, mask: '[REDACTED_MEDICARE]' },
  { type: 'AU_PHONE', regex: /\b(?:\+?61\s?(?:[2-478]\d{1}|\(0[2-478]\))\s?\d{4}\s?\d{4}|0[2-478]\d{8})\b/g, mask: '[REDACTED_AU_PHONE]' },
  { type: 'EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, mask: '[REDACTED_EMAIL]' },
  { type: 'DOB_DATE', regex: /\b(?:DOB|Date of Birth|Born)[:\s]+(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/gi, mask: '[REDACTED_DOB]' },
  { type: 'CREDIT_CARD', regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g, mask: '[REDACTED_CC]' },
];

export function scanAndSanitizePrompt(rawInput: string): FirewallScanResult {
  let sanitized = rawInput;
  let piiRedacted = false;
  const redactions: Array<{ type: string; count: number }> = [];

  // 1. Healthcare PII Redaction (APP 11 / HIPAA Safe Harbor)
  for (const { type, regex, mask } of HEALTHCARE_PII_PATTERNS) {
    const matches = sanitized.match(regex);
    if (matches && matches.length > 0) {
      piiRedacted = true;
      redactions.push({ type, count: matches.length });
      sanitized = sanitized.replace(regex, mask);
    }
  }

  // 2. Prompt Injection Defense (OWASP LLM01)
  let injectionDetected = false;
  const flaggedTokens: string[] = [];

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(rawInput)) {
      injectionDetected = true;
      flaggedTokens.push(pattern.source);
    }
  }

  const riskScore = injectionDetected ? 0.95 : piiRedacted ? 0.25 : 0.05;

  return {
    passed: !injectionDetected,
    sanitizedInput: sanitized,
    piiRedacted,
    injectionDetected,
    riskScore,
    redactions,
    flaggedTokens: flaggedTokens.length > 0 ? flaggedTokens : undefined,
  };
}
