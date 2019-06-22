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
- Ordered/unordered lists

## Example

Head over to [flems.io](https://flems.io) for a [live example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOjQZgDQgGd4EBjAF3imUNgjCgHsB3AOwzIJHwDMIFOkAbVAsAhmERIQFAmXad8JBiworqdAA4MATmQAEwPQGVa9Ziz0BfPd20MwegOQYA9AVONWjgNwAdFv5KLLJ69HoAvHoABgDEegAqEGQI-v4AgixQegBULMzZeoKierQsANYAugAUABZkZBpILi5MrRgA5gwM7QgYSmAAlHpkDDnZ3AywsPkFopmFcwxkNfDa1XUNTS4AnqI1XX32LgMYqSwFAPIs8P4F8UwMtwk12vA3ASwxcUYArgBGK1EUDOV3gYzID2yBWWrzBUPGDB+2nhNggADd4KcPqC9AB9XEQhj44YvN54iZI3GojF43EECAAD2JRAxFlx8Ag7TquKx-gAjBg9KD-AAmQX3R4sbDi0nvfxfBKiP4IPTwBniDQpD4AH0VyvgBD0RuNRt1aVeJstpr0AGEurBTf5tQBaV1u90e7VID0+11IF0e-1OvRKB3YPQQQ2W3XaTl1Z2iWjta5ZXUAEj5ADYAAzZvTa4OhvQiiNRk26kjwFSrShW3VGjMlgssXUAL3gf20xVksY0BvzelEFuuon00ZNGfzZwAsjowRQGfomEkanpfL4ohAWKV4FU00ooPABuuonoCBremcAHx6NJ6ZUMEhlPQARx+S3eN9EJDsBENhJKLcDV5FhZwtBc5AwDAoj8D4wAwV5MlWKpGBIH4JBUDA-gYKBtlwUIqkcKB0UcfD4LIbQflkKoTDoTw2EQw9tCqegBjYgZvC4QhiHgcgIGUAQQBFTNUD5EBLFwERxEkGg6PMeQuKCVQyGoNUtF0YZtj7PQACV4HaNU9M1b9VgiPQqgIf4ey3dokDPCibPwqCMCHdoCDsuZtkECohnCG9rJYdpYP8FwoX8HJjA8cw9GdW89AxbRtnvUR6RIPRXgMhlnT+FLa2nIcynovQNCHIhtEFX4NHUjgSXeCKJimZgbNVBAMJqqo5iyEg5nvME1VUQ8sjRCBilosxWCQJAgSgXFKIQKo2KQcLsmWmK9AACXgIFVgIVbYoASTAUQDN2iwCligAZLcylOiLYoAIUmYEzrWgBRMANBqFLIz2vQABEeLIfjgl+gBFd8ZF+-btyAkMcLq87bXh+9pifW7Efu1GyjfD90bWi5tCYygXB+PJCZrLJaFkQ0qmUMEEAxB1lFgbZjxe2L1p0CBW2UMhE3Sn5+GW1aCc5Ld+dEH5lh0OyACkGBqFgWCS+67CBJhRCSgAeAArBWle2AABPXFeVzsGHVzXDjAK9VoAdQ7ekKDsjYNHc5p2kjORPeWf5rZcHXzct7YXBFAAObBMzQXNVuhggNAgLsgeUJb2b0V33ZcT3ZA6Fc-f6FxNR+ZM-iRFgXG4bMoD5EV4GwMO-kzFAs1EAB2VuSGzNAw9+jOth9mp86OG0vtgIc5gM6ZC9K+BnXoZ0dYIFwHz+FwjtkVZp+0Ih6AwRfe-qN3+693Pfb+f2i5LsuK6rmu64bpuW-bzvu+Fl60il-ZtDs17Y2fAA1QWpQ3J6C1qsCAZQMBoiATZAght2hHT4NbW2L07QsASvSZQNg7AOAAArrVwcMUY8QtLwCMD+CAGgyD4VEFVFmzVeAMn7J1YYBoOA0JgM1MAc4WrwDagQGh8wND-CpjUZqIw9AsA0GAVOEUHZ-CdvAF2h9M4DyHmAFw4CyjQKmLAtwUVWALzxldSswQlF6GnPteIy0XD+DUjofQJAx5-kinJVgBhwp6FCitCwRoCh6SQtoM89gwT5W0IVaKW4JHrXiNOC6WJjTZFsb44RyoIBpVkKOdJ6UqxMSqBBOyAV2hDGAJ4o0EEzJRHXCwNMwAIKWGqTBMpJJIwIUFsBCY2hXrfhqFUKoggMpqnwpZBRZAfIRBvKU3xJoIDcHMmQUhDA5kjJCOENZTgimOBKc0k0FTIgQQQvAYylYqiDIZMMqyZAOI7KsC1IgHjpmWj2awxchzjm7jORc0Z1zHlGgaY8ywPyTSvDIGXF5cgHJgAWrBP5ZwjTeLKQUNIMBBwC0vNMpJnjUm0AyXzIGaVpo6Xaac-Sao7J6XaK9BkGh8KvHeW1clpKGRGTHpWIJuoinbMeWNeibT+AYGEQQXpAymW0qOayvhVYxlAqsHC4qsY0SjjBJk-FaL+yREEM0wQtjfDaGqVnfCjhqmOAqPhZouk+EMBpOuPVjztXVKqDEAA1AMKoGBsgDANa48abBARMVNV4lw6ctpMVusabVABCdcgh+kAD1o0VBdeuCo64+kAH4kA61EIqggFCqFIAGGmuN64BiJuPL4T17R8K+BAFrOg7QzzaBIOERwaYRSOEHLAMgLaMyOFtiAAN5q6DHQNPhLcaIGBlFrH8eAnT6bXTDUae1vgY2CHjSustybU1VAzVmnNeayAFqLWuktm6K1eprVrYopJuA9vbVeDMWsXCiH7YOoNpQbpapcFUdcK1fDZG1PiV17q03lr5F6xwWsezKHaA+kUT7oOBSvCas1QbsKwGeiabVP7-2AeA9kUD65wNVqcGAm2ban18OQ2+1UH0vr0kXYUHVAA-dczG3UEfLax3wzGINa0PLAB9fIn0Ceo6hvQAmv3riWuuEAHHCOyek3xl8Qmn0qZQ4G18EM6rhp1QEXwBBshRGMw6tdFROPVPXIZ4zVSDN-vLiRo1-gtYaFeKpwubmNPmoPB2LGX6ojyYGFEL1VRcSFIcoFfCPnwuxkCr5G8UQtY+YfcAHl8kDQkCqD5gYlgn3JaiDRrcO44aHik-4HDAH1zOgLL4F1HHK34TS6wDAgsrqyBo4LQC1M9BUWak6-CsUdARQkYePIFBBwWClYlMrLBBDZmdGgRN64MD1a9U1tgkw2tjPE5MLrHAZtVAAGTtDIN4GrV58MNe9byh8T4cYUBo7d7G2nGPLpYM6YAABWXAlgIPVK1i8LxYnNNf25rzfmc0dNLu-eubUJ7-BLd8DV7Qabqmup3TJr0abBDOkTUgUDTrYeuodRm2H8OWCI+R6j-woGPVprWwYtgfN9SmoO+Ts9DnGuM4FePGj01irj3aF2T6r2dUEDTVrdcJNBNWYl4LK8EGvNBsYaqRcXYeuwDK+LyXvgXCTFtgZiX+vFc0ZV-1dXkwv06+Xlje78ADcsC1k9u3CvHNO+0A7pXqIGSq4osUZ32mreiHddbl9DO3FsCcVtFgABVDQMftCwFN4yWjEYLAfrDRUQchpzRdm2FrQQFKqU0otZlFlJl2X2Vi+0CoV5gopIVUq+yWS0oZYsjFmyXKTSGkiAQN5Eqqg6sOxBw7GpvBbJhcaIIIQMsj1KmZJzjgYhayvFEbIzpmO4nCEtEAEbvILRUD4Zp0-9AOkiLPr628MAIECssSfRpOnmQQPoCAZlszeAjKAkoH+IBOpdQ8q0HvM8fvEyKoIvalQidcdcDtJ1VUXNOfbeQQCAANRwdoLZMiCZaIQ7GIWpeCEgS-O0Q8NIMgKobMHLbwKIGVWFR5EFMFAgSff5LFRvcbFVbJEqLsULDvSLQCa4Lg4pAAqfASfQSFCQLISIHcdgWMKFKgnJUFbQCwFwWNa3ItQWbUSYbUWgbUGobUDQbUZUbUZnBAAw7QAwqAT1CAdgNhfJKQ0QoYNNaIapWpHcBpfwU8OyWzR3DQB3WpEQygFwx3QuB3JpXxRghvdEJvVgtKVrL2TgqvRyWkPgsdCgBwSIRwLZAQo0Wg+Q6ILWeXSzXwMgLWWgFLdbDANvJIPhSQugBaHLJ9Yo-7aXVfBguVVzcIlgvFbJTbGIsLOI7giolIpwdIqZYFeAOQiwRLfXfIwo4o2pUo8o5Iqo6Q2olweo5zPXQTYI6gpgto5VDotKAPD8WIopfCfERIiMZIhfIY5pLI8Y-7A4igEo7neYyoyFGo3LG3R8Z7D8JozxUIo0VoxVdolvYYJUeaHo444NbabeM4zpI6Q9XokjJSKVPgrvQQ4IfQRMTkCwSIWE0cG5DAeOWgEgxwbULZfE3gLtZCULXEMdGhbQbQeLT-G8PMQ7Q7T-LWQcek6-KsE7VcWKPkNmK0DAI6DQLLXbPycyFwb0J1JodoSw6iUMOwpwUxCgbQDtOyFwZ0GUrOeUkgxUvQewxwWMLkMgdUrxaUlwXUsU2AJUxwBAbgU0vQOyNItie-OGdE4YMQ8yUMOyFgdCGdBkzA4Yy0E-VFSITE5MQQUMCoN0o0AgZcMgfA8yUQVEq0bqe5O02dU0uyG4pwTtLE8IGte0sgGtI-X5KfXKJwY0uoRwHM0YsFDtCMlgQskAaskskAMsq0I0dMsERwFU1YWs2Qhs-M5MFs-svVDs2M40Q8bgSWLtOssYwYqc-5E0SwN00M1cSIRLCiFLP1HafEwkpIQiUkwUy0YU2hWoENUyCUvc8qV4tickvgVUy8qEzA28vQVkyEpibk2-GoU8k0c80Ul8piMdRk7cmoHwqAKoCAHLXcq87Qd45YVff840PeBgLcQiLZRCj3TYtEkIOwJgIApElQA8zUI8pzFgMk8swC05ZgTAgixYmox8yk5iAi+iuiz8him-XkmQ0MtKSIAixjI0Gim5TIuivyUS40bcj3WpAiySgCw84kk8+S1Cik586k0CzA1-Zkj8tk1-LWAS5gPvbi5YFCrsvQGirLYgWATSiU7cqASC6C2C2pSsKYRi5YsgKAZClS4SvWDCl07C1fG5MyiyvylgTCmQ3MjwrWQw+3GK7CXCXcywFyxChK7YK8J9WKoI5oj4f45g3Y4EqPOYOPBPWAKoD9FEjIoc7Ij9EAk5FwZQqjCDXECfX4lo-K5vVVW8o4iLEjOE-As4981Iq4x5UMhmYgMyfqmoH83kt0qKgHJw+ARmSwOCqE9y94iC4Aca2AFa3C-5f5LiIgUgZOYIagPkeuJAT7FAcSU1EADPZAYQEAMQCQagSAGEPgLiJEWAagPuZoUmDQMoOUguN6l4PgQ2AUAUTMNeFcWMWAPeBQaQUhagXNXsFSSwCoSwIAA).

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
