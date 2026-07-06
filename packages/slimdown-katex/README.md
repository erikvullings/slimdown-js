# slimdown-katex

KaTeX rendering extension for `slimdown-js`.

## Installation

`katex` and `slimdown-js` are peer dependencies, so install them alongside this package:

```bash
npm install slimdown-js slimdown-katex katex
```

## Usage

```ts
import { render } from 'slimdown-js';
import { katexExtension } from 'slimdown-katex';

const html = render('Inline $E = mc^2$.', {
  extensions: [katexExtension()],
});
```

Install KaTeX CSS in your app as usual:

```ts
import 'katex/dist/katex.min.css';
```
