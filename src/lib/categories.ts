import type { QuoteCategory } from '../types.js';

/**
 * Metadata describing a quote category.
 */
export interface CategoryMeta {
  id: QuoteCategory;
  label: string;
  description: string;
  /** Emoji used by the CLI renderer. */
  icon: string;
}

/**
 * Canonical, ordered list of categories supported by devquotes.
 *
 * Keep these in sync with {@link QuoteCategory}.
 */
export const CATEGORIES: readonly CategoryMeta[] = [
  {
    id: 'programming',
    label: 'Programming',
    description: 'The craft and practice of writing code.',
    icon: '💻',
  },
  {
    id: 'philosophy',
    label: 'Philosophy',
    description: 'Foundational ideas about computing, mind and software.',
    icon: '🧭',
  },
  {
    id: 'debugging',
    label: 'Debugging',
    description: 'On bugs, debugging and the hunt for defects.',
    icon: '🔍',
  },
  {
    id: 'wisdom',
    label: 'Wisdom',
    description: 'Hard-won lessons worth carrying into your work.',
    icon: '✨',
  },
  {
    id: 'humor',
    label: 'Humor',
    description: 'Jokes, folklore and the lighter side of the craft.',
    icon: '😄',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    description: 'Structure, design and the shape of systems.',
    icon: '🏛️',
  },
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    description: 'Thoughts on machine intelligence and its limits.',
    icon: '🤖',
  },
  {
    id: 'unix',
    label: 'Unix',
    description: 'The Unix philosophy and its descendants.',
    icon: '🐢',
  },
  {
    id: 'simplicity',
    label: 'Simplicity',
    description: 'On minimalism, elegance and less being more.',
    icon: '🍃',
  },
  {
    id: 'teams',
    label: 'Teams',
    description: 'Collaboration, management and people.',
    icon: '🤝',
  },
] as const;

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

/**
 * Type guard that also validates unknown strings at runtime.
 */
export function isCategory(value: unknown): value is QuoteCategory {
  return typeof value === 'string' && CATEGORY_IDS.has(value);
}

/**
 * Look up a category's metadata by id. Returns `undefined` for unknown ids.
 */
export function getCategory(id: QuoteCategory): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/**
 * Parse a comma-separated list of categories into a validated array.
 * Unknown categories are dropped (and counted, so callers can warn).
 */
export function parseCategories(
  input: string | undefined,
): { categories: QuoteCategory[]; dropped: string[] } {
  const categories: QuoteCategory[] = [];
  const dropped: string[] = [];
  if (!input) return { categories, dropped };
  for (const raw of input.split(',')) {
    const token = raw.trim().toLowerCase();
    if (!token) continue;
    if (isCategory(token)) categories.push(token);
    else dropped.push(token);
  }
  return { categories, dropped };
}
