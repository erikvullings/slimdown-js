import assert from 'node:assert/strict';
import { render } from '../../../dist/index.js';
import { katexExtension } from '../dist/index.mjs';

const html = render('Inline $E = mc^2$.', {
  extensions: [katexExtension()],
});

assert.match(html, /class="katex"/);
assert.match(html, /mord mathnormal/);
