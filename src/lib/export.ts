import type { ExportFormat, Quote } from '../types.js';
import { getCategory } from './categories.js';

/**
 * Serialize an array of quotes to the requested format.
 *
 * Supported formats: `json`, `markdown`, `text`, `csv`.
 */
export function exportQuotes(quotes: Quote[], format: ExportFormat): string {
  switch (format) {
    case 'json':
      return exportJson(quotes);
    case 'markdown':
      return exportMarkdown(quotes);
    case 'text':
      return exportText(quotes);
    case 'csv':
      return exportCsv(quotes);
    default: {
      const exhaustive: never = format;
      throw new Error(`Unsupported export format: ${String(exhaustive)}`);
    }
  }
}

function exportJson(quotes: Quote[]): string {
  return JSON.stringify(quotes, null, 2);
}

function exportText(quotes: Quote[]): string {
  return quotes
    .map((q) => {
      const parts = [`"${q.text}"`, `  — ${q.author}`];
      if (q.source) parts.push(`    (${q.source})`);
      if (typeof q.year === 'number') parts.push(`    (${q.year})`);
      return parts.join('\n');
    })
    .join('\n\n');
}

function exportMarkdown(quotes: Quote[]): string {
  const lines: string[] = ['# devquotes'];
  for (const q of quotes) {
    lines.push('');
    lines.push(`> "${q.text}"`);
    const meta = [q.author, q.source, typeof q.year === 'number' ? String(q.year) : null]
      .filter(Boolean)
      .join(', ');
    lines.push(`> — *${meta}*`);
    const cat = getCategory(q.category);
    if (cat) lines.push(`> \n> \`${cat.icon} ${cat.label}\``);
    if (q.tags?.length) lines.push(`> \n> ${q.tags.map((t) => `\`#${t}\``).join(' ')}`);
  }
  return lines.join('\n');
}

function csvEscape(value: string | number | undefined): string {
  if (value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportCsv(quotes: Quote[]): string {
  const header = 'id,text,author,source,year,category,tags';
  const rows = quotes.map((q) =>
    [
      q.id,
      q.text,
      q.author,
      q.source ?? '',
      typeof q.year === 'number' ? q.year : '',
      q.category,
      (q.tags ?? []).join(';'),
    ]
      .map(csvEscape)
      .join(','),
  );
  return [header, ...rows].join('\n');
}
