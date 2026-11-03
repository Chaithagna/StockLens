/**
 * Sanitization & Prompt Injection Protection Utilities
 */

// Patterns indicating prompt injection or jailbreak attempts
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|directives)/i,
  /disregard\s+(all\s+)?(previous|prior|above)/i,
  /you\s+are\s+now\s+(unrestricted|in\s+developer\s+mode|DAN|jailbroken)/i,
  /act\s+as\s+an\s+unfiltered/i,
  /reveal\s+(system\s+prompt|instructions|secret\s+key|api\s+key)/i,
  /bypass\s+safety\s+filters/i,
  /system\s*:\s*/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
];

/**
 * Sanitize text strings from XSS characters
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets
    .trim();
};

/**
 * Detect potential prompt injection in user queries
 */
export const isPromptInjection = (text) => {
  if (!text || typeof text !== 'string') return false;
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text));
};

/**
 * Neutralize untrusted web snippets or user input before interpolating into LLM context
 */
export const neutralizeForPrompt = (content) => {
  if (!content || typeof content !== 'string') return '';
  return content
    .replace(/```/g, "'''") // Prevent code block breakaways
    .replace(/[\r\n]{3,}/g, '\n\n') // Collapse excessive newlines
    .trim();
};

