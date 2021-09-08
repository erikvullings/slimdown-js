import { render } from '.';
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
To use <strong>Slimdown</strong>, grap it from <a href='https://www.npmjs.com/package/slimdown-js'>npm</a> or <em>fork</em> the project on <a href='https://github.com/erikvullings/slimdown-js'>GitHub</a>.
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
  <p><a href='http://www.google.com/?some_param=another_value'>Test Link</a></p>`;
  const html = render(md);
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('parsing images', (t) => {
  const md = `NS logo image: ![ns logo](https://www.ns.nl/static/generic/2.49.1/images/nslogo.svg)`;
  const expected = `<p>NS logo image: <img src='https://www.ns.nl/static/generic/2.49.1/images/nslogo.svg' alt='ns logo'></p>`;
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
