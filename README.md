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

Head over to [flems.io](https://flems.io) for a [live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOjQZgDQgGd4EBjAF3imRAoLIzIJHwDMIEmkBtUAOwEMwiJDXh0GTfCQD2vCnOozedAAQBlWBDBRpAd14qAvCoKbte3hg1ad+gNwAdXk6WrtRlQAMAxCoAqEGQITk5+0ioArkQqAFQx1ub6cbgqAOYATvwADiqBKizp0mAqXLxZYAC6ABQAFmRkWQRIAPTNuu0YZWAAVgQYMmDNWfwkANb8qfDNpjYWALS9AJQq0umxLKujMSpkNfAqWYXd8OQrBlwA4oEAEhEARtV1DU2tqYE19-1FzfDpEKMANwisE0vFSBGmZlsvAWBEWGBCvG2AHlePAnNs-LppBj-DV0vB0TCVAAxaQRdJOOakiAAolOby+NT3Pb8KCI1H7OJkbFxHb4wmxOIbClxbZsOkI5y8TkqAD6cp50gV-IJ+zlIvScvytPVcoIEAAHiqiHSDHL4BBUnU5VKnABGDAqTlOABMTqxON42A9AvpvEZ-n4dwQKnghsEWWC0oAPkGQ2IVEnk0m4wBBAkprOplQAYWk0lgqacMbmZfLFcrMaQldrZaQpcrDZLKhkRewuQI2bjf2tZDm-E0qTRUBUcYAJPaAGwABhnY5bbZUrs73db8Dkv0oa6Tk5XMZbAC94HdMiYyH8som4-xM2j+GQd7v7QvpQBZVb7CiGx+6d4qBwHE8CBeFBeAqnHGQoHgRZAM8ExIwQO1eAAPhUNMVBDaQxhUABHCJpAoJw0JGQoCC7JUVDAvpEQ-TNv3oDAME8RxpTADACV4aD0iqHQSAiIQ5AwO5pCgABPFIwCqAByKBaWkySGHSKIyCqBJoQ4jduKqbRFj0xY7GYQhiBOMgIFkTgQBQJAZxAABfCp8FBUZOB4EABCEahIF2P5YCMik-JEJ5GhaZoIjKUZUi+QZvPxdgAAFHUdKdmli3yMF6IyyDEq9qAIEhLzIezcD4QRhEIKF5l6eKZwwJL-PSQKQGCl4woiqKBkhWZ9FhGq6rq5pNDuLrEksTL8Gy3KRHywr7IqOygA).

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
