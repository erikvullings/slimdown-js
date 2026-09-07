# 0003 Improve line continuations

Status: done
Priority: high
Subsystem: parser
Depends on: 0002

## Context
The hard-break fix from 0002 keeps text after two trailing spaces in a paragraph, but ordinary
soft newlines still cause physical lines to be parsed independently. Indented and lazy prose
continuations after ordered or unordered list markers likewise escape the current list item.

## Acceptance Criteria
- Consecutive non-blank prose lines render as one paragraph with soft breaks and no `<br>`.
- Two or more trailing spaces before LF or CRLF render one `<br>` inside the current block.
- Ordered and unordered list items retain valid lazy or indented prose continuations.
- Continuations do not consume sibling items, nested lists, paragraphs after blank lines, or code.
- Existing tables, blockquotes, task lists, definitions, fenced code, and nested lists keep working.
- README.md documents soft breaks, hard breaks, and list continuations.
- Type checking, all tests, and package builds pass.

## Implementation Notes
- Relevant files: `src/index.ts`, `src/slimdown.test.ts`, and `README.md`.
- Group logical prose and list-item content before rendering completed blocks.
- Keep code extraction ahead of normal line processing and avoid globally converting newlines.

## Agent Notes
- 2026-09-07: Started from 0002. The existing paragraph regex wraps one physical line at a time,
  and list markers are converted to standalone tokens before `processListItems`, so continuation
  content must be attached before list HTML is built.
- 2026-09-07: Implemented logical paragraph grouping and list-item continuation accumulation in
  `src/index.ts`. Continuation boundaries cover sibling and nested lists, headings, blockquotes,
  code, footnotes, definitions, and captioned tables. CRLF fenced-code content is extracted and
  preserved before normalizing prose line endings.
- 2026-09-07: Added public-API regressions in `src/slimdown.test.ts` for LF/CRLF soft breaks;
  unordered, ordered, task, and alpha-list continuations; and all relevant block boundaries.
  Updated `README.md`. Browser DOM inspection confirmed paragraph/list structure and unchanged
  code text. All 116 core tests, workspace tests, type checking, and package builds pass.
