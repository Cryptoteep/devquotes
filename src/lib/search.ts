import type { Quote, QuoteCategory, SearchOptions, SearchResult } from '../types.js';
import { getAllQuotes } from './loader.js';

const DEFAULT_LIMIT = 20;

/** Normalize a string for case-insensitive, diacritic-insensitive comparison. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function matchesCategory(quote: Quote, categories: QuoteCategory[]): boolean {
  if (categories.length === 0) return true;
  return categories.includes(quote.category);
}

function matchesAuthor(quote: Quote, authorFilter: string | undefined): boolean {
  if (!authorFilter) return true;
  return normalize(quote.author).includes(normalize(authorFilter));
}

/**
 * Score a quote against a list of query tokens. Higher is better.
 *
 * Scoring weights (chosen so author hits dominate, then text, then source,
 * then tags — mirroring how humans judge relevance):
 *   - author match:    +6  per token
 *   - text match:      +3  per token
 *   - source match:    +2  per token
 *   - tag match:       +4  per token (tags are highly curated)
 *   - phrase bonus:    +5  if the raw query appears verbatim in text
 */
function scoreQuote(quote: Quote, tokens: string[], rawQuery: string): number {
  let score = 0;
  const author = normalize(quote.author);
  const text = normalize(quote.text);
  const source = quote.source ? normalize(quote.source) : '';
  const tags = quote.tags ? quote.tags.map(normalize) : [];

  for (const token of tokens) {
    if (!token) continue;
    if (author.includes(token)) score += 6;
    if (text.includes(token)) score += 3;
    if (source.includes(token)) score += 2;
    if (tags.some((t) => t.includes(token))) score += 4;
  }

  // Phrase bonus: reward verbatim matches in the text or author.
  const raw = normalize(rawQuery);
  if (raw.length > 3) {
    if (text.includes(raw)) score += 5;
    if (author.includes(raw)) score += 5;
  }

  return score;
}

/**
 * Search the curated quote database.
 *
 * @example
 * ```ts
 * import { searchQuotes } from 'devquotes';
 * const hits = searchQuotes({ query: 'naming cache', limit: 5 });
 * for (const h of hits) console.log(h.quote.author, '—', h.quote.text);
 * ```
 */
export function searchQuotes(options: SearchOptions): SearchResult[] {
  const { query, limit = DEFAULT_LIMIT } = options;
  if (!query || !query.trim()) return [];

  const categories = toArray(options.category);
  const authorFilter = options.author?.trim() || undefined;
  const tokens = normalize(query).split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];
  for (const quote of getAllQuotes()) {
    if (!matchesCategory(quote, categories)) continue;
    if (!matchesAuthor(quote, authorFilter)) continue;
    const score = scoreQuote(quote, tokens, query);
    if (score > 0) results.push({ quote, score });
  }

  // Sort by score desc, then by author asc for stable tie-breaking.
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.quote.author.localeCompare(b.quote.author);
  });

  return results.slice(0, Math.max(0, limit));
}

/**
 * List every quote in a given category, in stable id order.
 */
export function listByCategory(category: QuoteCategory): Quote[] {
  return getAllQuotes().filter((q) => q.category === category);
}
