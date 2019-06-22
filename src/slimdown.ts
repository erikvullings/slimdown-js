export type RegexReplacer = (substring: string, ...args: any[]) => string;

/**
 * Slimdown - A very basic regex-based Markdown parser. Supports the
 * following elements (and can be extended via Slimdown::add_rule()):
 *
 * - Headers
 * - Images
 * - Links
 * - Bold
 * - Emphasis
 * - Deletions
 * - Quotes
 * - Inline code
 * - Code blocks
 * - Blockquotes
 * - Ordered/unordered lists (one level only)
 * - Horizontal rules
 *
 * Original author: Johnny Broadway <johnny@johnnybroadway.com>
 * Website: https://gist.github.com/jbroadway/2836900
 * Inspiration:
 * - https://gist.github.com/plugnburn/f0d12e38b6416a77c098
 * - https://github.com/Chalarangelo/parse-md-js/blob/master/parsemd.js
 * - https://gist.github.com/plugnburn/f0d12e38b6416a77c098
 *
 * Author: Erik Vullings <erik.vullings@gmail.com>
 * Conversion from PHP to TypeScript, applying fixes and tests, adding more elements, and publishing to npm:
 * Website: https://github.com/erikvullings/slimdown-js
 * License: MIT
 */
export class Slimdown {
  /**
   * Render some Markdown into HTML.
   */
  public static render(text: string) {
    text = `\n${text}\n`;
    this.rules.forEach(([regex, subst]) => {
      if (typeof subst === 'string') {
        text = text.replace(regex, subst);
      } else {
        text = text.replace(regex, subst);
      }
    });
    return text.trim();
  }

  /**
   * Add a rule.
   */
  public static addRule(regex: RegExp, replacement: RegexReplacer | string) {
    Slimdown.rules.push([regex, replacement]);
  }

  private static rules = [
    [/\r\n/g, '\n'], // Remove \r
    [/\n(#+)(.*)/g, Slimdown.header], // headers
    [/!\[([^\[]+)\]\((?:javascript:)?([^\)]+)\)/g, "<img src='$2' alt='$1'>"], // images, invoked before links
    [/\[([^\[]+)\]\((?:javascript:)?([^\)]+)\)/g, "<a href='$2'>$1</a>"], // links
    [/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>'], // bold
    [/(\*|_)(.*?)\1/g, '<em>$2</em>'], // emphasis
    [/\~\~(.*?)\~\~/g, '<del>$1</del>'], // del
    [/\:\"(.*?)\"\:/g, '<q>$1</q>'], // quote
    [/\n\s*```\n([^]*?)\n\s*```\s*\n/g, '\n<pre>$1</pre>'], // codeblock
    [/`(.*?)`/g, (_: string, code: string) => `<code>${Slimdown.esc(code)}</code>`], // inline code
    [/\n(\*|\-|\+)(.*)/g, Slimdown.ulList], // ul lists using +, - or * to denote an entry
    [/\n[0-9]+\.(.*)/g, Slimdown.olList], // ol lists
    [/\n(&gt;|\>)(.*)/g, Slimdown.blockquote], // blockquotes
    [/\n-{5,}/g, '\n<hr />'], // horizontal rule
    [/(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?/g, Slimdown.table],
    [/\n([^\n]+)\n/g, Slimdown.para], // add paragraphs
    [/\s?<\/ul>\s?<ul>/g, ''], // fix extra ul
    [/\s?<\/ol>\s?<ol>/g, ''], // fix extra ol
    [/<\/blockquote>\n<blockquote>/g, '<br>\n'], // fix extra blockquote
    [/<a.*<\/a>/g, Slimdown.cleanUpUrl], // fix em in links
  ] as Array<[RegExp, RegexReplacer | string]>;

  private static esc(s: string) {
    s = s.replace(/\&/g, '&amp;');
    const escChars = '\'#<>`*-~_=:"![]()nt';
    const l = escChars.length;
    for (let i = 0; i < l; i++) {
      s = s.replace(RegExp('\\' + escChars[i], 'g'), m => `&#${m.charCodeAt(0)};`);
    }
    return s;
  }

  private static para(_: string, line: string) {
    const trimmed = line.trim();
    return /^<\/?(ul|ol|li|h|p|bl|table|tr|td)/i.test(trimmed) ? `\n${line}\n` : `\n<p>\n${trimmed}\n</p>\n`;
  }

  private static ulList(_: string, __: string, item = '') {
    return `<ul>\n\t<li>${Slimdown.esc(item.trim())}</li>\n</ul>`;
  }

  private static olList(_: string, item = '') {
    return `<ol>\n\t<li>${Slimdown.esc(item.trim())}</li>\n</ol>`;
  }

  private static blockquote(_: string, __: string, item = '') {
    return `\n<blockquote>${Slimdown.esc(item.trim())}</blockquote>`;
  }

  private static table(_: string, headers: string, format: string, content: string) {
    const align = format
      .split('|')
      .filter((__, i, arr) => i > 0 && i < arr.length - 1)
      .map(col => (/:-+:/g.test(col) ? 'center' : /-+:/g.test(col) ? 'right' : /:-+/.test(col) ? 'left' : ''));
    const td = (col: number) => {
      const a = align[col];
      switch (a) {
        case 'left': return ' align="left"';
        case 'right': return ' align="right"';
        case 'center': return ' align="center"';
        default: return '';
      }
    };
    const h = `<tr>${headers
      .split('|')
      .map(header => header.trim())
      .filter(header => header && header.length)
      .map((header, i) => `<th${td(i)}>${header}</th>`)
      .join('')}</tr>`;
    const rows = content
      .split('\n')
      .map(row => row.trim())
      .filter(row => row && row.length);
    const c = rows
      .map(
        row =>
          `<tr>${row
            .split('|')
            .filter((__, i) => i > 0 && i <= rows.length)
            .map((cell, i) => `<td${td(i)}>${cell.trim()}</td>`)
            .join('')}</tr>`
      )
      .join('');
    return `\n<table><tbody>${h}${c}</tbody></table>\n`;
  }

  private static cleanUpUrl(link: string) {
    return link.replace(/<\/?em>/g, '_');
  }

  private static header(_: string, match: string, header = '') {
    const level = match.length;
    return `<h${level}>${header.trim()}</h${level}>`;
  }
}
