# slimdown-mermaid

Mermaid fenced-code-block extension for `slimdown-js`.

## Installation

`slimdown-js` is a peer dependency. `mermaid` is an optional peer dependency because this extension only emits Mermaid-compatible HTML; install Mermaid in apps that render the diagrams in the browser.

```bash
npm install slimdown-js slimdown-mermaid mermaid
```

## Usage

````ts
import { render } from 'slimdown-js';
import { mermaidExtension } from 'slimdown-mermaid';

const markdown = [
  '```mermaid',
  'graph TD',
  '  A --> B',
  '```',
].join('\n');

const html = render(markdown, {
  extensions: [mermaidExtension()],
});
````

The extension outputs `<div class="mermaid">...</div>`. Initialize Mermaid in your browser app separately.
