import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

type ReqOpt = { required?: boolean };
type SqlOpts = ReqOpt & { mode?: 'relaxed' | 'strict' };

function valToString(control: AbstractControl): string {
  return String(control.value ?? '').trim();
}
function requiredGate(value: string, required?: boolean): ValidationErrors | null | undefined {
  if (!value) return required ? { required: true } : null;
  return undefined;
}

/**
 * SQL Injection heuristic validator.
 * - "relaxed" (default): looks for high-signal combos (e.g., UNION SELECT, OR 1=1, ;--, \/* *\/).
 * - "strict": also flags single high-risk tokens (e.g., DROP, EXEC) that could cause FPs in rare legit inputs.
 *
 * NOTE: This is a **heuristic** validator — it reduces risk but does not replace server-side validation/parameterization.
 */

export function sqlInjectionValidator(opts: SqlOpts = { required: false, mode: 'relaxed' }): ValidatorFn {
  const mode = opts.mode ?? 'relaxed';

  // Try to decode percent-encoded payloads (%27, %3B, etc.) without throwing.
  const decodeBestEffort = (s: string) => {
    try { return decodeURIComponent(s); } catch { return s; }
  };

  // High-signal multi-token patterns (case-insensitive), designed to minimize false positives.
  const RELAXED_PATTERNS = [
    // Auth bypass / tautologies
    /\bOR\b\s+1\s*=\s*1\b/i,
    /\bAND\b\s+1\s*=\s*1\b/i,
    // Union injection
    /\bUNION\b\s+\bSELECT\b/i,
    // Stacked queries + comment styles
    /;--/i,
    /;#\s*/i,
    /--\s*$/m,
    /\/\*[\s\S]*?\*\//, // block comments
    // Info schema enumeration
    /\bINFORMATION_SCHEMA\b/i,
    // Function/sleep timing
    /\bSLEEP\s*\(/i,
    /\bBENCHMARK\s*\(/i,
  ];

  // Extra strict tokens (additive to relaxed), catch broader DDL/DML/exec
  const STRICT_PATTERNS = [
    /\bDROP\b\s+\b(TABLE|DATABASE)\b/i,
    /\bTRUNCATE\b\s+\bTABLE\b/i,
    /\bALTER\b\s+\bTABLE\b/i,
    /\bINSERT\b\s+\bINTO\b/i,
    /\bUPDATE\b\s+\w+\s+\bSET\b/i,
    /\bDELETE\b\s+\bFROM\b/i,
    /\bEXEC(UTE)?\b/i,
    /\bxp_cmdshell\b/i,
    /\bWAITFOR\b\s+\bDELAY\b/i,
    /\bCAST\s*\(/i,
    /\bCONVERT\s*\(/i,
  ];

  const patterns = mode === 'strict'
    ? [...RELAXED_PATTERNS, ...STRICT_PATTERNS]
    : RELAXED_PATTERNS;

  // Also watch for encoded quotes/semicolons that often precede payloads
  const ENCODED_NOISY = /(%27|%22|%3B|%2D%2D)/i;

  return (control: AbstractControl): ValidationErrors | null => {
    let value = valToString(control);

    const gate = requiredGate(value, opts.required);
    if (gate !== undefined) return gate;

    // Quick path: if nothing looks suspicious, pass
    if (!ENCODED_NOISY.test(value)) {
      // continue to detailed checks anyway; many payloads are unencoded
    } else {
      value = decodeBestEffort(value);
    }

    for (const rx of patterns) {
      if (rx.test(value)) {
        return { sqlInjection: true };
      }
    }
    return null;
  };
}
