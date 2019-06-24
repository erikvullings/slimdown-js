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
- Ordered/unordered lists (one level deep only)

## Size

The main reason for using this library, which hasn't been extensively tested and is not completely compatible with the spec, is to have something small. Version 0.1.0's size is 2.614 bytes, uncompressed, and 1.267 bytes using gzip compression.

For more advanced scenario's, however, I can recommend [marked](https://github.com/markedjs/marked), albeit at a bigger size: marked.min.js is 23.372 bytes uncompressed, and 7.684 bytes using gzip.

## Playground

Head over to [flems.io](https://flems.io) for a [live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOjQZgDQgGd4EBjAF3imRAoLIzIJHwDMIEmkBtUAOwEMwiJDXh0GTfCQD2vCnOoQwAB2kAnMgAJgmgMqwlUaQHdemgL6aWa6WE0ByAgbBHTAWgBWBAAIAGDACMGNj2ANwAOryRMrx0mi6aALyaAAYAxJoAKhBkCJGRmdKaAK5EmgBU5fqGJryVuJoA5mr8AEaaOVY2dly8ymAAugAUABZkZMoESAD008bzGH1gXhgyYNPK-CQA1vyN8NNONe5eAJSa6hUs6tvlmmQj8JrKNh7w5BdmXADiOQASxVawzGEyms0aORGgNWtmm8DUEG2ADdirADLxGgRDs5XLxPARThh8nVNAB5XjwSJ3TLGaRUrIjNTwSl4zQAMWkxTUkTc7IgSJZkTSGV0gMe-CgxPJT0qZFplXujOZFUq1y5lTubAFRKivGlmgA+ga5dIjYqmU8DWq1AarPzLQaCBAAB5mogCswG+AQRpjA06yJBMkUyIAJgwWVpkWwEcySsFvGFWTaCE08GdgmUeV1AB9k60OJoi8Wi3mAIJMktV0uaADC0mksFLkRzbjb7Y7nZzSE7vbbSFbnYHLc0Mib2A6BGreYRvrIbn4BkaFKgmjzABIAgA2Xy+NcjseaUOT6ej+ByeGUU9FzfHnMjgBe8FaLU0dARyjEa80-ErFP4WhVnmxabvuuoALLqE8FDOloxiQpo4ThCkEC8Oi8BDOuMhQPApxISkb6ZggAa8AAfJoZaaAW0g7JoACOxTSBQkTkVsNgEFOJqaOhBAkZBlYwfQGAYCkES6mAGBMrwOFqEMRgkMUQhyBgrTSFAACeDRgEM9hQPy9haQwailGQQzVC4tSSeeMlDC4pz2acoTMIQxDvGQECyJwIC+Kg2AgOYAz4Oi2ycDwIACEI1CQA8CKwM5XJxSIIKTDM0zFH02yNDC6zRYy7DeEEQRbtMuWxRgXjOWQ6mftQBAkB+ZD+QM5hAA).

## Usage

Here is the general use case:

```ts
import { Slimdown } from 'slimdown-js';

console.log(Slimdown.render('# Page title\n\nAnd **now** for something _completely_ different.'));
```

### Adding rules

A simple rule to convert `:)` to an image:

```ts
import { Slimdown } from 'slimdown-js';

Slimdown.addRule ('/(\W)\:\)(\W)/', '$1<img src="smiley.png" />$2');

console.log(Slimdown.render(('Know what I\'m sayin? :)'));
```

In this example, we add GitHub-style internal linking
(e.g., `[[Another Page]]`).

```ts
import { Slimdown } from 'slimdown-js';

console.log(Slimdown.render(

// TODO
const mywiki_internal_link = (title: string) => `<a href="${title.replace(/[^a-zA-Z0-9_-]+/g, '_')}">${title}</a>`;

Slimdown.add_rule('/\[\[(.*?)\]\]/e', 'mywiki_internal_link (\'\\1\')');

console.log(Slimdown.render ('Check [[This Page]] out!'));
```

### A longer example

```ts
import { Slimdown } from 'slimdown-js';

console.log(Slimdown.render(`# A longer example

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
