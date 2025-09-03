# slimdown-js

A basic regex-based Markdown parser based on the gist by [Johnny Broadway](https://gist.github.com/jbroadway/2836900), converted from PHP to TypeScript, extended with several additional elements (images, tables, code blocks, underscores) and published to `npm`.

Inspired by:

- [Landmark: the simplest Markdown engine for the browser](https://gist.github.com/plugnburn/f0d12e38b6416a77c098)
- [parse-md-js](https://github.com/Chalarangelo/parse-md-js/blob/master/parsemd.js)

Supports the following elements (and can be extended via `addRule(regexp: RegExp, replacement: string | Function)`):

- Headers: `# Header 1`, or `## Header 2`
- Images: `![ALT TEXT](https://my_image_source)`
- Links: `[ALT TEXT](https://my_image_source)`
- Bold: `**bold**` or `__bold__`
- Emphasis: `*italics*` or `_italics_`
- Deletions: `~~bold~~`
- Quotes: `This is a quote: :"my quote":`
- Inline code: `This is \`inline\` code`.
- Code blocks: Use three subsequent backticks \` to open and close a code block.
- Block quotes: Lines starting with `> <QUOTED_TEXT>`.
- Tables: Use pipes `|` to separate columns, and '-' to separate the table header from its body.
- Table captions: `[Caption Text]` before a table
- Table column spanning: Use `||` followed by empty cells to span columns
- Math expressions: Inline `$E = mc^2$` and block `$$\int_0^1 x dx$$`
- Task lists: `- [x] Completed` or `- [ ] Todo`
- Definition lists: `Term : Definition` (capitalized terms and definitions)
- Underscores (Escape underscores to keep them `\_`)
- Ordered/unordered lists (up to three levels deep, may be nested)
- Superscript and subscript (`z~1~` or `a^2^`)
- Footnotes, e.g. `footnote[^1]` and `[^1]: Footnote reference`.

## Size

The main reason for using this library, which hasn't been extensively tested and is not completely compatible with the spec, is to have something small. Version 1.0.0 with Phase 1 enhancements is approximately 2.8 kB compressed.

For more advanced scenario's, however, I can recommend [marked](https://github.com/markedjs/marked), albeit at a bigger size: marked.min.js is 23.372 bytes uncompressed, and 7.684 bytes using gzip.

## Installation

```bash
npm install slimdown-js
```

## Quick Start

### CommonJS (Node.js)

```javascript
const { render } = require('slimdown-js');

const html = render('# Hello World\n\nThis is **bold** text with $math$!');
console.log(html);
```

### ES Modules

```javascript
import { render } from 'slimdown-js';

const html = render('# Hello World\n\nThis is **bold** text with $math$!');
console.log(html);
```

### TypeScript

```typescript
import { render, addRule, RegexReplacer } from 'slimdown-js';

const html: string = render('# TypeScript Example');
```

### Browser (CDN)

```html
<script src="https://unpkg.com/slimdown-js/dist/slimdown.umd.js"></script>
<script>
  const html = SlimdownJs.render('# Browser Example');
</script>
```

For more examples, see [examples.md](./examples.md).

## Playground

Head over to [`flems.io` for a live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWArAOgMwBoQGd4EBjAF3imRA1PxD32ICcB7WWZAbQAYcAmAOzcAungBmEBHSSdQAOwCGYREmq16IYiznkdVCGAAOLJqQAEAKjML8Z-FDNjWYMwB0CsA1BYB3OQFoAK3x3AG5XOQitOXw2eAxYFgBzAAp7AEoIqO18czAHAF4zAAMIgGIzABUIUgQsuUqWMwBXQksLAGVPfN85CwscMySmBQAjMxrHZzNOOUMwYRSAC1JSQ3wkAHpNn12MObBgjC0wTcMFYgBrBST4Tfxu7z8g-HSzE0sxE0urUiX4MyGViBeBkd5yGYAcRqAAlmqNFis1httkkakt4ccWKd4EwIJcAG7NdgQORJfD3R69F7pDD1KwAeTk8AiVkqPhYrKqSyY8BZELM-jMADEWM0mBEzIKRRACfypREhZwAB7CMwAEW0-KVZjVHVIklgZlITW89Uq8FyZjAAE83K5igB9LRQeCO1wO+plCodeH-BRQepMgH9Ugc-rGnl89oWL7i-pWCRyumROTBsyOx1hliZyO8gGOuNMR2OWUFx34CDK3OEOUQx3wCBJFaOlMRACMGDMwYifC77M5ciw-aj-PKFUqYwQZngyqUhjqqc4k9G0-9rqYwgiAB8qlPLVLD4fdwBBXlHi9S3cAYRYbCvO-8T+fL9f26Qr8-T6Q28-P53ZhaEaWATLYF67nizakP4CieEkzIOLuAAk7YAGzcNwZjbgBQFmHwoGXruxDwDouIUIRh4ofh2FyLuABe8CjCMdikHihgHruCjnsyCjmOBR4oVh9QeqUnoOvkXoTvuM5zkYi4ASuUiXleZhngCynHmYt73kJtFfvp776a+P5-jRRH3iBEBgUeEFNisMFwQhWFmCh6GYWZgH3vhVkUcRpG8g4-FSlRun0YxzG5GxHHWNx8C8RRlHtrpWRiaJpSpt6FTqvAEhyDUEA5PUABySgAklSAajlpL5doZjthEJXKHhZgVdluU1RCfCSWYACScieMynmutYcgOF8LCkHIE2WvUACyJgAuQyrmD46L2sUpIDfAKRIS68CZA6djzggbZyAAfKpZiriwVxmAAjs000RBdFysPgtjZmYW34KdMJkQRCh2AYC4AuNk3TZwAB67bCF2ADqa2xE1AZQB1sHGrO5gKGI5BMBMpCnfN55LQTGCnVDMMVbNdq8mIZFyMRGDFOEqZgBgvKjbiKTeMQzTKDoGCjCwUA2oMYApAA5KjBIS2LNBMK0pBpFA7MkRuKT5OkWvpKEGiECQBo5FQaACEg3AgAAvqIIADZc0iyCAijKFQkB-HiHB4OKHCqEi6xbJszRzJcSRYqcrs8pIAACfZ9u2fCbOH7sYJAcgYMEGikDa7FUIwbGkJbODyKVOdUs86ee0w3sgL7KIB0HIcnJSXjUsEkedp23CbKjuRNz0fgYHzKvlyAmfZ6oucQIY+dWxbQA).

## Development

Use `npm start` to convert the TypeScript code to JavaScript and `npm test` to run the test watcher. It uses `microbundle` to compile the final code to different output formats.

## Usage

Here is the general use case:

```ts
import { render } from 'slimdown-js';

console.log(
  render('# Page title\n\nAnd **now** for something _completely_ different.',),
);
```

### Adding rules

A simple rule to convert `:)` to an image:

```ts
import { render, addRule } from 'slimdown-js';

addRule ('/(\W)\:\)(\W)/', '$1<img src="smiley.png" />$2');

console.log(render(('Know what I\'m sayin? :)'));
```

In this example, we add GitHub-style internal linking
(e.g., `[[Another Page]]`).

```ts
import { render, addRule } from 'slimdown-js';

const mywiki_internal_link = (title: string) =>
  `<a href="${title.replace(/[^a-zA-Z0-9_-]+/g, '_')}">${title}</a>`;

addRule('/[[(.*?)]]/e', mywiki_internal_link('$1'));

console.log(render('Check [[This Page]] out!'));
```

### A longer example

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

More text with `inline($code)` sample.

> A block quote
> across two lines.

More text...`));
```

### Math Support

```ts
import { render } from 'slimdown-js';

// Inline math
console.log(render('Einstein discovered $E = mc^2$ in 1905.'));
// Output: <p>Einstein discovered <span class="math-inline">E = mc^2</span> in 1905.</p>

// Block math
console.log(render(`The Gaussian integral:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

is fundamental in mathematics.`));
```

#### Task Lists

```ts
import { render } from 'slimdown-js';

console.log(render(`- [x] Learn markdown
- [ ] Practice LaTeX
- [X] Write documentation`));
// Output: <ul>
//   <li><input type="checkbox" checked disabled> Learn markdown</li>
//   <li><input type="checkbox" disabled> Practice LaTeX</li>
//   <li><input type="checkbox" checked disabled> Write documentation</li>
// </ul>
```

### Enhanced Tables

```ts
import { render } from 'slimdown-js';

// Table with caption and column spanning
console.log(render(`[Sales Data 2024]
| Product | Q1 Sales |       |      | Q2 |
| ------- | -------- | ----- |
| Widget  | $1000    | $1200 |
| Gadget  | $800     | $900  | `)); |
// Creates table with caption and Q1 Sales spanning multiple columns
```

### Definition Lists

```ts
import { render } from 'slimdown-js';

console.log(render(`Technology : Computer and software tools
Science : Study of the natural world`));
// Output: 
// <dl><dt>Technology</dt><dd>Computer and software tools</dd></dl>
// <dl><dt>Science</dt><dd>Study of the natural world</dd></dl>
```
