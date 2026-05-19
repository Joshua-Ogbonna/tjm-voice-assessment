export type Intent =
  | "ASK_SERVICES"
  | "ASK_PRICING"
  | "ASK_HIGH_VOLUME_SUPPORT"
  | "REQUEST_EMAIL"
  | "REQUEST_CALLBACK"
  | "OUT_OF_SCOPE"
  | "END_CALL"
  | "UNKNOWN";

const intentKeywords: Array<{ intent: Intent; patterns: RegExp[] }> = [
  {
    intent: "END_CALL",
    patterns: [/\bbye\b/i, /\bgoodbye\b/i, /\bend call\b/i, /\bthat'?s all\b/i, /\bthanks\b/i]
  },
  {
    intent: "REQUEST_EMAIL",
    patterns: [/\bemail\b/i, /\bsend (me )?(info|information|details)\b/i, /\bmaterials\b/i]
  },
  {
    intent: "REQUEST_CALLBACK",
    patterns: [/\bcall me\b/i, /\bcallback\b/i, /\bschedule\b/i, /\bfollow[- ]?up call\b/i]
  },
  {
    intent: "OUT_OF_SCOPE",
    patterns: [
      /\bdiagnos(e|is|tic)\b/i,
      /\bmedical advice\b/i,
      /\bpatient\b/i,
      /\bprescribe\b/i,
      /\bweather\b/i,
      /\bsports\b/i,
      /\bpolitics\b/i,
      /\bstock\b/i,
      /\binvest/i
    ]
  },
  {
    intent: "ASK_PRICING",
    patterns: [/\bprice\b/i, /\bpricing\b/i, /\bcost\b/i, /\bfee\b/i, /\brates\b/i]
  },
  {
    intent: "ASK_HIGH_VOLUME_SUPPORT",
    patterns: [/\brx\b/i, /\bprescriptions?\b/i, /\bvolume\b/i, /\bworkflow\b/i, /\bscale\b/i, /\bhigh volume\b/i]
  },
  {
    intent: "ASK_SERVICES",
    patterns: [
      /\bservices?\b/i,
      /\bwhat do you do\b/i,
      /\bwhat do you offer\b/i,
      /\bhow can you help\b/i,
      /\bsupport\b/i
    ]
  }
];

export function classifyIntent(input: string): Intent {
  for (const candidate of intentKeywords) {
    if (candidate.patterns.some((pattern) => pattern.test(input))) {
      return candidate.intent;
    }
  }

  return "UNKNOWN";
}
