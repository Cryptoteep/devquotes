# Contributing to devquotes

First of all: **thank you** for taking the time to contribute. 🎉

This project thrives on community curation. Whether you're adding a single
quote, fixing a typo, or refactoring the renderer — every contribution is
welcome.

## 🧭 Project mission

`devquotes` exists to give developers a **free, high-quality, community-curated**
source of wisdom from the people who built computing. We optimize for:

1. **Quality over quantity** — every quote is sourced and attributed.
2. **Zero dependencies** — the runtime stays tiny and auditable.
3. **Respectful attribution** — we cite sources and credit authors.
4. **Inclusivity** — we especially welcome quotes from underrepresented
   pioneers in computing.

## 🐛 Reporting bugs

- Open a [new issue](https://github.com/Cryptoteep/devquotes/issues/new).
- Include the `devquotes --version` output and your Node version.
- Paste the exact command you ran and the output you saw.
- For renderer bugs, run with `--no-color` and include both outputs.

## 💡 Suggesting enhancements

- Open an issue with the `enhancement` label.
- Describe the use case before the solution.

## ➕ Adding a quote

This is the most common (and most welcome!) contribution.

1. Open [`src/data/quotes.json`](./src/data/quotes.json).
2. Add a new object following the [schema](./docs/quotes-schema.md).
3. Make sure the `id` is unique and kebab-case.
4. Pick **exactly one** primary `category` from the canonical list.
5. Add 1–5 lowercase `tags`.
6. Cite a `source` and `year` wherever possible.
7. Run `bun run cli random` (or `npm run cli`) to sanity-check rendering.
8. Open a PR with title `quote: add <author> — <short slug>`.

### Sourcing guidelines

- **Prefer** the earliest known publication (book, paper, recorded talk).
- **Avoid** unsourced "quote aggregator" websites.
- If attribution is disputed, set `source: "apocryphal"` and add a `disputed` tag.
- Short factual quotations of public statements are fine; we don't reproduce
  long passages. When in doubt, cite and keep it short.

### Example entry

```json
{
  "id": "knuth-premature-optimization",
  "text": "Premature optimization is the root of all evil.",
  "author": "Donald Knuth",
  "source": "The Art of Computer Programming, Vol. 1",
  "year": 1968,
  "category": "programming",
  "tags": ["optimization", "performance", "classic"]
}
```

## 🛠️ Development setup

```bash
git clone https://github.com/Cryptoteep/devquotes.git
cd devquotes
npm install        # or pnpm install / bun install
npm run cli random # try the CLI in development
npm run typecheck  # type-check
npm run build      # produce dist/
```

The project uses:

- **TypeScript** strict mode.
- **tsup** for bundling (ESM + CJS + `.d.ts`).
- No runtime dependencies. Dev dependencies are kept minimal.

## 🧪 Before opening a PR

- [ ] `npm run typecheck` passes.
- [ ] `npm run build` succeeds.
- [ ] The CLI still works: `npm run cli`, `npm run cli search foo`,
      `npm run cli categories`.
- [ ] If you added a quote, the JSON is valid and the id is unique.
- [ ] Commit message follows [Conventional Commits](https://www.conventionalcommits.org/):
      `quote:`, `fix:`, `feat:`, `docs:`, `refactor:`, `chore:`.

## 🏷️ Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
quote: add dijkstra on simplicity
fix: wrap long lines in card renderer
feat: add csv export format
docs: clarify sourcing guidelines
refactor: split search scoring into its own function
chore: bump tsup to 8.3
```

## 🌳 Branch naming

- `quote/<author>-<slug>` — for new quotes
- `fix/<short-description>` — for bug fixes
- `feat/<short-description>` — for new features
- `docs/<short-description>` — for documentation

## 📜 Code of Conduct

Participation in this project is governed by the
[Code of Conduct](./CODE_OF_CONDUCT.md). Please be excellent to each other.

## 💛 Recognition

All contributors are listed in the README's contributor table (coming soon)
and thanked in release notes. Significant contributions may be invited as
maintainers.
