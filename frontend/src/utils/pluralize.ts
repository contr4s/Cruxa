/** Pluralise a Russian noun after a number, with 3 forms. */
export function pluralize(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs >= 11 && abs <= 19) return forms[2];
  if (last >= 2 && last <= 4) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}
