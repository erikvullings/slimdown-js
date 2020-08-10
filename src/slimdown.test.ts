import { render } from './slimdown';
import test from 'ava';

const removeWhitespaces = (txt: string) => txt.replace(/\s+/g, '');

test('parsing header', (t) => {
  const expected = '<h1>Hello world</h1>';
  const html = render('# Hello world');
  t.is(removeWhitespaces(html), removeWhitespaces(expected));
});

test('process underscores', (t) => {
  const expected = '<p>Hello_world</p>';
  const html = render('Hello_world');
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
