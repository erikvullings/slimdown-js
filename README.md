# slimdown-js

[![npm](https://img.shields.io/npm/v/slimdown-js)](https://www.npmjs.com/package/slimdown-js)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/slimdown-js)](https://bundlephobia.com/package/slimdown-js)

slimdown-js is a lightweight, dependency-free, regex-based Markdown-to-HTML parser written in TypeScript.

It is designed for practical Markdown snippets: notes, blog posts, comments, previews, documentation fragments, and LLM-generated responses where a small package and predictable rules matter more than strict CommonMark or GitHub Flavored Markdown compliance.

```ts
import { render } from 'slimdown-js';

const html = render('# Hello World\n\nThis is **bold** text with $math$!');
```

## When To Use It

Use slimdown-js when you want:

- A tiny Markdown renderer with no runtime dependencies
- A parser that works in Node.js, browsers, and edge-style runtimes
- TypeScript types out of the box
- Common Markdown features such as headings, emphasis, links, lists, tables, code, math, task lists, footnotes, and definition lists
- Simple custom syntax via `addRule(regex, replacement)`
- Optional renderer extensions for KaTeX, Mermaid, and syntax-highlighted code blocks
- A practical renderer for trusted or already-sanitized Markdown snippets

For strict CommonMark/GFM compatibility, large documents, or full Markdown extension ecosystems, use a spec-oriented parser such as [marked](https://github.com/markedjs/marked), [markdown-it](https://github.com/markdown-it/markdown-it), or [micromark](https://github.com/micromark/micromark).

## Installation

```bash
npm install slimdown-js
```

## Quick Start

### ES Modules

```ts
import { render } from 'slimdown-js';

const html = render('# Hello World\n\nThis is **bold** text with $math$!');
console.log(html);
```

### CommonJS

```js
const { render } = require('slimdown-js');

const html = render('# Hello World\n\nThis is **bold** text with $math$!');
console.log(html);
```

### Browser

```html
<script src="https://unpkg.com/slimdown-js/dist/slimdown.umd.js"></script>
<script>
  const html = window.slimdownJs.render('# Browser Example');
</script>
```

```html
<script type="module">
  import { render } from 'https://esm.sh/slimdown-js';

  document.body.innerHTML = render('# Hello from ESM!');
</script>
```

For more examples, see [examples.md](./examples.md).

## Supported Markdown

slimdown-js supports a pragmatic Markdown subset plus a few useful extensions:

- Text: headings, paragraphs, blockquotes, hard line breaks
- Inline formatting: bold, emphasis, strikethrough, quotes, superscript, subscript
- Links and media: inline links, images, autolinks
- Code: inline code, fenced code blocks, optional language classes
- Lists: unordered lists, numeric ordered lists, task lists, nested lists
- Optional alpha ordered lists: `a.`, `A)`, `(b)` with `render(markdown, { alphaLists: true })`
- Tables: pipe tables, table captions, simple column spanning
- Academic and note-taking syntax: inline math, block math, footnotes, definition lists
- Escaped underscores

Because parsing is regex-based, the goal is useful, predictable coverage rather than full Markdown specification compatibility.

## Compatibility And Security

slimdown-js is not a sanitizer. If you render untrusted Markdown into a web page, sanitize the generated HTML with a tool such as [DOMPurify](https://github.com/cure53/DOMPurify).

The test suite covers the supported behavior in this package, including list continuation and optional alpha lists. It does not currently claim to pass the full CommonMark or GitHub Flavored Markdown test suites.

## API Reference

### `render(markdown, options?)`

| Parameter                  | Type      | Default | Description |
| -------------------------- | --------- | ------- | ----------- |
| `markdown`                 | `string`  | n/a     | The Markdown text to render |
| `options.removeParagraphs` | `boolean` | `false` | Strip the `<p>` wrapper from top-level paragraphs |
| `options.externalLinks`    | `boolean` | `false` | Add `target="_blank"` to links |
| `options.alphaLists`       | `boolean` | `false` | Parse alpha ordered-list markers such as `a.`, `A)`, and `(b)` when at least two sequential markers appear in the same list run |
| `options.extensions`       | `SlimdownExtension[]` | `[]` | Optional render hooks for fenced code blocks, inline math, and block math |

The legacy positional form `render(markdown, removeParagraphs?, externalLinks?)` is also supported for backwards compatibility.

### Optional Extensions

The core package remains dependency-free. Heavier rendering features live in sibling packages that plug into the `extensions` option:

```bash
npm install slimdown-js slimdown-katex katex
npm install slimdown-js slimdown-mermaid mermaid
npm install slimdown-js slimdown-highlight highlight.js
```

```ts
import { render } from 'slimdown-js';
import { katexExtension } from 'slimdown-katex';
import { mermaidExtension } from 'slimdown-mermaid';
import { highlightExtension } from 'slimdown-highlight';

const html = render(markdown, {
  extensions: [
    katexExtension(),
    mermaidExtension(),
    highlightExtension(),
  ],
});
```

Extensions are tried in order. If an extension does not handle a code block or math expression, slimdown-js falls back to its built-in escaped HTML output.

```ts
import type { SlimdownExtension } from 'slimdown-js';

const customCodeBlocks: SlimdownExtension = {
  renderCodeBlock: ({ lang, code, escapeHtml }) => {
    if (lang !== 'demo') return undefined;
    return `<figure data-lang="demo">${escapeHtml(code)}</figure>`;
  },
};
```

### `addRule(regex, replacement)`

Adds a custom parsing rule. Rules are applied during the pre-paragraph phase.

```ts
import { addRule, render } from 'slimdown-js';

addRule(/(^|\W):\)(?=\W|$)/g, '$1<img src="smiley.png" alt=":)" />');

console.log(render("Know what I'm sayin? :)"));
```

Function replacements are supported too:

```ts
import { addRule, render } from 'slimdown-js';

addRule(/\[\[(.*?)\]\]/g, (_match: string, title: string) => {
  const slug = title.replace(/[^a-zA-Z0-9_-]+/g, '_');
  return `<a href="${slug}">${title}</a>`;
});

console.log(render('Check [[This Page]] out!'));
```

## Usage Examples

### Alpha Ordered Lists

Alpha ordered lists are disabled by default to avoid accidentally parsing names or short labels such as `A. Smith`. Enable them per render call with `alphaLists: true`.

```ts
import { render } from 'slimdown-js';

const html = render(
  `A. first item
    1. first sub item
    2. second sub item
B. second item`,
  { alphaLists: true },
);
```

Alpha lists are only parsed when at least two sequential alpha markers are found in the same list run, such as `A.` followed by `B.`, `a)` followed by `b)`, or `(b)` followed by `(c)`. Deeper-indented nested list items may appear between the alpha markers.

### Longer Markdown

```ts
import { render } from 'slimdown-js';

console.log(render(`# A longer example

And *now* [a link](http://www.google.com) to **follow** and [another](http://yahoo.com/).

* One
* Two
* Three

## Subhead

One **two** three **four** five.

One __two__ three _four_ five __six__ seven _eight_.

1. One
2. Two
3. Three

More text with \`inline($code)\` sample.

> A block quote
> across two lines.

More text...`));
```

### Math

```ts
import { render } from 'slimdown-js';

console.log(render('Einstein discovered $E = mc^2$ in 1905.'));
// <p>Einstein discovered <span class="math-inline">E = mc^2</span> in 1905.</p>

console.log(render(`The Gaussian integral:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

is fundamental in mathematics.`));
```

### Task Lists

```ts
import { render } from 'slimdown-js';

console.log(render(`- [x] Learn markdown
- [ ] Practice LaTeX
- [X] Write documentation`));
// <ul>
//   <li><input type="checkbox" checked disabled> Learn markdown</li>
//   <li><input type="checkbox" disabled> Practice LaTeX</li>
//   <li><input type="checkbox" checked disabled> Write documentation</li>
// </ul>
```

### Tables

```ts
import { render } from 'slimdown-js';

console.log(render(`[Sales Data 2024]
| Product | Q1 Sales |       |      | Q2 |
| ------- | -------- | ----- |
| Widget  | $1000    | $1200 |
| Gadget  | $800     | $900  |
`));
```

### Definition Lists

```ts
import { render } from 'slimdown-js';

console.log(render(`Technology : Computer and software tools
Science : Study of the natural world`));
// <dl><dt>Technology</dt><dd>Computer and software tools</dd></dl>
// <dl><dt>Science</dt><dd>Study of the natural world</dd></dl>
```

## Playground

Try slimdown-js in the browser with the [live Flems example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWArAOgMwBoQGd4EBjAF3imRA1PxD32ICcB7WWZAbQAYcAmAOzcAungBmEBHSSdQAOwCGYREmq16IYiznkdVCGAAOLJqQAEAKjML8Z-FDNjWYMwB0CsA1BYB3OQFoAK3x3AG5XOQitOXw2eAxYFgBzAAp7AEoIqO18czAHAF4zAAMIgGIzABUIUgQsuUqWMwBXQksLAGVPfN85CwscMySmBQAjMxrHZzNOOUMwYRSAC1JSQ3wkAHpNn12MObBgjC0wTcMFYgBrBST4Tfxu7z8g-HSzE0sxE0urUiX4MyGViBeBkd5yGYAcRqAAlmqNFis1httkkakt4ccWKd4EwIJcAG7NdgQORJfD3R69F7pDD1KwAeTk8AiVkqPhYrKqSyY8BZELM-jMADEWM0mBEzIKRRACfypREhZwAB7CMwAEW0-KVZjVHVIklgZlITW89Uq8FyZjAAE83K5igB9LRQeCO1wO+plCodeH-BRQepMgH9Ugc-rGnl89oWL7i-pWCRyumROTBsyOx1hliZyO8gGOuNMR2OWUFx34CDK3OEOUQx3wCBJFaOlMRACMGDMwYifC77M5ciw-aj-PKFUqYwQZngyqUhjqqc4k9G0-9rqYwgiAB8qlPLVLD4fdwBBXlHi9S3cAYRYbCvO-8T+fL9f26Qr8-T6Q28-P53ZhaEaWATLYF67nizakP4CieEkzIOLuAAk7YAGzcNwZjbgBQFmHwoGXruxDwDouIUIRh4ofh2FyLuABe8CjCMdikHihgHruCjnsyCjmOBR4oVh9QeqUnoOvkXoTvuM5zkYi4ASuUiXleZhngCynHmYt73kJtFfvp776a+P5-jRRH3iBEBgUeEFNisMFwQhWFmCh6GYWZgH3vhVkUcRpG8g4-FSlRun0YxzG5GxHHWNx8C8RRlHtrpWRiaJpSpt6FTqvAEhyDUEA5PUABySgAklSAajlpL5doZjthEJXKHhZgVdluU1RCfCSWYACScieMynmutYcgOF8LCkHIE2WvUACyJgAuQyrmD46L2sUpIDfAKRIS68CZA6djzggbZyAAfKpZiriwVxmAAjs000RBdFysPgtjZmYW34KdMJkQRCh2AYC4AuNk3TZwAB67bCF2ADqa2xE1AZQB1sHGrO5gKGI5BMBMpCnfN55LQTGCnVDMMVbNdq8mIZFyMRGDFOEqZgBgvKjbiKTeMQzTKDoGCjCwUA2oMYApAA5KjBIS2LNBMK0pBpFA7MkRuKT5OkWvpKEGiECQBo5FQaACEg3AgAAvqIIADZc0iyCAijKFQkB-HiHB4OKHCqEi6xbJszRzJcSRYqcrs8pIAACfZ9u2fCbOH7sYJAcgYMEGikDa7FUIwbGkJbODyKVOdUs86ee0w3sgL7KIB0HIcnJSXjUsEkedp23CbKjuRNz0fgYHzKvlyAmfZ6oucQIY+dWxbQA).

## Development

```bash
npm test
npm run build
```

`npm test` runs the AVA test suite. `npm run build` uses `tsup` and TypeScript to generate CommonJS, ESM, UMD, and declaration files.

## Credits

slimdown-js started as a TypeScript port of the [Johnny Broadway Slimdown gist](https://gist.github.com/jbroadway/2836900) and was also inspired by:

- [Landmark: the simplest Markdown engine for the browser](https://gist.github.com/plugnburn/f0d12e38b6416a77c098)
- [parse-md-js](https://github.com/Chalarangelo/parse-md-js/blob/master/parsemd.js)
