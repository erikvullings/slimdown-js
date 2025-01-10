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
    '<ul><li>Item 1</li><ul><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ul><li>Item 2</li><li>Item 3</li></ul>';
  const html = render(
    `- Item 1\n  - Item 1.1\n  - Item 1.2\n  - Item 1.3\n- Item 2\n- Item 3`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested ul + ol', (t) => {
  const expected =
    '<ul><li>Item 1</li><ol><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ol><li>Item 2</li><li>Item 3</li></ul>';
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
    '<ol><li>Item 1</li><ol><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ol><li>Item 2</li><li>Item 3</li></ol>';
  const html = render(
    `1. Item 1\n  1. Item 1.1\n  2. Item 1.2\n  3. Item 1.3\n2. Item 2\n3. Item 3`,
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('nested ol + ul', (t) => {
  const expected =
    '<ol><li>Item 1</li><ul><li>Item 1.1</li><li>Item 1.2</li><li>Item 1.3</li></ul><li>Item 2</li><li>Item 3</li></ol>';
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
