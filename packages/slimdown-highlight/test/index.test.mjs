import assert from 'node:assert/strict';
import { render } from '../../../dist/index.js';
import { highlightExtension } from '../dist/index.mjs';

const html = render(
  `\`\`\`ts
const value = 1;
\`\`\``,
  { extensions: [highlightExtension()] },
);

assert.match(html, /class="hljs language-ts"/);
assert.match(html, /hljs-keyword/);
