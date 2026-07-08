#!/usr/bin/env node
/**
 * devquotes CLI — a beautiful terminal interface to the curated quote corpus.
 *
 * Designed to be dependency-free (no commander, no chalk) so it boots fast
 * and stays easy to audit.
 *
 * Usage:
 *   devquotes                          Random quote (card)
 *   devquotes random [--category c] [--author a] [--seed n]
 *   devquotes today                    Quote of the day
 *   devquotes search <query> [--category c] [--limit n]
 *   devquotes list [--category c] [--author a] [--limit n]
 *   devquotes categories               List all categories
 *   devquotes authors                  List all authors
 *   devquotes export <format> [--category c] [--author a]
 *                                       format: json|markdown|text|csv
 *   devquotes --help | -h              Show help
 *   devquotes --version | -v           Show version
 */

import {
  CATEGORIES,
  ansi,
  countQuotes,
  exportQuotes,
  getAllQuotes,
  getQuoteOfTheDay,
  getRandomQuote,
  listAuthors,
  listByCategory,
  renderQuoteCard,
  renderQuoteHighlight,
  renderQuoteLine,
  renderQuoteList,
  searchQuotes,
  VERSION,
} from './index.js';
import type { ExportFormat, QuoteCategory } from './types.js';

interface ParsedArgs {
  command: string;
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
      i++;
      continue;
    }
    if (arg === '--version' || arg === '-v') {
      flags.version = true;
      i++;
      continue;
    }
    if (arg === '--no-color') {
      process.env.NO_COLOR = '1';
      i++;
      continue;
    }
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i += 2;
      } else {
        flags[key] = true;
        i++;
      }
      continue;
    }
    positional.push(arg);
    i++;
  }

  return { command: positional[0] ?? '', positional: positional.slice(1), flags };
}

function help(): string {
  return `
${ansi.bold('devquotes')} ${ansi.gray(`v${VERSION}`)}
${ansi.dim('A curated, open-source collection of inspirational developer quotes.')}

${ansi.bold('USAGE')}
  devquotes <command> [options]

${ansi.bold('COMMANDS')}
  ${ansi.cyan('random')}                     Show a random quote (default)
  ${ansi.cyan('today')}                      Show the quote of the day
  ${ansi.cyan('search')} <query>             Full-text search
  ${ansi.cyan('list')}                       List quotes (with filters)
  ${ansi.cyan('categories')}                 List all categories
  ${ansi.cyan('authors')}                    List all authors
  ${ansi.cyan('export')} <format>            Export quotes (json|md|text|csv)

${ansi.bold('OPTIONS')}
  --category <c>             Filter by category (comma-separated)
  --author <name>            Filter by author (substring, case-insensitive)
  --limit <n>                Maximum number of results (default: 20)
  --seed <n>                 Reproducible random selection
  --format <f>               Output format for export
  --plain                    Use compact one-line rendering
  --no-color                 Disable ANSI colors
  -h, --help                 Show this help
  -v, --version              Show version

${ansi.bold('EXAMPLES')}
  ${ansi.gray('$')} devquotes
  ${ansi.gray('$')} devquotes random --category unix
  ${ansi.gray('$')} devquotes search "naming things" --limit 3
  ${ansi.gray('$')} devquotes list --author knuth --plain
  ${ansi.gray('$')} devquotes export json --category philosophy > quotes.json
  ${ansi.gray('$')} devquotes today

${ansi.bold('CONTRIBUTE')}
  Add a quote: ${ansi.underline('https://github.com/Cryptoteep/devquotes/blob/main/CONTRIBUTING.md')}
  Report a bug: ${ansi.underline('https://github.com/Cryptoteep/devquotes/issues')}

${ansi.gray('Made with care. MIT licensed.')}
`.trim();
}

function toCategories(value: string | boolean | undefined): QuoteCategory[] {
  if (!value || typeof value === 'boolean') return [];
  const known = new Set(CATEGORIES.map((c) => c.id));
  return value
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is QuoteCategory => known.has(s));
}

function toString(value: string | boolean | undefined): string | undefined {
  if (typeof value === 'string') return value;
  return undefined;
}

