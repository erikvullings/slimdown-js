import { render } from './index.js';
import test from 'ava';

const removeWhitespaces = (txt: string) => txt.replace(/\s+/g, '');

test('header', (t) => {
  const expected = '<h1>Hello world</h1>';
  const html = render('# Hello world');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('single underscore', (t) => {
  const expected = '<p>Hello_world</p>';
  const html = render('Hello_world');
  const html2 = render('Hello\\_world');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
  t.is(removeWhitespaces(html2), removeWhitespaces(expected));
});

test('double underscores', (t) => {
  const expected = '<p>here_a_test</p>';
  const html = render('here\\_a\\_test');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('italics', (t) => {
  const expected = '<p>This is <em>italics</em>.</p>';
  const html = render('This is _italics_.');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('superscript', (t) => {
  const expected =
    '<p>This is the 1<sup>st</sup> test, and this is the 2<sup>nd</sup> version. But also consider a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>.</p>';
  const html = render(
    'This is the 1^st^ test, and this is the 2^nd^ version. But also consider a^2^ + b^2^ = c^2^.',
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('subscript', (t) => {
  const expected =
    '<p>This is <em>italics</em> and this is a<sub>1</sub> or C<sub>2</sub>.</p>';
  const html = render('This is _italics_ and this is a~1~ or C~2~.');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('footnote', (t) => {
  const expected = `<p>
Here is a simple footnote<sup id="fnref:1"><a href="#fn:1">[1]</a></sup>. With some additional text after it.
</p>
<div class="footnotes">
  <hr>
  <ol>

    <li id="fn:1">
      My reference.
      <sup><a href="#fnref:1">↩</a></sup>
    </li>
  </ol>
</div>`;
  const html = render(
    `Here is a simple footnote[^1]. With some additional text after it.

    [^1]: My reference.`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('code', (t) => {
  const expected =
    '<p>This is <code>italics</code> and this is <code>_italics_</code> too.</p>';
  const html = render('This is `italics` and this is `_italics_` too.');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('multiline codeblock', (t) => {
  const expected = `<pre>## Table example

| Tables        | Are           | Cool  |
|---------------|:-------------:|------:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |</pre>`;
  const html = render(`
\`\`\`md

## Table example

| Tables        | Are           | Cool  |
|---------------|:-------------:|------:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

\`\`\`
`);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('ul', (t) => {
  const expected = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
  const html = render(`- Item 1\n- Item 2\n- Item 3`);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('ul using +', (t) => {
  const expected = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
  const html = render(`+ Item 1\n+ Item 2\n+ Item 3`);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('ul using *', (t) => {
  const expected = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
  const html = render(`* Item 1\n* Item 2\n* Item 3`);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested ul + ul', (t) => {
  const expected =
    '<ul><li>Item 1<ul><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ul></li><li>Item 2</li><li>Item 3</li></ul>';
  const html = render(
    `- Item 1\n  - Item 1.1\n  - Item 1.2\n  - Item 1.3\n- Item 2\n- Item 3`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested ul + ol', (t) => {
  const expected =
    '<ul><li>Item 1<ol><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ol></li><li>Item 2</li><li>Item 3</li></ul>';
  const html = render(
    `- Item 1\n  1. Item 1.1\n  2. Item 1.2\n  3. Item 1.3\n- Item 2\n- Item 3`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('ol', (t) => {
  const expected = '<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>';
  const html = render(`1. Item 1\n2. Item 2\n3. Item 3`);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested ol + ol', (t) => {
  const expected =
    '<ol><li>Item 1<ol><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ol></li><li>Item 2</li><li>Item 3</li></ol>';
  const html = render(
    `1. Item 1\n  1. Item 1.1\n  2. Item 1.2\n  3. Item 1.3\n2. Item 2\n3. Item 3`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested ol + ul', (t) => {
  const expected =
    '<ol><li>Item 1<ul><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ul></li><li>Item 2</li><li>Item 3</li></ol>';
  const html = render(
    `1. Item 1\n  - Item 1.1\n  - Item 1.2\n  - Item 1.3\n2. Item 2\n3. Item 3`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('table 1', (t) => {
  const table = `
  | Threat \\ Context | rainy      | sunny      |
  |------------------|------------|------------|
  | terrorist        | scenario 1 | scenario 2 |
  | criminal         | scenario 3 | scenario 4 |
  `;
  const expected = `<table>
<tbody>
  <tr><th>Threat \\ Context</th><th>rainy</th><th>sunny</th></tr>
  <tr><td>terrorist</td><td>scenario 1</td><td>scenario 2</td></tr>
  <tr><td>criminal</td><td>scenario 3</td><td>scenario 4</td></tr>
</tbody>
</table>`;
  const html = render(table);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('table 2', (t) => {
  const table = `
  | Threat \\ Context | rainy      | sunny      |
  | ---------------- | ---------- | ---------- |
  | terrorist        | scenario 1 | scenario 2 |
  | criminal         | scenario 3 | scenario 4 |
  `;
  const expected = `<table>
<tbody>
  <tr><th>Threat \\ Context</th><th>rainy</th><th>sunny</th></tr>
  <tr><td>terrorist</td><td>scenario 1</td><td>scenario 2</td></tr>
  <tr><td>criminal</td><td>scenario 3</td><td>scenario 4</td></tr>
</tbody>
</table>`;
  const html = render(table);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing strong in own paragraph', (t) => {
  const md = `An **indie electronica music** bundle.

  **Featuring** songs by ...

  Pay what you want for Music`;
  const generated = render(md);
  const expected = `<p>
An <strong>indie electronica music</strong> bundle.
</p>

<p>
<strong>Featuring</strong> songs by ...
</p>

<p>
Pay what you want for Music
</p>`;
  t.is(generated, expected);
});

test('parsing longer text', (t) => {
  const md = `# Title

To use **Slimdown**, grap it from [npm](https://www.npmjs.com/package/slimdown-js) or *fork* the project on [GitHub](https://github.com/erikvullings/slimdown-js).

* One
* Two
* Three

## Underscores

my\\_var\\_is

## Subhead

One **two** three **four** five.

One __two__ three _four_ five __six__ seven _eight_.

1. One
2. Two
3. Three

More text with \`inline($code);\` sample.

> A block quote
> across two lines.

More text...`;
  const expected = `<h1>Title</h1>

<p>
To use <strong>Slimdown</strong>, grap it from <a href="https://www.npmjs.com/package/slimdown-js">npm</a> or <em>fork</em> the project on <a href="https://github.com/erikvullings/slimdown-js">GitHub</a>.
</p>
<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>

<h2>Underscores</h2>

<p>my_var_is</p>

<h2>Subhead</h2>

<p>
One <strong>two</strong> three <strong>four</strong> five.
</p>

<p>
One <strong>two</strong> three <em>four</em> five <strong>six</strong> seven <em>eight</em>.
</p>
<ol>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ol>

<p>
More text with <code>inline($code);</code> sample.
</p>

<blockquote>A block quote<br>
across two lines.</blockquote>

<p>
More text...
</p>`;
  const html = render(md);

  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing links with underscores', (t) => {
  const md = `# Links fail with underscores

  [Test Link](http://www.google.com/?some_param=another_value)`;
  const expected = `<h1>Links fail with underscores</h1>
  <p><a href="http://www.google.com/?some_param=another_value">Test Link</a></p>`;
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing images', (t) => {
  const md = `NS logo image: ![ns logo](https://www.ns.nl/static/generic/2.49.1/images/nslogo.svg)`;
  const expected = `<p>NS logo image: <img src="https://www.ns.nl/static/generic/2.49.1/images/nslogo.svg" alt="ns logo"></p>`;
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing code blocks', (t) => {
  const md = `# Code example
\`\`\`
Tab indented
codeblock
\`\`\`
`;
  const expected = `<h1>Code example</h1><pre>Tab indented codeblock</pre>`;
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing inline code', (t) => {
  const md = `This is \`inline A & B\` code.`;
  const expected = `This is <code>inline A &amp; B</code> code.`;
  const html = render(md, true);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing inline HTML code', (t) => {
  const md = `This is \`<p>An HTML paragrahp</p>\` code.`;
  const expected = `This is <code>&lt;p&gt;An HTML paragrahp&lt;/p&gt;</code> code.`;
  const html = render(md, true);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('bypassing HTML code', (t) => {
  const md = `<span>An HTML paragrahp</span>`;
  const expected = `<span>An HTML paragrahp</span>`;
  const html = render(md, true);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing tables', (t) => {
  const md = `# Table example

| Tables        | Are           | Cool  |
|---------------|:-------------:|------:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
`;
  const expected = `<h1>Table example</h1>
    <table>
      <tbody>
        <tr>
          <th>Tables</th>
          <th align="center">Are</th>
          <th align="right">Cool</th>
        </tr>
        <tr>
          <td>col 3 is</td>
          <td align="center">right-aligned</td>
          <td align="right">$1600</td>
        </tr>
        <tr>
          <td>col 2 is</td>
          <td align="center">centered</td>
          <td align="right">$12</td>
        </tr>
        <tr>
          <td>zebra stripes</td>
          <td align="center">are neat</td>
          <td align="right">$1</td>
        </tr>
      </tbody>
    </table>`;
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('removing paragraphs', (t) => {
  const expected = 'Hello world';
  const html = render('Hello world', true);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('do not remove paragraphs for longer text', (t) => {
  const expected = `<h1>Hello world</h1><p>How are you?</p>`;
  const html = render(
    `# Hello world

How are you?`,
    true,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('creating links', (t) => {
  const md = 'This is a [link](https://www.google.com).';
  const expected = 'This is a <a href="https://www.google.com">link</a>.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating external links', (t) => {
  const md = 'This is a [link](https://www.google.com).';
  const expected =
    'This is a <a target="_blank" href="https://www.google.com">link</a>.';
  const html = render(md, true, true);
  t.is(html.trim(), expected);
});

test('creating links with underscores', (t) => {
  const md = 'This is a [link](https://my_test_page.com).';
  const expected = 'This is a <a href="https://my_test_page.com">link</a>.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating emphasized text', (t) => {
  const md = 'This is _emphasized_ text.';
  const expected = 'This is <em>emphasized</em> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating emphasized text 2', (t) => {
  const md = 'This is *emphasized* text.';
  const expected = 'This is <em>emphasized</em> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating strong text', (t) => {
  const md = 'This is **strong** text.';
  const expected = 'This is <strong>strong</strong> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating strong text 2', (t) => {
  const md = 'This is __strong__ text.';
  const expected = 'This is <strong>strong</strong> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating strong and empasized text', (t) => {
  const md = 'This is ***strong and emphasized*** text.';
  const expected =
    'This is <strong><em>strong and emphasized</em></strong> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating strong and empasized text 2', (t) => {
  const md = 'This is ___strong and emphasized___ text.';
  const expected =
    'This is <strong><em>strong and emphasized</em></strong> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating deleted text', (t) => {
  const md = 'This is ~~deleted~~ text.';
  const expected = 'This is <del>deleted</del> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating quotes', (t) => {
  const md = 'This is a quote: :"quoted": text.';
  const expected = 'This is a quote: <q>quoted</q> text.';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('creating block quotes', (t) => {
  const md = '> This is a blockquoted text.';
  const expected = '<blockquote>This is a blockquoted text.</blockquote>';
  const html = render(md, true);
  t.is(html.trim(), expected);
});

test('complex nested ol with ul - continuous numbered list', (t) => {
  const md = `1. First item
   - Nested bullet 1
   - Nested bullet 2
2. Second item
   - Another nested bullet
3. Third item`;

  const expected = `<ol>
  <li>First item
    <ul>
      <li>Nested bullet 1</li>
      <li>Nested bullet 2</li>
    </ul>
  </li>
  <li>Second item
    <ul>
      <li>Another nested bullet</li>
    </ul>
  </li>
  <li>Third item</li>
</ol>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('complex nested ul with ol - continuous bullet list', (t) => {
  const md = `- First item
  1. Nested number 1
  2. Nested number 2
- Second item
  1. Another nested number
- Third item`;

  const expected = `<ul>
  <li>First item
    <ol>
      <li>Nested number 1</li>
      <li>Nested number 2</li>
    </ol>
  </li>
  <li>Second item
    <ol>
      <li>Another nested number</li>
    </ol>
  </li>
  <li>Third item</li>
</ul>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('triple nested lists', (t) => {
  const md = `1. Level 1 item 1
   - Level 2 item 1
     1. Level 3 item 1
     2. Level 3 item 2
   - Level 2 item 2
2. Level 1 item 2`;

  const expected = `<ol>
  <li>Level 1 item 1
    <ul>
      <li>Level 2 item 1
        <ol>
          <li>Level 3 item 1</li>
          <li>Level 3 item 2</li>
        </ol>
      </li>
      <li>Level 2 item 2</li>
    </ul>
  </li>
  <li>Level 1 item 2</li>
</ol>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('real world complex nested list', (t) => {
  const md = `1. **First Section:**
   - **Subsection A:** Description A
   - **Subsection B:** Description B

2. **Second Section:**
   - **Subsection C:** Description C
   - **Subsection D:** Description D`;

  const expected = `<ol>
  <li><strong>First Section:</strong>
    <ul>
      <li><strong>Subsection A:</strong> Description A</li>
      <li><strong>Subsection B:</strong> Description B</li>
    </ul>
  </li>
  <li><strong>Second Section:</strong>
    <ul>
      <li><strong>Subsection C:</strong> Description C</li>
      <li><strong>Subsection D:</strong> Description D</li>
    </ul>
  </li>
</ol>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

// Phase 1 feature tests

test('inline math support', (t) => {
  const md = 'The equation $E = mc^2$ is famous.';
  const expected =
    '<p>The equation <span class="math-inline">E = mc^2</span> is famous.</p>';
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('block math support', (t) => {
  const md = `Here's a block equation:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

That's Gaussian integral.`;

  const expected = `<p>Here's a block equation:</p>
<div class="math-block">\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}</div>
<p>That's Gaussian integral.</p>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('task list with checked items', (t) => {
  const md = `- [x] Completed task
- [ ] Incomplete task
- [X] Another completed task`;

  const expected = `<ul>
  <li><input type="checkbox" checked disabled> Completed task</li>
  <li><input type="checkbox" disabled> Incomplete task</li>
  <li><input type="checkbox" checked disabled> Another completed task</li>
</ul>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested task lists', (t) => {
  const md = `- [x] Main task
  - [ ] Subtask 1
  - [x] Subtask 2
- [ ] Another main task`;

  const expected = `<ul>
  <li><input type="checkbox" checked disabled> Main task
    <ul>
      <li><input type="checkbox" disabled> Subtask 1</li>
      <li><input type="checkbox" checked disabled> Subtask 2</li>
    </ul>
  </li>
  <li><input type="checkbox" disabled> Another main task</li>
</ul>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('definition lists', (t) => {
  const md = `Technology : Computer science field
Science : Study of natural world`;

  const expected = `<p>
<dl><dt>Technology</dt><dd>Computer science field</dd></dl>
</p>
<p>
<dl><dt>Science</dt><dd>Study of natural world</dd></dl>
</p>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('no definition lists for regular colons', (t) => {
  const md = `Technology: Computer science field

Science: Study of natural world`;

  const expected = `<p>
Technology: Computer science field
</p>
<p>
Science:Study of natural world
</p>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('no definition lists for math', (t) => {
  const md = `$15 : 3 = 5$`;

  const expected = `<p><span class="math-inline">15 : 3 = 5</span></p>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('table with empty cells not merged', (t) => {
  const md = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Value    |          | End      |
|          | Middle   |          |`;

  const expected = `<table><tbody>
<tr>
  <th>Header 1</th>
  <th>Header 2</th>
  <th>Header 3</th>
</tr>
<tr>
  <td>Value</td>
  <td></td>
  <td>End</td>
</tr>
<tr>
  <td></td>
  <td>Middle</td>
  <td></td>
</tr>
</tbody></table>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('table with column spanning', (t) => {
  const md = `| Header 1 | Header 2|| | Header 3 |
|----------|----------|----------|
| Cell 1   | Spanning|| | Cell     |
| Normal   | Cell     | Cell     |`;

  const expected = `<table><tbody>
<tr>
  <th>Header 1</th>
  <th colspan="3">Header 2</th>
  <th>Header 3</th>
</tr>
<tr>
  <td>Cell 1</td>
  <td colspan="3">Spanning</td>
  <td>Cell</td>
</tr>
<tr>
  <td>Normal</td>
  <td>Cell</td>
  <td>Cell</td>
</tr>
</tbody></table>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('table with caption', (t) => {
  const md = `[Table Caption]
| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |`;

  const expected = `<table><caption>Table Caption</caption><tbody>
<tr><th>Name</th><th>Age</th></tr>
<tr><td>John</td><td>25</td></tr>
<tr><td>Jane</td><td>30</td></tr>
</tbody></table>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('math expressions with special characters', (t) => {
  const md = `Complex math: $\\sum_{i=1}^{n} x_i < \\infty$ and block math:

$$
f(x) = \\begin{cases}
x^2 & \\text{if } x \\geq 0 \\\\
-x^2 & \\text{if } x < 0
\\end{cases}
$$`;

  const expected = `<p>Complex math: <span class="math-inline">\\sum_{i=1}^{n} x_i &lt; \\infty</span> and block math:</p>
<div class="math-block">f(x) = \\begin{cases}
x^2 &amp; \\text{if } x \\geq 0 \\\\
-x^2 &amp; \\text{if } x &lt; 0
\\end{cases}</div>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('mixed content with all Phase 1 features', (t) => {
  const md = `# Math and Tasks

Here's some inline math $a^2 + b^2 = c^2$ and a task list:

- [x] Learn math
- [ ] Practice LaTeX: $\\int_0^1 x dx = \\frac{1}{2}$

Technology : Computer science field
Science : Study of natural world

[Data Table]
| Name | Score|| | Total |
|------|------|------|
| Test | 85   | 95   |`;

  const expected = `<h1>Math and Tasks</h1>
<p>Here's some inline math <span class="math-inline">a^2 + b^2 = c^2</span> and a task list:</p>
<ul>
  <li><input type="checkbox" checked disabled> Learn math</li>
  <li><input type="checkbox" disabled> Practice LaTeX: <span class="math-inline">\\int_0^1 x dx = \\frac{1}{2}</span></li>
</ul>
<p>
<dl><dt>Technology</dt><dd>Computer science field</dd></dl>
</p>
<p>
<dl><dt>Science</dt><dd>Study of natural world</dd></dl>
</p>
<table><caption>Data Table</caption><tbody>
<tr><th>Name</th><th colspan="3">Score</th><th>Total</th></tr>
<tr><td>Test</td><td>85</td><td>95</td></tr>
</tbody></table>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('decimal numbers should not be converted to ordered lists', (t) => {
  const md = '100.000-1.000.000';
  const expected = '<p>100.000-1.000.000</p>';
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('mix of decimal numbers and actual ordered list', (t) => {
  const md = `100.000-1.000.000

1. This is a real list item
2. This is another real list item

Price range: 50.99-99.99`;

  const expected = `<p>100.000-1.000.000</p>
<ol>
  <li>This is a real list item</li>
  <li>This is another real list item</li>
</ol>
<p>Price range: 50.99-99.99</p>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('horizontal rule with three dashes', (t) => {
  const expected = '<p>before</p>\n<hr />\n<p>after</p>';
  const html = render('before\n\n---\n\nafter');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('horizontal rule variations', (t) => {
  const expected1 = '<p>text</p>\n<hr />\n<p>more</p>';
  const html1 = render('text\n\n---\n\nmore');
  t.is(removeWhitespaces(html1), removeWhitespaces(expected1));

  const expected2 = '<p>text</p>\n<hr />\n<p>more</p>';
  const html2 = render('text\n\n----\n\nmore');
  t.is(removeWhitespaces(html2), removeWhitespaces(expected2));

  const expected3 = '<p>text</p>\n<hr />\n<p>more</p>';
  const html3 = render('text\n\n-----\n\nmore');
  t.is(removeWhitespaces(html3), removeWhitespaces(expected3));
});

test('mixed ordered and unordered lists with text after', (t) => {
  const md = `1. First item
2. Second item
3. Third item

- Unordered item
- Another item
- Last item

More text`;

  const expected = `<ol>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>
<ul>
  <li>Unordered item</li>
  <li>Another item</li>
  <li>Last item</li>
</ul>
<p>More text</p>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('mixed unordered and ordered lists', (t) => {
  const md = `- First bullet
- Second bullet

1. First number
2. Second number

- Back to bullets
- Another bullet`;

  const expected = `<ul>
  <li>First bullet</li>
  <li>Second bullet</li>
</ul>
<ol>
  <li>First number</li>
  <li>Second number</li>
</ol>
<ul>
  <li>Back to bullets</li>
  <li>Another bullet</li>
</ul>`;

  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});
