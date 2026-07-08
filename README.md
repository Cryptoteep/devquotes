# devquotes

> A curated, open-source collection of inspirational developer quotes — with a beautiful CLI and a typed API. **Zero runtime dependencies.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Cryptoteep/devquotes/blob/main/CONTRIBUTING.md)

`devquotes` is a tiny, opinionated library and CLI that ships a hand-curated
corpus of quotes from the pioneers, philosophers and pranksters of computing —
Knuth, Dijkstra, Hopper, Kay, Brooks, Torvalds, Carmack, Hickey, and many
others.

Use it to:

- Greet yourself with a random quote every time you open a terminal.
- Build "quote of the day" banners for your team's CI / MOTD.
- Power a `/quote` slash command in your bot or dashboard.
- Teach, study or just stay inspired.

## ✨ Features

- 📚 **100+ curated quotes** with author, source, year, category and tags.
- 🎨 **Beautiful terminal output** — framed cards, compact lines, color
  highlights — all zero-dependency ANSI (respects `NO_COLOR`).
- 🔍 **Ranked full-text search** across text, author, source and tags.
- 🎲 **Seedable randomness** — reproducible "quote of the day" for any date.
- 🏷️ **10 orthogonal categories** — programming, philosophy, debugging,
  wisdom, humor, architecture, ai, unix, simplicity, teams.
- 📤 **Export** to JSON, Markdown, plain text or CSV.
- 📦 **Programmatic TypeScript API** with full type definitions.
- 🌳 **Tree-shakeable** and dependency-free at runtime.
- 🤝 **Easy to contribute** — add a JSON object, open a PR.

## 🚀 Install

```bash
npm install devquotes
# or
pnpm add devquotes
# or
bun add devquotes
```

Use the CLI globally:

```bash
npm install -g devquotes
devquotes
```

Or run it ad-hoc without installing:

```bash
npx devquotes random --category unix
```

## 🧑‍💻 CLI

```
devquotes                          Random quote (card)
devquotes random [--category c] [--author a] [--seed n]
devquotes today                    Quote of the day
devquotes search <query> [--category c] [--limit n]
devquotes list [--category c] [--author a] [--limit n]
devquotes categories               List all categories with counts
devquotes authors                  List all authors
devquotes export <format>          Export quotes (json|markdown|text|csv)
devquotes --help | -h
devquotes --version | -v
```

### Examples

```bash
# A random quote
$ devquotes
╭──────────────────────────────────────────────────────────────╮
│  "Simplicity is prerequisite for reliability."               │
│                                                              │
│  — Edsger W. Dijkstra, EWD898 (1984)                         │
│                                                              │
│  🍃  Simplicity                                              │
╰──────────────────────────────────────────────────────────────╯

# Quote of the day (same for everyone on the same date)
$ devquotes today

# Search
$ devquotes search "naming things" --limit 3

# Filter by author
$ devquotes list --author knuth --plain

# Export the whole philosophy corpus to JSON
$ devquotes export json --category philosophy > philosophy.json

# Add a daily quote to your shell startup
$ echo 'devquotes today' >> ~/.zshrc
```

### Shell banner

Add this to your `~/.bashrc` / `~/.zshrc` for a daily dose of wisdom on
every new terminal:

```bash
command -v devquotes >/dev/null && devquotes today
```

## 📖 API

```ts
import {
  getRandomQuote,
  getQuoteOfTheDay,
  searchQuotes,
  listByCategory,
  renderQuoteCard,
  exportQuotes,
} from 'devquotes';

// Random quote
const q = getRandomQuote();
console.log(renderQuoteCard(q));

// Reproducible QOTD (same across a team on the same day)
const motd = getQuoteOfTheDay();

// Search with ranking
const hits = searchQuotes({ query: 'premature optimization', limit: 5 });
for (const { quote, score } of hits) {
  console.log(score, quote.author, '—', quote.text);
}

// Filter by category
for (const q of listByCategory('unix')) {
  console.log(`${q.author}: ${q.text}`);
}

// Export to markdown
const md = exportQuotes(hits.map((h) => h.quote), 'markdown');
```

See [`examples/`](./examples) for more, and the full type surface in
[`src/types.ts`](./src/types.ts).

## 🤝 Contributing

Yes, please! The easiest way to contribute is to **add a quote**:

1. Open [`src/data/quotes.json`](./src/data/quotes.json).
2. Add an object following the [schema](./docs/quotes-schema.md).
3. Run `bun run cli random` to sanity-check.
4. Open a PR.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full guide, and
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) for our community standards.

We especially welcome:

- Quotes from **underrepresented pioneers** in computing.
- Quotes with **solid sourcing** (book, paper, recorded talk).
- Translations of the README (see `i18n/` once it exists).
- Improvements to the **renderer** and **search ranking**.

## 🗺️ Roadmap

- [ ] v0.2 — author biographies & portraits
- [ ] v0.3 — fuzzy search & typo tolerance
- [ ] v0.4 — `devquotes serve` — a tiny local HTTP API
- [ ] v0.5 — i18n: quote translations
- [ ] v1.0 — stable API, 250+ quotes, plugin system

Track progress in [the roadmap issue](https://github.com/Cryptoteep/devquotes/issues).

## 📜 License

MIT © [Cryptoteep](https://github.com/Cryptoteep)

The curated quotes themselves are short factual attributions of public
statements; sources are cited wherever known. If you believe a quote is
misattributed or mis-sourced, please [open an issue](https://github.com/Cryptoteep/devquotes/issues/new).

## 💛 Acknowledgements

This project stands on the shoulders of everyone whose words are quoted
here. Thank you for shaping the field we work in.
