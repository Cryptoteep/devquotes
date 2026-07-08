import type { Quote } from '../types.js';
import quotesData from '../data/quotes.json' with { type: 'json' };

/** In-memory store of all curated quotes, sorted by id for stable iteration. */
const ALL_QUOTES: readonly Quote[] = Object.freeze(
  [...(quotesData as Quote[])].sort((a, b) => a.id.localeCompare(b.id)),
);

/** Index of id → quote for O(1) lookup. */
const BY_ID = new Map<string, Quote>(ALL_QUOTES.map((q) => [q.id, q]));

/**
 * Return every curated quote. The returned array is frozen; mutate a copy
 * if you need to.
 */
export function getAllQuotes(): readonly Quote[] {
  return ALL_QUOTES;
}

/**
 * Look up a single quote by its stable id.
 */
export function getQuoteById(id: string): Quote | undefined {
  return BY_ID.get(id);
}

/**
 * Return the number of quotes currently shipped.
 */
export function countQuotes(): number {
  return ALL_QUOTES.length;
}

/**
 * Return the sorted list of distinct author names (original casing preserved).
 */
export function listAuthors(): string[] {
  const seen = new Map<string, string>();
  for (const q of ALL_QUOTES) {
    if (!seen.has(q.author.toLowerCase())) seen.set(q.author.toLowerCase(), q.author);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * Validate that a quote object roughly conforms to the {@link Quote} shape.
 * Intended for contribution tooling — the bundled dataset is already trusted.
 */
export function validateQuote(q: unknown): q is Quote {
  if (typeof q !== 'object' || q === null) return false;
  const obj = q as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.author === 'string' &&
    (obj.source === undefined || typeof obj.source === 'string') &&
    (obj.year === undefined || typeof obj.year === 'number') &&
    typeof obj.category === 'string' &&
    (obj.tags === undefined || Array.isArray(obj.tags))
  );
}
