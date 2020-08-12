# slimdown-js

A basic regex-based Markdown parser based on the gist by [Johnny Broadway](https://gist.github.com/jbroadway/2836900), converted from PHP to TypeScript, extended with several additional elements (images, tables, code blocks) and published to `npm`.

Inspired by:

- https://gist.github.com/plugnburn/f0d12e38b6416a77c098
- https://github.com/Chalarangelo/parse-md-js/blob/master/parsemd.js
- https://gist.github.com/plugnburn/f0d12e38b6416a77c098

Supports the following elements (and can be extended via
`Slimdown.add_rule(regexp: RegExp, replacement: string | Function)`):

- Headers
- Images
- Links
- Bold
- Emphasis
- Deletions
- Quotes
- Inline code
- Code blocks
- Blockquotes
- Tables
- Underscores (\_)
- Ordered/unordered lists (one level deep only)

## Size

The main reason for using this library, which hasn't been extensively tested and is not completely compatible with the spec, is to have something small. Version 0.1.0's size is 2.614 bytes, uncompressed, and 1.267 bytes using gzip compression.

For more advanced scenario's, however, I can recommend [marked](https://github.com/markedjs/marked), albeit at a bigger size: marked.min.js is 23.372 bytes uncompressed, and 7.684 bytes using gzip.

## Playground

Head over to [flems.io](https://flems.io) for a [live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOjQZgDQgGd4EBjAF3imRAoLIzIJHwDMIEmkBtUAOwEMwiJDXh0GTfCQD2vCnOoQwAB2kAnMgAJgmtfF5R4azQF9NLNdLCaA5AVhKo0gO68AtACsCNgNwAdXgCZXjpNMChNAF5NAAMAYk0AFQgyBACAxOlNAFciTQAqfIBlB3CXXkLcTQBzNX4AI00U80trLl5lMABdAAoACzIyZQIkAHpR50mMDrAvDBkwUeV+EgBrfmr4UftHcs8CAEpNdQKWdVX8zTI++E1lSw94cmPeTS4AcRSACWz63oGhiNxtUUn1fvMrKMjBBVgA3bKwBy8aoEbalJyufYHDDpCqaADyvHgAUuiWc0hJST6emJ7k0ADFpNk1AE3AyILDaQE4gkir8bvwoLjCbdCmRyYUrtT4KLCmdmYVLmxOTjArwRZoAPqa8XSbVSmla+VqTXmDm3bUECAAD31RE5r018Ag1QGmtVAQAjBgCUSAgAmH1kim8bBB6Vc3g8pINBCaeDWwTKNJqgA+MfqHE02Zz2fTAEE9Lni3nNABhaTSWB5gKptz1huNpuppBNtv1pB1pud2uaGTV7BNAgl9NqF0DNz8BzVIkRdMAEk9ADYAAwrzSp3v9zT+ocjvv6Ch6CLF9PZxe7ze8dMAL3g9TqmjoY+UYg3mn4RaJ-C0p9zi43XEAFl1FuChrS0ZxQU0Pw-BiCBeCReAennGRDAOWCYifJMEA9XgAD5NHzTRM2kNZNAAR2yaQKACQiVksAhh11TQkIIPCQKLcD6AwDAYn8NUwAwPQDCMHonBIbIhDkDB6mkKAAE8qjAHobCgDkbGUhg1FyMgehEww1B6cIDlMg4fGYQhiCeMgIFkTgQGwAB2VBPRAEwunwJFVk4HgQAEIRqEga4x1gSzmTCkQAWGMZRmyDpVmqCFFmC6l2AAAW9b0l1GVLQowLxLLIBTX2oAgSBfMh3K6EwgA).

## Usage

Here is the general use case:

```ts
import { Slimdown } from 'slimdown-js';

console.log(
  Slimdown.render(
    '# Page title\n\nAnd **now** for something _completely_ different.',
  ),
);
```

### Adding rules

A simple rule to convert `:)` to an image:

```ts
import { render, addRule } from 'slimdown-js';

addRule ('/(\W)\:\)(\W)/', '$1<img src="smiley.png" />$2');

console.log(render(('Know what I\'m sayin? :)'));
```

In this example, we add GitHub-style internal linking
(e.g., `[[Another Page]]`).

```ts
import { render, addRule } from 'slimdown-js';

const mywiki_internal_link = (title: string) =>
  `<a href="${title.replace(/[^a-zA-Z0-9_-]+/g, '_')}">${title}</a>`;

addRule('/[[(.*?)]]/e', mywiki_internal_link('$1'));

console.log(render('Check [[This Page]] out!'));
```

### A longer example

```ts
import { render } from 'slimdown-js';

console.log(render(`# A longer example

And *now* [a link](http://www.google.com) to **follow** and [another](http://yahoo.com/).

* One
* Two
* Three

## Subhead

One **two** three **four** five.

One __two__ three _four_ five __six__ seven _eight_.

1. One
2. Two
3. Three

More text with `inline($code)` sample.

> A block quote
> across two lines.

More text...`));
```
