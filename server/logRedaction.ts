const SENSITIVE_LOG_KEY = /(authorization|cookie|api[-_]?key|access[-_]?token|refresh[-_]?token|token|secret|password)/i;
const SENSITIVE_STRING_PATTERNS = [
  /(\bBearer\s+)[^\s,;"']+/gi,
  /(["']?(?:api[-_]?key|access[-_]?token|refresh[-_]?token|token|secret|password)["']?\s*[:=]\s*["']?)[^"'&,;\s}]+/gi,
];

function redactString(value: string): string {
  return SENSITIVE_STRING_PATTERNS.reduce(
    (redacted, pattern) => redacted.replace(pattern, "$1[REDACTED]"),
    value,
  );
}

export function redactSensitiveLogData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitiveLogData);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        SENSITIVE_LOG_KEY.test(key) ? "[REDACTED]" : redactSensitiveLogData(nestedValue),
      ]),
    );
  }

  return typeof value === "string" ? redactString(value) : value;
}
