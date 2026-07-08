import type { Quote, RandomOptions } from '../types.js';
import { getAllQuotes } from './loader.js';

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function matchesCategory(quote: Quote, categories: string[]): boolean {
  if (categories.length === 0) return true;
  return categories.includes(quote.category);
}

function matchesAuthor(quote: Quote, authorFilter: string | undefined): boolean {
  if (!authorFilter) return true;
  return quote.author.toLowerCase().includes(authorFilter.toLowerCase());
}

/**
 * Seedable PRNG (mulberry32). Returns a function producing floats in [0, 1).
 *
 * Using a tiny, well-understood algorithm keeps the library dependency-free
 * while still giving us reproducible "quote of the day" style output.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Resolve a possibly-undefined seed to a usable PRNG function. */
function resolveRng(seed: number | undefined): () => number {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    return mulberry32(seed >>> 0);
  }
  return Math.random;
}

/** Filter the corpus according to {@link RandomOptions}. */
function filterCorpus(options: RandomOptions): Quote[] {
  const categories = toArray(options.category).map((c) => c);
  const author = options.author?.trim() || undefined;
  return getAllQuotes().filter(
    (q) => matchesCategory(q, categories) && matchesAuthor(q, author),
  );
}

/**
 * Pick a single random quote.
 *
 * Pass `seed` for deterministic output (useful for "quote of the day"
 * banners in CI, login MOTDs, tests, etc.).
 *
 * @example
 * ```ts
 * import { getRandomQuote } from 'devquotes';
 * console.log(getRandomQuote({ category: 'unix' }));
 * ```
 */
export function getRandomQuote(options: RandomOptions = {}): Quote | undefined {
  const pool = filterCorpus(options);
  if (pool.length === 0) return undefined;
  const rng = resolveRng(options.seed);
  return pool[Math.floor(rng() * pool.length)];
}

/**
 * Pick `count` distinct random quotes.
 *
 * If `count` exceeds the size of the matching pool, the whole pool is
 * returned (shuffled).
 */
export function getRandomQuotes(
  count: number,
  options: RandomOptions = {},
): Quote[] {
  const pool = filterCorpus(options);
  if (pool.length === 0) return [];
  const rng = resolveRng(options.seed);

  // Fisher–Yates shuffle, truncated to `count` swaps.
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rng() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/**
 * Deterministic "quote of the day" for a given date.
 *
 * The seed is derived from the YYYY-MM-DD representation of the date,
 * so every caller on the same day (in the same timezone) gets the same
 * quote — handy for shared team MOTDs.
 */
export function getQuoteOfTheDay(
  date: Date = new Date(),
  options: Omit<RandomOptions, 'seed'> = {},
): Quote | undefined {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  // Combine the date with a small constant so that QOTD doesn't trivially
  // collide with a user passing seed=20240101 themselves.
  const seed = Number(`${y}${m}${d}`) ^ 0x9e3779b9;
  return getRandomQuote({ ...options, seed });
}
