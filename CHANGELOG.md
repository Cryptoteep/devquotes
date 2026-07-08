# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Author biographies & portrait URLs.
- Fuzzy search with typo tolerance.
- `devquotes serve` — a tiny local HTTP API.

## [0.1.0] — 2025-01-15

### Added

- Initial public release of `devquotes`.
- Curated corpus of 100+ quotes from CS pioneers, with author, source, year,
  category and tags.
- Typed TypeScript API: `getAllQuotes`, `getQuoteById`, `getRandomQuote`,
  `getRandomQuotes`, `getQuoteOfTheDay`, `searchQuotes`, `listByCategory`,
  `listAuthors`, `countQuotes`, `exportQuotes`, `validateQuote`.
- CLI with commands: `random`, `today`, `search`, `list`, `categories`,
  `authors`, `export` (json | markdown | text | csv).
- Zero-dependency ANSI renderer with framed cards, compact lines and
  highlighted output. Respects `NO_COLOR`.
- Seedable PRNG (mulberry32) for reproducible random selection.
- Ranked full-text search across text, author, source and tags.
- 10 orthogonal categories: programming, philosophy, debugging, wisdom,
  humor, architecture, ai, unix, simplicity, teams.
- MIT license, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, quote schema docs.
- Examples: `basic.ts`, `search.ts`, `export.ts`.

### Notes

- Runtime has **zero dependencies**. Dev dependencies: `typescript`,
  `tsup`, `tsx`, `@types/node`.

[Unreleased]: https://github.com/Cryptoteep/devquotes/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Cryptoteep/devquotes/releases/tag/v0.1.0
