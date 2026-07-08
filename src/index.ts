/**
 * devquotes — a curated, open-source collection of inspirational developer
 * quotes with a beautiful CLI and typed API. Zero runtime dependencies.
 *
 * @packageDocumentation
 */

export type {
  Quote,
  QuoteCategory,
  RandomOptions,
  SearchOptions,
  SearchResult,
  ExportFormat,
} from './types.js';

export {
  CATEGORIES,
  isCategory,
  getCategory,
  parseCategories,
} from './lib/categories.js';
export type { CategoryMeta } from './lib/categories.js';

export {
  getAllQuotes,
  getQuoteById,
  countQuotes,
  listAuthors,
  validateQuote,
} from './lib/loader.js';

export { searchQuotes, listByCategory } from './lib/search.js';

export {
  getRandomQuote,
  getRandomQuotes,
  getQuoteOfTheDay,
} from './lib/random.js';

export {
  renderQuoteCard,
  renderQuoteLine,
  renderQuoteList,
  renderQuoteHighlight,
  ansi,
} from './lib/render.js';

export { exportQuotes } from './lib/export.js';

/**
 * Library version, kept in sync with package.json.
 */
export const VERSION = '0.1.0';
