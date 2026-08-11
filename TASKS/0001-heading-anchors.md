# 0001 Heading anchors

Status: done
Priority: medium
Subsystem: parser
Depends on: none

## Context
`render()` in [src/index.ts](src/index.ts) currently emits headings as plain `<h1>Title</h1>` ...
`<h6>...</h6>` with no `id` attribute (confirmed via
[src/slimdown.test.ts:7](src/slimdown.test.ts:7), `<h1>Hello world</h1>`). Consumers (e.g. the
mithril-markdown-wysiwyg editor) want anchor links on rendered headings, but slimdown-js is used
by several other projects too (afko, dtag), so this must NOT change output for existing callers
by default.

## Acceptance Criteria
- `RenderOptions` gains a new field following the existing pattern at
  [src/index.ts:784-793](src/index.ts:784) (`removeParagraphs`, `externalLinks`, `alphaLists`,
  `extensions`):
  ```ts
  /** If true, add a slugified `id` attribute to each heading. Default: false. */
  headingIds?: boolean;
  ```
  Default `false` — output is unchanged unless a caller opts in, same convention as `externalLinks`.
- When `headingIds` is true, every `<h1>`-`<h6>` gets an `id` derived by slugifying its rendered
  text content:
  - lowercase
  - strip/replace anything that isn't `[a-z0-9]` with `-`
  - collapse repeated `-`, trim leading/trailing `-`
  - if the heading text is empty after stripping (e.g. a heading made only of emoji/symbols),
    fall back to `section` as the base slug
  - slugify from the heading's rendered inline content (after inline markdown like `**bold**`/
    links is processed to plain text), not the raw markdown source line, so `## **Setup**`
    produces `id="setup"`, not `id="setup"` with stray asterisks/markup left in.
- Duplicate slugs within one `render()` call are handled: second occurrence of the same slug gets
  `-2` appended, third gets `-3`, etc. (mirrors GitHub's heading-anchor behavior). The slug-count
  map must be scoped to a single `render()` call, not module-level/global state (avoid cross-call
  leakage, especially since slimdown-js may run `render()` many times in one process — e.g. in a
  server or in the editor's live-preview loop).
- Non-ASCII text (accented Latin, CJK, etc.): check how the codebase already handles Unicode
  elsewhere (if anywhere) for a consistent convention; otherwise default to stripping accents to
  their base Latin letter where feasible, then dropping characters outside `[a-z0-9-]`. Keep this
  simple/dependency-free — no full Unicode-aware slugification, no new npm dependency.
- Test cases added in [src/slimdown.test.ts](src/slimdown.test.ts) alongside the existing heading
  tests (see the `<h1>Title</h1>` block around line 247): headings with inline markup, duplicate
  heading text producing `-2`/`-3` suffixes, and confirmation that the default (no options passed)
  output for existing heading tests is unchanged (i.e. no `id` attribute when `headingIds` is not
  passed).
- README/docs for `RenderOptions` updated to document the new option, matching how
  `externalLinks`/`alphaLists` are documented there.

## Implementation Notes
- Files: [src/index.ts](src/index.ts) (heading rules + `RenderOptions` interface around lines
  784-793), [src/slimdown.test.ts](src/slimdown.test.ts) (tests near line 247), README.md
  (`RenderOptions` docs table/list).
- Non-goals: no "copy link" icon/anchor `<a>` tag inside the heading — that's a consumer-side UI
  concern (mithril-markdown-wysiwyg will add its own hover icon on top of the `id`); this task is
  just the `id` attribute. No new runtime dependency for slugification.

## Agent Notes
- Implemented as a post-processing pass rather than inside the early `header()` rule, because
  `header()` runs before the bold/emphasis/links rules in `preParaRules`
  ([src/index.ts:743-773](src/index.ts:743)), so raw markdown (e.g. `**Setup**`) is not yet
  rendered to `<strong>` at that point. Instead, `addHeadingIds()`
  ([src/index.ts:640-657](src/index.ts:640)) runs near the end of `render()` (right after the
  footnotes section is appended, before `removeParagraphs`/`externalLinks` post-processing),
  scanning the fully-rendered HTML for `<h1>`-`<h6>` tags, stripping any inner HTML tags to get
  plain text, then slugifying via `slugify()` ([src/index.ts:629-638](src/index.ts:629)) — NFD
  normalize + strip combining diacritical marks (`̀-ͯ`) + lowercase +
  collapse-non-`[a-z0-9]`-to-`-` + trim + fallback to `section` if empty.
  A `Map` scoped to the single `addHeadingIds()` call tracks slug counts for `-2`/`-3` suffixing,
  so no module-level state leaks across `render()` calls.
- `RenderOptions.headingIds` added at [src/index.ts:791-792](src/index.ts:791), threaded through
  both branches of the options-parsing `if` in `render()` (object form and legacy positional
  form — legacy form always defaults `headingIds` to `false`).
- Tests added in [src/slimdown.test.ts](src/slimdown.test.ts) right after the big multi-feature
  heading test (~line 290): default/off behavior, `headingIds: true` basic case, slugifying
  rendered inline content (`**Setup**` → `id="setup"`, not raw markup), symbol-only heading
  falling back to `section`, accent stripping (`Café Déjà Vu` → `cafe-deja-vu`), duplicate-slug
  `-2`/`-3` suffixing, and cross-call isolation (two separate `render()` calls each start their
  slug counts fresh).
- Verified: `npm run test:core` passes all 92 tests (84 pre-existing + 8 new), `npx tsc --noEmit`
  clean, and manually inspected compiled output for the accent/symbol/bold-heading edge cases.
- README.md updated: `options.headingIds` row in the `RenderOptions` table and a bullet in the
  features list, matching the existing `alphaLists` documentation style.
- Non-goals confirmed out of scope and not implemented: no `<a>` "copy link" anchor tag inside
  headings (left to consumers like mithril-markdown-wysiwyg), no new npm dependency for
  slugification.
