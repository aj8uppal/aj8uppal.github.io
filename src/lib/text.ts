/**
 * Glue each separator to the token before it with a non-breaking space, so a
 * row that wraps can never open a line with a dangling middot.
 */
export const dots = (...parts: Array<string | undefined>): string =>
  parts
    .flatMap((p) => (p ?? '').split('·'))
    .map((t) => t.trim())
    .filter(Boolean)
    .join('\u00a0· ');
