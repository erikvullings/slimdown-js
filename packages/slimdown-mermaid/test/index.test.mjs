import assert from 'node:assert/strict';
import { render } from '../../../dist/index.js';
import { mermaidExtension } from '../dist/index.mjs';

const html = render(
  `\`\`\`mermaid
graph TD
  A --> B
\`\`\``,
  { extensions: [mermaidExtension()] },
);

assert.equal(
  html,
  '<div class="mermaid">graph TD\n  A --&gt; B</div>',
);
