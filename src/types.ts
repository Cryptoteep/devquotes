/**
 * Core type definitions for devquotes.
 *
 * @packageDocumentation
 */

/**
 * A category that groups quotes by theme.
 *
 * Keep these in sync with {@link CATEGORIES}.
 */
export type QuoteCategory =
  | 'programming'
  | 'philosophy'
  | 'debugging'
  | 'wisdom'
  | 'humor'
  | 'architecture'
  | 'ai'
  | 'unix'
  | 'simplicity'
  | 'teams';

/**
 * A single curated quote.
 */
export interface Quote {
  /** Stable unique identifier (slug-style, e.g. `knuth-premature-optimization`). */
  id: string;
  /** The quote text. */
  text: string;
  /** The person who said or wrote it. */
  author: string;
  /** Optional source (book, talk, paper, interview). */
  source?: string;
  /** Optional year the quote originates from. */
  year?: number;
  /** Primary category. */
  category: QuoteCategory;
  /** Additional free-form tags for fine-grained search. */
  tags?: string[];
}

/**
 * Options accepted by {@link getRandomQuote} and {@link getRandomQuotes}.
 */
export interface RandomOptions {
  /** Filter by one or more categories before picking. */
  category?: QuoteCategory | QuoteCategory[];
  /** Filter by author (case-insensitive substring match). */
  author?: string;
  /** Reproducible seed for deterministic output (handy in tests / CI banners). */
  seed?: number;
}

/**
 * Options accepted by {@link searchQuotes}.
 */
export interface SearchOptions {
  /** Full-text query matched against text, author, source and tags. */
  query: string;
  /** Restrict the search to these categories. */
  category?: QuoteCategory | QuoteCategory[];
  /** Restrict the search to this author (case-insensitive substring). */
  author?: string;
  /** Maximum number of results. Defaults to `20`. */
  limit?: number;
}

/**
 * Supported export formats.
 */
export type ExportFormat = 'json' | 'markdown' | 'text' | 'csv';

/** Internal result of a search hit, used for ranking. */
export interface SearchResult {
  quote: Quote;
  /** Relevance score (higher is better). */
  score: number;
}
