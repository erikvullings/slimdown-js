# 0002 Fix Markdown hard breaks

Status: done
Priority: high
Subsystem: parser
Depends on: none

## Context
In slimdown-js 1.5.0, `render("first line  \nsecond line")` recognized the two trailing spaces
as a hard break but produced `<p>first line<br></p>second line`. The hard-break rule inserted
`<br>\n` before paragraph processing, so the paragraph pass treated the remaining physical
newline as a block boundary and left the following text outside the paragraph.

## Acceptance Criteria
- Two or more spaces before `\n` or `\r\n` produce one `<br>`.
- Text following a hard break remains in the same paragraph.
- A single newline remains a soft line break and does not produce `<br>`.
- A blank line continues to end the paragraph.
- Hard-break syntax inside fenced code blocks and inline code remains unchanged.
- Existing list, blockquote, table, and other rendering behavior remains compatible.
- Regression tests, type checking, the complete test suite, and package builds pass.
- README.md documents hard-line-break syntax and behavior.

## Implementation Notes
- Relevant files: `src/index.ts`, `src/slimdown.test.ts`, and `README.md`.
- Keep the regex-based architecture and dependency-free parser.
- Preserve a physical newline for block-level parsing, but remove it before paragraph processing
  when it represents a hard break between paragraph continuation lines.
- Any temporary placeholder must be selected dynamically so literal user content cannot collide.

## Agent Notes
- Implemented a collision-safe hard-break placeholder in `src/index.ts`. Code blocks and inline
  code are extracted first; hard breaks retain their newline through list and other block parsing;
  the newline is removed only for paragraph continuations; and placeholders become `<br>` after
  paragraph processing.
- Added public-API regression coverage in `src/slimdown.test.ts` for two and three spaces, LF and
  CRLF, one-paragraph output, soft newlines, blank-line paragraph boundaries, fenced and inline
  code, placeholder collisions, and following list/blockquote markers.
- Documented hard line breaks in `README.md`.
- Completed with all 99 tests passing via `npm test`; TypeScript compilation and all core and
  workspace package builds pass via `npm run build`.
