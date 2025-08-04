# slimdown-js

A basic regex-based Markdown parser based on the gist by [Johnny Broadway](https://gist.github.com/jbroadway/2836900), converted from PHP to TypeScript, extended with several additional elements (images, tables, code blocks, underscores) and published to `npm`.

Inspired by:

- [Landmark: the simplest Markdown engine for the browser](https://gist.github.com/plugnburn/f0d12e38b6416a77c098)
- [parse-md-js](https://github.com/Chalarangelo/parse-md-js/blob/master/parsemd.js)

Supports the following elements (and can be extended via `addRule(regexp: RegExp, replacement: string | Function)`):

- Headers: `# Header 1`, or `## Header 2`
- Images: `![ALT TEXT](https://my_image_source)`
- Links: `[ALT TEXT](https://my_image_source)`
- Bold: `**bold**` or `__bold__`
- Emphasis: `*italics*` or `_italics_`
- Deletions: `~~bold~~`
- Quotes: `This is a quote: :"my quote":`
- Inline code: `This is \`inline\` code`.
- Code blocks: Use three subsequent backticks \` to open and close a code block.
- Block quotes: Lines starting with `> `.
- Tables: Use pipes `|` to separate columns, and '-' to separate the table header from its body.
- Table captions: `[Caption Text]` before a table
- Table column spanning: Use `||` followed by empty cells to span columns
- Math expressions: Inline `$E = mc^2$` and block `$$\int_0^1 x dx$$`
- Task lists: `- [x] Completed` or `- [ ] Todo`
- Definition lists: `Term : Definition` (capitalized terms and definitions)
- Underscores (Escape underscores to keep them `\_`)
- Ordered/unordered lists (up to three levels deep, may be nested)
- Superscript and subscript (`z~1~` or `a^2^`)
- Footnotes, e.g. `footnote[^1]` and `[^1]: Footnote reference`.

## Size

The main reason for using this library, which hasn't been extensively tested and is not completely compatible with the spec, is to have something small. Version 1.0.0 with Phase 1 enhancements is approximately 2.8 kB compressed.

For more advanced scenario's, however, I can recommend [marked](https://github.com/markedjs/marked), albeit at a bigger size: marked.min.js is 23.372 bytes uncompressed, and 7.684 bytes using gzip.

## Playground

Head over to [flems.io for a live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWArAOgMwBoQGd4EBjAF3imRA1PxD32ICcB7WWZAbQAYcBGNAHYAungBmEBHSSdQAOwCGYREmq16IYiznkdVeAA8ADiyakABKQCeR+OYBK8AOaHHR2AuLwm5gLzmACnwAVwAjfFImCDknJHMIqJiccwxUhSYnfDiFOStOYQBKPwA+eMjopwBuAB05WoB6ACpG2vNG8wBlWAgwKBYAdzlzAFpzAEFzADdvK3NQhXwIYnMmZ0Nh+cIocwBZdIBrPsHzI3TCJgxO4KMTM3xLAAt4VvaxNlgBivMieGUde4COW2xByczshl0UAoUwgCk63V6AzkSCQChgAH0mMEEAECgUkC8XiNzAAJeBo7z4ImjACSYAULipQ3aowAMtF9ky2sSAEJsKDU8wAUTARgeCwgXJZ5gAIj9SBBtFLiQBFYIscjK2lybpyOxaKGCgDCLChcw+xE5gp5Fv2AEd1ZrBQB5JhQ1ZQerBOSmd3Q7oRAHaOwIaawczaWBWAqCkmmCAAL20pAU4axUkFHWulOYECMFiB8TCjCi+cCAAME+i+OjyxGfOWFAA9ABMTfLMeZRNdECc0VT5gUwVID1McQAUiwHnJcuYeaw0f0FLMADwAKynM6sAAEN9PcqEF1Al1YMFowMUiQB1eDhCDkOIPUikIxZer1PsRDB9kdhM8sMB6jXQ8WEXZd6hbAAOLAADYAE5uG4IkaTkfAjAgJgFAVbQCWZYknxfN8P0lUhv3vB4-3Pep3GCJw5FCYImDkeoxG4KA+BbeAsEg0IYJQPgYIUQRBGIbg4MgwUCNfJB3x-CjQn-QCjXFDxMJiIgWGos54GGXphjXfB6lCD5QnqekIm8LSmEIXoMAMyTn2k2SSLI38FKomi6IYpiWLYjiuJ4viBKEkSxIkrs8LGYdRyYOIhSifZzAANWxXVMnMFdvAgfYMEmVKKnwbcnHpSRFMvPCTTkaZrMVIYxFYMBzAABRJJrLBYcwABUbHgDpc3zZIFBuKMvgkAx4HuQtNVoQaYC+MBTHBBA-hmwc5G2IwwgDB4vlIDq5CMMBcO5G87wfcwpKIuTKIA+osv2PL2AK+p8ARI45H05V2S8VD4DiHYaU6l56lqBp6k6PbVnMA07GMlhLXuchRVMdJJFmPaTlWaYdHMekmEOJFMfhibFhicx+nI6JHl+WotFQiwYZteHOTiBIKnyPxzHyGo5DpiJzGiXV4BNKFWfKGIOf8bmwYhxbzDeDUfSdXmlQsBXSCVia4jGJhMKsFdODZpIykSJxhFKKXhB52nVe+RghvgPYjDiRwtDdFcjacZJPYt8xgFacwAHIADJA7iEOlCMSpA5wAPA5XMOg+D2BSGj2OhiD4pE5DpxU5juPqhAbPg4dDU04DwvA8L8Pg4AYiwODy7kABfa2Vfpu3iEcFwDE5vV+gcZwhWMAJy04AASYBnVCNd4DIDB9ngKx8ACCaQVsJ2CjslhogCQPA4KZvhHLZJA6cA+275iw185oIxdN-ETa+XxyvMeIMFWdxPHgVfGG7wxkgBHpKQYgDwigv07g7J2nBgGgMKJfW2pxMK33RPfCoyQhZoJiOA0o-sM5X0sFEMAyhtj+CFjQIhuIeZv1WKQRiQx6hNhXNUao9QAD8ARsQAB82BcO6Fwh4XCjBcOMlwlMxl4BiKYGIqABR6gQBoBNUgARyjEIoJ2N+b82HmHLCwuQk8hbNz0bojOb84i6NqCuIwl5aiT1USQoxljqI2LkOWHmrdQbMXBgQ7E7J+b+ACKgp+xt0RBM9ske8vxOb7xwTLN+5YVzYhcSw0gK5ujFEnpEsAFCei4mbiueo6S9EFKSW4zxPjYB+IsAEgO6JyAGFIFgr2AdohQh0E09Ob90QMXYPARpwTmkZyyR02oOC-YBwIaGIgnM+DmAANS7Cwg8DAYgPimACK0+AOgMAIBiCOcw4MWwFGoSsPp9DAgBzflXSxSTA4f3gLYLCAQpmwCKHMy5Qc9EpLSRALO8yPlZJyWAXE-zTFBwKekwOoLNGfKcbc+5jzlEvI0eYY5tQPF1C8dDW2bAqkoI6QLJG0SD4lDiTolcbBknVFSekzJSMgV5Ihb84p9RKVlMxQQ3FJFb61Pqf08JLT1pbP5eLQZXSekIBFabTphLfgjLkGMvBb9JnwDDDM+ZiyRwrLWUwDZQrtm7Nzg8A55gjknNoecgIHzrlyApbALOCLyRItVUQN51qvnUp+X895YLAWqJBT6mF8dCm-KhYGzRNqCmUruZ-J1zyXWvIDmiluCCO5w0tKXcg+KBnJFCQSrJxLYkZwsba9N9pHTwAycAP1lDD4FLLZmyt7KZZNVYF4fA9x1aa1OWIbwWz20CyGCOOwfKuZNj4MIG2Hcu0angI4XtqxeZzoeR4LwPgAnolgQ8fNUAmmKoDu+cwRpVhYTsHCXUiVoiLDNHCEIthrL9QsCmJw5NyJE3vT2vtS6uSnLoUxcld6BZQF8IXMQchVhiCQJkqARiQDFBXHCB4EGQMgFrmBqD1aYOF2KBPTDR8CkKHgy9a4xR2UYpbW2km8sWCK1neYKEEg5D3lqvcTg47hBxAAGI0Y1nRvlU7+YzvIHKRjzHtBuFXd4HlGdN1YVAfKt+0AFOWAhPK-dGchMTQwJtfADwAicGgMkPlDKCjwIDha-9+9KgHPBo4Ba0xqb0fgKJ7CdUGqOZKkOiE6K26HoAOJbO8Kexzmn7iEDILVATFgXB6kwuQbjtHNQdDnq52+6nFNiECKFnZWyjV+F8P4bgRQLNDCs545VttQsklIGAcM-hQsfIwPSIwVqwVv304ZlTDTCglB0R8n5QGUPoeg7B1+MLzB2IhEYtrGU73wcQ8hwuaHwPOYw9AUbgBKwgI0Rub-WQ2kZlW-FFb9t67xtRfcrv7zkmJXFACAkxoYeA7UNnjmsqRwYDiuJDY27VjbfpPKrNXYDTbflG+1Ti7uTFI+41N-NxEIGzeEi65J3RZBzdRpgwCCV010FKio6XsUd1TL2IY9XTDAMa2hboyjA5cIPo1iQKdvABECeiCJg1dZjIgOYUo3BzDB2DgLDKg5dY5b2ca0YfBjspGayzrQrzSUzfqEgYYcyZJOEUREAI8vpcwu0YHH65AmBVxm2Yg5qv1ea+UTrj5eug5RCcE+E343NFxGV6r+oVvtdsF15o-XCAxCkGdy78w4d85guTRVjupBSGBHl3EOQwQwChG8ATqP-M4T+GJ3RTg8urYfJK4Ocw2i6zZ7kChyeChYN1jDycjF6eLDGv8AkyIVangUmspT9w94950+l01oaLOHiyN68Pkz-fGdG6HyPiBw-+eC7H4akc-fZcBGHxEsZLeHh2KgBsw+beYMFJHKR-vG4zsH3yfUVv7KG8rAGPcfwOPhVd+p3vPR9OwUD5awEVg-Qxm--HwZ0kCnx-wGH-wGHnzv36DFyNUj0J35mWH8F-x-RO1l1t0CF-yLRD3JVb0nl-3QJhQwCpx71pw-2wJO0n2Z1Z3ZxFyYC5x53MD5wFyFxXFoJgP2Ul190INXy8HYA316xbygB3z32birV4NgBM0vxjxPwIM0VOzkD3gvyPyYAOw+VPx3gUJiXNTOX-RLRXHh0rX0NCFNCsDb2bknmICkOMKgFMKPwUAkRcTI1hwZgQByAAFUjA3CmA6tAgL091esL0EVJMAh6hmFWE2FfhigPxT50QLsOVbZ293REdRVkgt0CUm8g4SUIElV4CLAXlOYt12CHhtC-0hgElt9gAXlRDJ5ll-U616gKiqjocfNPFD1ONvQIttB2pvgGlMIyA1ptgIg5YYZzRmYmQCEIQ+jSARZ4AmYEZb48YCZBg90mlescjC9Fj3ogjv5WsYUQZQZqh8BGhywTiWF+gWhah9MmxhBGg2EYwDijiTiLEji9FoiPlAkt1kgYY09NFGZbR8BtNghdNvcoQ4CYVC89CjBVhihgBgAjRnQZQhQeRWRnQjQABpFqCw00WY-4oo4kPgZuQkgpKEytYxE5N+ZuGVZNcjLFdo3mVLDGSYzwAsdaMoOWQWaIfUbEqLHoyIZklCIWGYhYg4d6FYgZNY8zHQoYTYpEbYrwEI8sK48sYQOZAocsaIwIWTEBB4L47En4jkvUGYwE4E748kq7XQ2EmkAAOVZGtKFHhMRMxOrR1E5KNKXwl3MAJMJJv3MGbmpN83BjpM6KHQ6lWCGKhhGLLXuApn2ShJYA-RJE6h2FZEgXQhiB5LDMhmFmxLmM5GFPxlFIGUfk9glIzg2JFNlM-mCI+VCJJJhLhIRKRJRPRJaitWqCgFVKJJYWomhLeLBQ+Lkx1MHShAMB+NvxGMfxzP+M4CQUIBQmUU2VHPzxmwhKsWhMnjXhBPgHqLrJ9IpKpJh1aMDI6IZNDKUXZJdL1GxTNBjONTjITKTJTLXiGgqAzPPNWAFNdOxPzKWORCLNWOyMlNKNxgrMGDlJ-nqEtJtLtIdKFFbJYQ7MPmbg1IHO1IiSFVHNLJhQIQnMHUFOxJnO0nnL1RHNMzNNXJhirU3O+Mv0op9L9MPMxSaHaHsGxAmngO5RYEyzoXcC1kHicGHiMGSCrO-h8DEBPNqmEoeSdTaBBnbn5nTHYqlgDk4H2KYFeK9lhTkEDlEBs0HnszsBYXUozlUr0QCFrlVICAwEaDkU0sSO8F0sPXss7xMvqAAEIWFOArjPKVT7jJ1qgWc2EkA1wFBJgFhH0kACgOE2MWFTNVTYqNT44egX18AmBiAK8WxC5BwU4K8+BsMdLkhD0egGQJp0LJgWBF5tgU83goYL0f1TLqgvKYrGrfKWF-LArgrQrwrSxGkorvLqg4r7jbLT4EMLpFsQBx5Mq4Nx4+BtsCq9K6qVL6h+q2qCg2yLjGguFQk1rrKOF0QuEWEbK7iWEWxEqZqPZIhtAnAMksACkEgrqs5HLwZjDYABRXKVrqhCh1qtqdrbj7jTrNLA5zrIjx5bq7oLx5rD1fgxQJR6r9iWF0REq644I0Bo4nrzBvRUc3Z2KkELA8rXKWEAA-Imqyv6omomxK27IgDJWa+oKEe1SG8GempalhAkFhEAUm469m1mymu0GmgpPmxm8wRtA9cGBquoQ44404y4tjG4rmiWx46Wl4hoQG4pOs86nsytIWmGMtUWrmeoRU3atUlCsJFI68v6IsgQlcSijcxgLc+oui9Gg0rkw0Amy4toNaw6rhYYA66oSy6y4ajGypEidG7EcwAMWgDG0mF9OZZIUYUwbkDGNpOjUEYVJgKwFm92my-TbgYYOCFUlhDAX6wOrlCIUO8MCOn9Q9cWngPOgu6oDAUmku4Osuwq8GNgcOkiOGsy4OXOSoX24oYujUhtCtdGke2dOGtspsX6rmvgSmubSau6kjIWu9HMHqpatswmme+4uewGj2MIDJFsJe0IR6tuoscIR9TOj6YANAHAZC1WyxJDA5U+vSmKRMZMAcRSlSmsgINoFhLhZquQeu32pgNhPRNagIIKv+6oLhJANhTgEYFUuBgoBZC4rhT2y4qBtBwB4BoysB2oO4o6vsmFAwmVUQTOzgFhJsfq4QVqz6yBtyyKjUzTedL9LwCTUS9GzTT9RddtChqhmhuhjjFhI4jqnBi4uQQhwOzTETaIMTOQDhtdLh17OjBjOR1zbumWpsPROh5iTSpBBQdGtEDadIBkTCMUTR-ANhMI+oTgFgYIYQcHQ46xuxhx+1RKmOcwLALhiAXuJkiMcMQsbEJamx8e8gFxFcMJytSmw8FxIWsaXk5BKJpay6IK7s7smKouG4jU4gVwuQDwrw2AHxvxxqKmRa1y5G1GxK2I0OoVB9Rae4XG01WoYQQce4HWPWA2buQS5If+AwRRqTLhAZc2XzZoIkRwOpxZAswmUdaIDGRM5MjAQkPCbcAxxqGU44PYaZ44fjFZtZ05AypqUxpwcxh4e4GkbirEOwAIBjIcFOeWVMQgAoKSgyxzFhKxFhYoVIJZ6oYkz5kXex1kgxk5oaM5okVZ0xxqCEbwRQYOuQPMi5whYIa5257ENWR57cqSr+Lwcwd5hbZzb5-5283F35uEZ9PpFDbpDweFrKpDAl1IT5okDGeMrZamUpoYOEfuE4Eq8FkrKUOSwwW4BmW2RdJImpDODZv8gVMs34FgaYI5zCEFixzmMQDFmVaFpiVMdkeFh-B52AQgdOAnQ9RwQgJ9J4NkxVs9XWZcH9P4sYvEwrE5Z2t03LfZR1gObLd0zmbgNuN+Q9YePk-oyM-4gYvCzk82sEGquwOM9taOgOSVzmJksgGY3MleEtSeSVxxVxOAhN-wJN0gT8w07EoBUChVX1vSsYYaWYBNxSn9WtlZUwIUTwPTfTVYHub2YsUgLFmS-wCdH4mq3wvpIXR1lg05RFazCAOZVU8ZGbXNkC7ZuQcCn-NYAwDt8IAsSaXIME30gOBiy7Y198l22GENwsZ2iN4l+8qTZ8tMpweN0tzmTMxaFN-4kthdnN+9pAw9wt7MqEV9385NPWsYGAajRLdi8LVLCAbip4KGdIM9WcBrCVj9+d38kzDVGLILeLFRpLFLWqKhS7SDjA2V+V4505-AIoHIt+OdyVpdxhKxYoJumx6xceF6U+GauIiklpTLVeBpGFrVjkMjmdmFKj0tmj0aulsQFDSmsl9IFwUgSl4yHIfYWl8a9jndmV4CyVxihoMZyKYDzl+AAeRSuITqc1ttwweIUcbEKquwJwEyAcQsJWKOuwMANFyQcNhaKEJZ5kAV4wUwYVonGAVihHAJMzgwF2IeYwLFyTFacLnuAZnwIZz2AnetnTPTTgULqL7+FaMzFNcpW2XoTmcsWuLqe8BATxTqDqIEuwZoLoHod6ZoZIEF0IQleWdzTgA6MAYQNfRyIifoPrjADrgyRSLSS0Eql6N6JET6IoBOxoGq-YdoYdImWeforozgPze8EkMILry6GSYiNyYb+6R6NKQyV6OrybgyLeTxdoZ0PUWodoTqfoFgO7rqOl54D6cwbjRiWoUYTje7N72oTqJRXGWYFhcsdEGGdEUHzxWuYrrMUIRIzxG76rxoUgR75oR4VYZH2b+xpgZoV4P7rz2oJH8wUJVHlgUJDH+AOwdEN4RidEeWP7kn9ERYAwCnwgbGEn+AXsJ8dEQnuQPgS4JH2oFsS4B7p7uQLAUX176H4rzqewhHQwSOMrzFIZuXiRe4EPIZnWOwcg8wIZk0DuvX2ob24YU3s383832Bi36303pAE383u3437FcMLAAWDXmFIZh3J8YYMvaEIZmamCRCI3uQIZ+XU1N3l3UP4VPtbYcbIZ-7DiYPoZhMW8ZBNmWwe4IZ2D8wPULCSPmFGa4Pg4ixEv3oGXrqeX8EAwJX-7kPiv9X7ArXqGXX-XmjcMJPm3zvq3zvh3+3s3x3uvsP13yUfPr30gH37oOiP3ibASIPg6wfjulsCPuP6GaPj0fPhPpf+f5P1P29coDPvXkXOwXPiwFfzRQv+f4vqH6oExWoHYOWUdYl0H52gIceb40H+IGvvn0oCYMtYWitWoKUE8CsAO0lgR7p3T1AAlPEZIKGCP1vQ9BeKIHXjOQDYwTpLgV4N9PgAAhno5ormAcKOgUCB4pM94PnvfyhjGYGWmKVARxl2CzAIMbDeAF52bRyBskorZnH0GIBJ5hUGAawlYFSJ7xIcnjbJJECBLKI2BuqXoHiDxCVANAhAEgBoyoCwQ+ASAXOkoKQB8A4IIAI+HgDqpcB5ASgFQOAHIhRAOAeARiBwFUA7d3w3oIwPsA1xURIAI4EwduBF4i8OIZkYwaVEgCLsDIGgawLYCoAlg8wpALQcIGbhAA).

## Development

Use `npm start` to convert the TypeScript code to JavaScript and `npm test` to run the test watcher. It uses `microbundle` to compile the final code to different output formats.

## Usage

Here is the general use case:

```ts
import { render } from 'slimdown-js';

console.log(
  render('# Page title\n\nAnd **now** for something _completely_ different.',),
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

### Phase 1 Features Examples

#### Math Support

```ts
import { render } from 'slimdown-js';

// Inline math
console.log(render('Einstein discovered $E = mc^2$ in 1905.'));
// Output: <p>Einstein discovered <span class="math-inline">E = mc^2</span> in 1905.</p>

// Block math
console.log(render(`The Gaussian integral:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

is fundamental in mathematics.`));
```

#### Task Lists

```ts
import { render } from 'slimdown-js';

console.log(render(`- [x] Learn markdown
- [ ] Practice LaTeX
- [X] Write documentation`));
// Output: <ul>
//   <li><input type="checkbox" checked disabled> Learn markdown</li>
//   <li><input type="checkbox" disabled> Practice LaTeX</li>
//   <li><input type="checkbox" checked disabled> Write documentation</li>
// </ul>
```

#### Enhanced Tables

```ts
import { render } from 'slimdown-js';

// Table with caption and column spanning
console.log(render(`[Sales Data 2024]
| Product | Q1 Sales|| | Q2 |
|---------|----------|------|
| Widget  | $1000    | $1200|
| Gadget  | $800     | $900 |`));
// Creates table with caption and Q1 Sales spanning multiple columns
```

#### Definition Lists

```ts
import { render } from 'slimdown-js';

console.log(render(`Technology : Computer and software tools
Science : Study of the natural world`));
// Output: 
// <dl><dt>Technology</dt><dd>Computer and software tools</dd></dl>
// <dl><dt>Science</dt><dd>Study of the natural world</dd></dl>
```
