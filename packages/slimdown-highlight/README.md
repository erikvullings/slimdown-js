# slimdown-highlight

highlight.js fenced-code-block extension for `slimdown-js`.

## Installation

`highlight.js` and `slimdown-js` are peer dependencies, so install them alongside this package:

```bash
npm install slimdown-js slimdown-highlight highlight.js
```

## Usage

````ts
import { render } from 'slimdown-js';
import { highlightExtension } from 'slimdown-highlight';

const markdown = [
  '```ts',
  'const value = 1;',
  '```',
].join('\n');

const html = render(markdown, {
  extensions: [highlightExtension()],
});
````

Install a highlight.js theme in your app as usual:

```ts
import 'highlight.js/styles/github.css';
```