function toNumber(value: string | boolean | undefined): number | undefined {
  if (typeof value !== 'string') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function fail(message: string): never {
  console.error(`${ansi.red('error')} ${message}`);
  console.error(`Run ${ansi.cyan('devquotes --help')} for usage.`);
  process.exit(1);
}

function getCorpus(flags: Record<string, string | boolean>): typeof getAllQuotes extends () => infer Q ? Q[] : never {
  const categories = toCategories(flags.category);
  const author = toString(flags.author);
  let quotes = getAllQuotes();
  if (categories.length) {
    quotes = quotes.filter((q) => categories.includes(q.category));
  }
  if (author) {
    const a = author.toLowerCase();
    quotes = quotes.filter((q) => q.author.toLowerCase().includes(a));
  }
  return quotes as unknown as ReturnType<typeof getCorpus>;
}

function main(): void {
  const { command, positional, flags } = parseArgs(process.argv);

  if (flags.help) {
    console.log(help());
    return;
  }
  if (flags.version) {
    console.log(VERSION);
    return;
  }

  const plain = flags.plain === true;

  switch (command) {
    case '':
    case 'random': {
      const quote = getRandomQuote({
        category: toCategories(flags.category),
        author: toString(flags.author),
        seed: toNumber(flags.seed),
      });
      if (!quote) fail('No quotes matched your filters.');
      console.log(plain ? renderQuoteLine(quote) : renderQuoteCard(quote));
      return;
    }

    case 'today': {
      const quote = getQuoteOfTheDay({
        category: toCategories(flags.category),
        author: toString(flags.author),
      });
      if (!quote) fail('No quotes matched your filters.');
      console.log(plain ? renderQuoteLine(quote) : renderQuoteCard(quote));
      return;
    }

    case 'search': {
      const query = positional.join(' ').trim();
      if (!query) fail('search requires a query. Example: devquotes search "naming things"');
      const results = searchQuotes({
        query,
        category: toCategories(flags.category),
        author: toString(flags.author),
        limit: toNumber(flags.limit),
      });
      if (results.length === 0) {
        console.log(ansi.gray('No quotes matched your query.'));
        return;
      }
      console.log(renderQuoteList(results.map((r) => r.quote)));
      return;
    }

    case 'list': {
      let quotes = getCorpus(flags);
      const limit = toNumber(flags.limit);
      if (typeof limit === 'number') quotes = quotes.slice(0, limit);
      if (quotes.length === 0) {
        console.log(ansi.gray('No quotes matched your filters.'));
        return;
      }
      console.log(renderQuoteList(quotes));
      return;
    }

    case 'categories': {
      const total = countQuotes();
      for (const c of CATEGORIES) {
        const count = listByCategory(c.id).length;
        const bar = '█'.repeat(Math.round((count / total) * 20));
        console.log(
          `${c.icon}  ${ansi.bold(c.label.padEnd(20))} ${ansi.cyan(bar.padEnd(20))} ${ansi.gray(String(count).padStart(3))} quotes`,
        );
        console.log(ansi.dim(`   ${c.description}`));
      }
      console.log(`\n${ansi.gray(`${total} quotes across ${CATEGORIES.length} categories`)}`);
      return;
    }

    case 'authors': {
      const authors = listAuthors();
      console.log(ansi.bold(`${authors.length} authors`));
      for (const a of authors) {
        const count = getAllQuotes().filter((q) => q.author === a).length;
        console.log(`  ${ansi.cyan(a.padEnd(28))} ${ansi.gray(`${count} quote${count === 1 ? '' : 's'}`)}`);
      }
      return;
    }

    case 'export': {
      const format = (positional[0] ?? toString(flags.format)) as ExportFormat;
      if (!['json', 'markdown', 'text', 'csv'].includes(format)) {
        fail('export requires a format: json | markdown | text | csv');
      }
      const quotes = getCorpus(flags);
      if (quotes.length === 0) {
        console.error(ansi.gray('No quotes matched your filters; nothing to export.'));
        return;
      }
      console.log(exportQuotes(quotes, format));
      return;
    }

    default:
      fail(`Unknown command: ${command}`);
  }
}

main();
