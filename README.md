# slimdown-js

A very basic regex-based Markdown parser based on the gist by [jbroadway](https://gist.github.com/jbroadway/2836900).

Supports the
following elements (and can be extended via `Slimdown::add_rule()`):

* Headers
* Links
* Bold
* Emphasis
* Deletions
* Quotes
* Inline code
* Blockquotes
* Ordered/unordered lists

## Usage

Here is the general use case:

```ts
import { slimdown } from 'slimdown-js';

console.log(slimdown.render(
	"# Page title\n\nAnd **now** for something _completely_ different."
));
```

### Adding rules

A simple rule to convert `:)` to an image:

```ts
import { slimdown } from 'slimdown-js';

slimdown.addRule ('/(\W)\:\)(\W)/', '\1<img src="smiley.png" />\2');

console.log(slimdown.render(('Know what I\'m sayin? :)'));
```

In this example, we add GitHub-style internal linking
(e.g., `[[Another Page]]`).

```ts
import { slimdown } from 'slimdown-js';

console.log(slimdown.render(

// TODO
function mywiki_internal_link ($title) {
	return `<a href="%s">%s</a>',
		preg_replace ('/[^a-zA-Z0-9_-]+/', '-', $title),
		$title
	`;
}

slimdown.add_rule('/\[\[(.*?)\]\]/e', 'mywiki_internal_link (\'\\1\')');

console.log(slimdown.render ('Check [[This Page]] out!'));
```

### A longer example

```ts
import { slimdown } from 'slimdown-js';

console.log(slimdown.render(

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

More text...");
```
