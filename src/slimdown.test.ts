import { render } from './index.js';
import test from 'ava';

const removeWhitespaces = (txt: string) => txt.replace(/\s+/g, '');

test('parsing header', (t) => {
  const expected = '<h1>Hello world</h1>';
  const html = render('# Hello world');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('process single underscore', (t) => {
  const expected = '<p>Hello_world</p>';
  const html = render('Hello_world');
  const html2 = render('Hello\\_world');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
  t.is(removeWhitespaces(html2), removeWhitespaces(expected));
});

test('process double underscores', (t) => {
  const expected = '<p>here_a_test</p>';
  const html = render('here\\_a\\_test');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('proccess italics', (t) => {
  const expected = '<p>This is <em>italics</em>.</p>';
  const html = render('This is _italics_.');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('proccess superscript', (t) => {
  const expected =
    '<p>This is the 1<sup>st</sup> test, and this is the 2<sup>nd</sup> version. But also consider a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>.</p>';
  const html = render(
    'This is the 1^st^ test, and this is the 2^nd^ version. But also consider a^2^ + b^2^ = c^2^.',
  );
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('proccess subscript', (t) => {
  const expected =
    '<p>This is <em>italics</em> and this is a<sub>1</sub> or C<sub>2</sub>.</p>';
  const html = render('This is _italics_ and this is a~1~ or C~2~.');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('process table 1', (t) => {
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

test('process table 2', (t) => {
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

More text with \`inline($code)\` sample.

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
More text with <code>inline&#40;$code&#41;</code> sample.
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
  const md = `This is \`inline\` code.`;
  const expected = `This is <code>inline</code> code.`;
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
