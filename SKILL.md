---
name: slimdown-js-markdown-parser
description: Use slimdown-js, a lightweight (~2.8 kB minified), regex-based Markdown-to-HTML parser written in TypeScript. This skill covers installation, basic rendering, supported Markdown syntax (extended CommonMark subset including images, tables, task lists, math, footnotes, definition lists, etc.), adding custom parsing rules via addRule, browser vs module usage, and best practices for simple, client-side or Node.js Markdown conversion. Invoke this skill when the user needs to convert Markdown strings to safe HTML using a tiny, dependency-free parser without full CommonMark compliance.
---

# slimdown-js Markdown Parser

## Overview & When to Use This Skill

Use this skill for tasks involving **slimdown-js** — a very basic, regex-based Markdown parser[](https://github.com/erikvullings/slimdown-js) originally based on a PHP gist, ported to TypeScript, and extended with extra features.

Key characteristics:

- Extremely small footprint (~2.8 kB compressed)
- No dependencies
- Pure regex replacements → fast but not fully spec-compliant
- Good for simple blogs, comments, notes, previews, or embedded Markdown rendering
- Supports many common and some extended elements (tables, math, task lists, footnotes, definition lists, etc.)

Do NOT use this skill for:

- Full CommonMark/GFM compliance (use marked, markdown-it, micromark, etc.)
- Security-critical sanitization (slimdown-js does not escape HTML by default)
- Complex parsing needs (nested block elements, edge cases)

## Installation

```bash
npm install slimdown-js
```

## Basic Usage

### ES Modules (recommended)

```ts
import { render } from 'slimdown-js';

const md = `
# Hello World

This is **bold** and _italic_ text.

- [x] Task done
- [ ] Task pending
`;

const html = render(md);
console.log(html);
// Outputs: <h1>Hello World</h1><p>This is <strong>bold</strong> and <em>italic</em> text.</p><ul><li><input type="checkbox" checked disabled> Task done</li>...
```

### CommonJS / Node.js

```js
const { render } = require('slimdown-js');
const html = render('# Title\n\n**Content**');
```

### Browser (via CDN)

```html
<script src="https://unpkg.com/slimdown-js"></script>
<script>
  const html = window.slimdownJs.render('# Browser Test\n\nInline $$   math   $$ here.');
  document.getElementById('content').innerHTML = html;
</script>
```

## Supported Markdown Syntax

`slimdown-js` supports a practical subset via sequential regex replacements:

- Headers: `# H1` to `###### H6`
- Paragraphs & line breaks
- Bold: `**text**` or `__text__`
- Italic: `*text*` or `_text_`
- Strikethrough: `~~text~~`
- Inline code: `\`code\``
- Code blocks: triple backticks `\`\`\`` (language optional, but no highlighting)
- Block-quotes: `> quote`
- Links: `[text](url "title")`
- Images: `![alt](url "title")`
- Lists (unordered `- * +`, ordered `1.`, up to 3 levels nesting)
- Task lists: `- [x] / - [ ] / - [X]` → renders `<input type="checkbox" ...>`
- Tables: pipe-separated `| col |`, header separator `|---|`, alignment, spanning with `||` + empty cells
- Table captions: `[Caption]` line immediately before table
- Math: inline `$E=mc^2$`, block `$$ \int ... $$` → wrapped in `<span class="math-inline">` or similar
- Definition lists: `Term : Definition`
- Footnotes: `text[^1]` and `[^1]: Note text`
- Subscript/superscript: `H~2~O`, `x^2^`
- Custom quote style: `:"quoted text":`
- Escaped underscores: `\_not_italic\_`

No support for:

- HTML raw embedding (but regex won't block it)
- Fenced code with attributes beyond language
- Deep nested block elements in all edge cases
- Autolinks, hard line breaks in all contexts, etc.

## Extending with Custom Rules

Use `addRule` to add or override regex-based replacements.

```ts
import { render, addRule } from 'slimdown-js';

// Simple string replacement
addRule(/:\)/g, '<img src="/smiley.png" alt="smile" />');

// Replacement with function (capture groups)
addRule(/$$   \[(.*?)   $$\]/g, (match: string, p1: string) => {
  const slug = p1.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return `<a href="/wiki/${slug}">${p1}</a>`;
});

console.log(render('Smile :) and go to [[Home Page]]'));
```

Rules are applied in the order they are added — add custom rules before calling `render` if overriding built-in behavior.

## API Reference

- `render(markdown: string): string`
  Main function: converts Markdown string → HTML string
- `addRule(regexp: RegExp, replacement: string | ((...args: any[]) => string)): void`
  Adds a new parsing rule (applied sequentially)

No other public methods or global config options.

## Best Practices

- Call `addRule` early (before any `render` calls) if customizing
- Sanitize output with DOMPurify or similar if rendering user-generated Markdown (`slimdown-js` does not escape raw HTML)
- Use for previews, comments, docs — not production-critical rendering
- Test edge cases (nested lists, tables with spans, math inside code, etc.)
- Prefer `render` import over default import for tree-shaking

## Quick Reference Examples

```ts
// Math
render('Inline math $$   E=mc^2   $$ and block $$    \sum_{i=0}^n i    $$');

// Task list
render('- [x] Buy milk\n- [ ] Do homework');

// Table with caption and span
render(`[Q1 Results]
| Item | Value |  |
| ---- | ----- ||
| Total  | $500  ||`);

// Footnote
render('Fact[^1]\n\n[^1]: Source: 2025 report');
```

When helping with `slimdown-js`, stick to these documented features and patterns. For more complex Markdown needs, suggest migrating to `marked`, `markdown-it`, or `showndown`.
