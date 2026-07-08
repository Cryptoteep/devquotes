# devquotes — Quote Schema

Every quote in [`src/data/quotes.json`](../src/data/quotes.json) is a JSON object
conforming to the `Quote` type from `src/types.ts`:

```ts
interface Quote {
  id: string;            // stable, kebab-case, globally unique
  text: string;          // the quote itself
  author: string;        // full name as commonly known
  source?: string;       // book, talk, paper, interview, RFC, etc.
  year?: number;         // 4-digit year of origin (if known)
  category: QuoteCategory;
  tags?: string[];       // optional, lowercase, 1–5 tags
}
```

## Categories

The canonical set of categories is defined in `src/lib/categories.ts`:

| id            | label               | icon |
|---------------|---------------------|------|
| programming   | Programming         | 💻   |
| philosophy    | Philosophy          | 🧭   |
| debugging     | Debugging           | 🔍   |
| wisdom        | Wisdom              | ✨   |
| humor         | Humor               | 😄   |
| architecture  | Architecture        | 🏛️   |
| ai            | Artificial Intelligence | 🤖 |
| unix          | Unix                | 🐢   |
| simplicity    | Simplicity          | 🍃   |
| teams         | Teams               | 🤝   |

If you need a new category, open a discussion first — categories are
deliberately kept small and orthogonal.

## ID rules

- Lowercase, words separated by `-`.
- Start with the author's surname (e.g. `knuth-...`, `dijkstra-...`).
- End with a short, human-readable slug describing the quote.
- Examples: `knuth-premature-optimization`, `brooks-mythical-man-month`,
  `kernighan-debugging`.

## Attribution & sourcing

- Prefer the **earliest known** source. If a quote is widely attributed but
  the source is disputed, set `source` to `"apocryphal"` or omit it and add
  a `disputed` tag.
- Year should reflect when the quote was first **published or spoken**, not
  when the author was born.

## Tags

- Lowercase, no spaces.
- 1–5 tags per quote.
- Reuse existing tags where possible (see the dataset for examples).
