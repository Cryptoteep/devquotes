import type { Quote } from '../types.js';
import { getCategory } from './categories.js';

/**
 * Minimal ANSI styling helpers — no dependencies, respects NO_COLOR.
 *
 * Following the de-facto `NO_COLOR` convention (https://no-color.org/),
 * all styling is automatically disabled when the env var is set to any
 * non-empty value.
 */
const NO_COLOR = process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== '';

const wrap = (open: string, close: string) => (text: string): string =>
  NO_COLOR ? text : `${open}${text}${close}`;

const styles = {
  bold: wrap('\x1b[1m', '\x1b[22m'),
  dim: wrap('\x1b[2m', '\x1b[22m'),
  italic: wrap('\x1b[3m', '\x1b[23m'),
  underline: wrap('\x1b[4m', '\x1b[24m'),
  cyan: wrap('\x1b[36m', '\x1b[39m'),
  magenta: wrap('\x1b[35m', '\x1b[39m'),
  green: wrap('\x1b[32m', '\x1b[39m'),
  yellow: wrap('\x1b[33m', '\x1b[39m'),
  gray: wrap('\x1b[90m', '\x1b[39m'),
  red: wrap('\x1b[31m', '\x1b[39m'),
};

const BOX_WIDTH = 64;

function pad(text: string, width: number): string {
  if (text.length >= width) return text;
  return text + ' '.repeat(width - text.length);
}

function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }
    if (current.length + 1 + word.length <= width) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Render a single quote as a beautifully framed terminal block.
 *
 * Example output (without color):
 *
 * ```
 * ╭──────────────────────────────────────────────────────────────╮
 * │  "Premature optimization is the root of all evil."           │
 * │                                                              │
 * │  — Donald Knuth, The Art of Computer Programming (1968)      │
 * ╰──────────────────────────────────────────────────────────────╯
 * ```
 */
export function renderQuoteCard(quote: Quote): string {
  const innerWidth = BOX_WIDTH - 4; // 2 padding + 2 borders
  const textLines = wrapText(quote.text, innerWidth);

  const meta = buildAttribution(quote);
  const metaLines = meta ? wrapText(meta, innerWidth) : [];

  const top = `╭${'─'.repeat(BOX_WIDTH - 2)}╮`;
  const bottom = `╰${'─'.repeat(BOX_WIDTH - 2)}╯`;
  const blank = `│${pad('', BOX_WIDTH - 2)}│`;

  const out: string[] = [top];

  for (const line of textLines) {
    const padded = pad(`  ${line}`, BOX_WIDTH - 2);
    out.push(`│${styles.italic(padded)}│`);
  }

  if (metaLines.length) {
    out.push(blank);
    for (const line of metaLines) {
      const padded = pad(`  ${line}`, BOX_WIDTH - 2);
      out.push(`│${styles.gray(padded)}│`);
    }
  }

  // Category badge
  const cat = getCategory(quote.category);
  if (cat) {
    out.push(blank);
    const badge = `  ${cat.icon}  ${cat.label}`;
    const padded = pad(badge, BOX_WIDTH - 2);
    out.push(`│${styles.dim(padded)}│`);
  }

  out.push(bottom);
  return out.join('\n');
}

/** Build the human-readable attribution line, e.g. "— Donald Knuth, TAOCP (1968)". */
function buildAttribution(quote: Quote): string {
  const parts: string[] = [`— ${quote.author}`];
  if (quote.source) parts.push(quote.source);
  if (typeof quote.year === 'number') parts.push(String(quote.year));
  return parts.join(', ');
}

/**
 * Render a single quote as a compact one-liner (great for MOTDs / banners).
 */
export function renderQuoteLine(quote: Quote): string {
  const meta = buildAttribution(quote);
  return `${styles.cyan(`"${quote.text}"`)} ${styles.gray(meta)}`;
}

/**
 * Render a list of quotes as compact lines with a numeric prefix.
 */
export function renderQuoteList(quotes: Quote[]): string {
  return quotes
    .map((q, i) => {
      const num = styles.gray(`${String(i + 1).padStart(3, ' ')}. `);
      const body = styles.cyan(`"${q.text}"`);
      const meta = styles.gray(buildAttribution(q));
      return `${num}${body} ${meta}`;
    })
    .join('\n');
}

/**
 * Render a quote with explicit color highlights on the author name.
 */
export function renderQuoteHighlight(quote: Quote): string {
  const text = styles.bold(`"${quote.text}"`);
  const meta = buildAttribution(quote).replace(
    quote.author,
    styles.magenta(quote.author),
  );
  return `${text}\n${styles.gray(meta)}`;
}

export { styles as ansi };
