# slimdown-js

A very basic regex-based Markdown parser based on the gist by [Johnny Broadway](https://gist.github.com/jbroadway/2836900), converted from PHP to TypeScript, extended with several additional elements (images, tables, code blocks) and published to `npm`.

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

## Playground

Head over to [flems.io](https://flems.io) for a [live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOjQZgDQgGd4EBjAF3imRAoLIzIJHwDMIEmkBtUAOwEMwiJDXh0GTfCQD2vCnOozedAAQBlWBDBRpAd14qAvCoKbte3hg1ad+gNwAdXk6WrtRlQAMAxCoAqEGQITk4AgrxQKgBUvHpRKlz8Kpq8ANYAugAUABZkZAAOSAD0RbplGADm0tIVCBgyYACUKmTS0VEs0rCwcfH8EQn90mTZ8ABOWbkFxUUAnvzZ1fXSYEWNGCG88QDyvPBO8X660gf+2WPw+7wAtCoAYtIArmNOt3cQAG5XTt6+ao8AI1G-Cgm128HaZGOUXiIwuEJhHSeY0RKjYXw2zl44JUAH1cVDpPiWudLnjOs9cWjPhD8QQIAAPYlEL4GXHwCAVXK4zFOACMGBU4KcACZBUcTrxsOLSd9eL9-PwAQgVPAGYJ8sEsQAfRXKsQqQ1Gw260IXY0Wk0qADC1VgJqc2uuzpdrrd2qQbq9zqQTrdvsdKhk9uwKggBEturGnNy134mgqe0iuoAJHyAGwABkzKm1geDKhFYYjFt1JHgcnGlEjRrTRbzvF1AC94ACxkk6NH8gbdfxzXt+GQa7W+bnNgBZaTmigMoe6QLZFQOByeCC8FLwTIpmRQeCNZeeEwauqbAB8KlCKmV0hIqRUAEdHsMruf+CQxtICBHCck12Jebwk7Tmq9AYBgniOFiYAYBcETjJkOgkI8QhyBgALSFAsy4CoYCZAA5FAnx4dh0FkGMjx0Jk1jmPoMEVruYyZNojQsY0djMIQxDwOQECyJwICZkgmbXNgADsSDpigIAAL7pPgKSpJwPAgAIQjUJAcLsBxzywNQUz5AQMyPLw+SpBUyyrBp5zsAAAgKArpkUVnRrAGAAFaSDQszdtQBDvhA+RkDJuB8IIwiEGYtg3B5NmwIOYhBfgOl6XkBlGSZZkWUUpg2BY1wxZmGCFdgRSaAC2WRRY7meWQ3nhX5XZBbJ0lAA).

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
