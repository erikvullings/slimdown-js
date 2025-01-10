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
 * - Superscript and subscript (`z_1_` or `a^2^`)
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

// Store code blocks temporarily to prevent markdown processing within them
const codeBlocks: string[] = [];
const inlineCode: string[] = [];
// Store footnotes
const footnotes: Array<[id: string, text: string]> = [];

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escRegex = new RegExp(`[${Object.keys(escapeMap).join('')}]`, 'g');

const esc = (s: string): string =>
  s.replace(escRegex, (match) => escapeMap[match]);

const para = (_: string, line: string) => {
  const trimmed = line.trim();
  return /^<\/?(ul|ol|li|h|p|bl|table|tr|td)/i.test(trimmed)
    ? `\n${line}\n`
    : `\n<p>\n${trimmed}\n</p>\n`;
};

// const ulList = (_: string, __: string, item = '') =>
//   `<ul>\n\t<li>${item.trim()}</li>\n</ul>`;

const ulList = (
  _text: string,
  indent: string,
  _bullet: string,
  item: string,
) => {
  const level = 1 + Math.floor(indent.length / 2);
  return (
    '\n<ul>'.repeat(level) +
    '\n\t<li>' +
    item.trim() +
    '</li>' +
    '\n</ul>'.repeat(level)
  );
};

// const olList = (_: string, item = '') =>
//   `<ol>\n\t<li>${item.trim()}</li>\n</ol>`;

const olList = (
  _text: string,
  indent: string,
  _bullet: string,
  item: string,
) => {
  const level = 1 + Math.floor(indent.length / 2);
  return (
    '\n<ol>'.repeat(level) +
    '\n\t<li>' +
    item.trim() +
    '</li>' +
    '\n</ol>'.repeat(level)
  );
};

const blockquote = (_: string, __: string, item = '') =>
  `\n<blockquote>${item.trim()}</blockquote>`;

// Process footnote references in the text [^1]
const footnoteReferenceReplacer = (_match: string, id: string) => {
  // Create a link inside a superscript tag with proper references
  return `<sup id="fnref:${id}"><a href="#fn:${id}">[${id}]</a></sup>`;
};

// Process footnote definitions [^1]: Footnote text
const footnoteDefinitionReplacer = (
  _match: string,
  id: string,
  text: string,
) => {
  footnotes.push([id, text.trim()]);
  return ''; // Remove the definition from the main text
};

// Generate the footnotes section
const generateFootnotesSection = () => {
  if (footnotes.length === 0) return '';

  const footnotesHtml = footnotes
    .map(
      ([id, text]) => `
    <li id="fn:${id}">
      ${text}
      <sup><a href="#fnref:${id}">↩</a></sup>
    </li>`,
    )
    .join('\n');

  return `
<div class="footnotes">
  <hr>
  <ol>
    ${footnotesHtml}
  </ol>
</div>`;
};

const table = (_: string, headers: string, format: string, content: string) => {
  const align = format
    .split('|')
    .filter((__, i, arr) => i > 0 && i < arr.length - 1)
    .map((col) =>
      /:-+:/g.test(col)
        ? 'center'
        : /-+:/g.test(col)
        ? 'right'
        : /:-+/.test(col)
        ? 'left'
        : '',
    );
  const td = (col: number) => {
    const a = align[col];
    return a ? ` align="${a}"` : '';
  };
  const h = `<tr>${headers
    .split('|')
    .map((hd) => hd.trim())
    .filter((hd) => hd && hd.length)
    .map((hd, i) => `<th${td(i)}>${hd}</th>`)
    .join('')}</tr>`;
  const rows = content
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row && row.length);
  const c = rows
    .map(
      (row) =>
        `<tr>${row
          .split('|')
          .filter((__, i, arr) => i > 0 && i < arr.length - 1)
          .map((cell, i) => `<td${td(i)}>${cell.trim()}</td>`)
          .join('')}</tr>`,
    )
    .join('');
  return `\n<table><tbody>${h}${c}</tbody></table>\n`;
};

const cleanUpUrl = (link: string) => link.replace(/<\/?em>/g, '_');

const header = (_: string, match: string, h = '') => {
  const level = match.length;
  return `<h${level}>${h.trim()}</h${level}>`;
};

// Function to extract and store code blocks
const extractCodeBlocks = (markdown: string): string => {
  return markdown.replace(
    /\n\s*```\w*\n([^]*?)\n\s*```\s*\n/g,
    (_match, code) => {
      codeBlocks.push(code);
      return `\n<pre>{{CODEBLOCKPH${codeBlocks.length - 1}}}</pre>\n`;
    },
  );
};

// Function to extract and store inline code
const extractInlineCode = (markdown: string): string => {
  return markdown.replace(/`([^`]+)`/g, (_match, code) => {
    inlineCode.push(code);
    return `{{INLINECODEPH${inlineCode.length - 1}}}`;
  });
};

// Function to restore code blocks with proper HTML escaping
const restoreCodeBlocks = (markdown: string): string => {
  return markdown.replace(
    /<pre>{{CODEBLOCKPH(\d+)}}<\/pre>/g,
    (_match, index) => {
      const code = codeBlocks[parseInt(index)];
      return `<pre>${esc(code)}</pre>`;
    },
  );
};

// Function to restore inline code with proper HTML escaping
const restoreInlineCode = (markdown: string): string => {
  return markdown.replace(/{{INLINECODEPH(\d+)}}/g, (_match, index) => {
    const code = inlineCode[parseInt(index)];
    return `<code>${esc(code)}</code>`;
  });
};

/** Rules consist of tuples: RegExp, replacer function, repeat */
const rules = [
  [/\r\n/g, '\n'], // Remove \r
  [/\n(#+)(.*)/g, header], // headers
  [/!\[([^\[]+)\]\((?:javascript:)?([^\)]+)\)/g, '<img src="$2" alt="$1">'], // images, invoked before links
  [/\[([^\[]+)\]\((?:javascript:)?([^\)]+)\)/g, '<a href="$2">$1</a>'], // links
  [/([^\\])(\*\*|__)(.*?(_|\*)?)\2/g, '$1<strong>$3</strong>'], // bold
  [/([^\\])(\*|_)(.*?)\2/g, '$1<em>$3</em>'], // emphasis
  [/\\_/g, '&#95;'], // underscores part 1
  [/\~\~(.*?)\~\~/g, '<del>$1</del>'], // del
  [/\:\"(.*?)\"\:/g, '<q>$1</q>'], // quote
  // [/\n\s*```\n([^]*?)\n\s*```\s*\n/g, '\n<pre>$1</pre>'], // codeblock
  // [/`(.*?)`/g, (_: string, code: string) => `<code>${esc(code)}</code>`], // inline code
  [/\n( *)(\*|-|\+)(.*)/g, ulList], // ul lists using +, - or * to denote an entry
  [/\n( *)([0-9]+\.)(.*)/g, olList], // ul lists
  // [/\n[0-9]+\.(.*)/g, olList], // ol lists
  [/\n(&gt;|\>)(.*)/g, blockquote], // blockquotes
  [/(\^)(.*?)\1/g, '<sup>$2</sup>'], // superscript
  [/(\~)(.*?)\1/g, '<sub>$2</sub>'], // subscript
  [/\n-{5,}/g, '\n<hr />'], // horizontal rule
  [
    /( *\|[^\n]+\|\r?\n)((?: *\|:?[ -]+:?)+ *\|)(\n(?: *\|[^\n]+\|\r?\n?)*)?/g,
    table,
  ],
  [/\[\^([^\]]+)\](?!:)/g, footnoteReferenceReplacer], // footnote references
  [/\[\^([^\]]+)\]:\s*((?:[^\n]*\n?)*)/g, footnoteDefinitionReplacer], // footnote definitions
  [/\n([^\n]+)\n/g, para], // add paragraphs
  [/\s?<\/[ou]l>\s?<[ou]l>/g, '', 3], // fix extra ol and ul
  [/<\/blockquote>\n<blockquote>/g, '<br>\n'], // fix extra blockquote
  [/https?:\/\/[^"']*/g, cleanUpUrl], // fix em in links
  [/&#95;/g, '_'], // underscores part 2
] as Array<[RegExp, RegexReplacer | string]>;

/**
 * Render Markdown text into HTML.
 *
 * @param markdown Markdown text
 * @param removeParagraphs If true (default false), remove the \<p\>...\</p\> around paragraphs
 * @param externalLinks If true (default false), replace \<a href...\> with \<a taget="_blank" href...\>
 * to open them in a new page
 * @returns
 */
export const render = (
  markdown: string,
  removeParagraphs = false,
  externalLinks = false,
) => {
  // Reset the storage arrays
  codeBlocks.length = 0;
  inlineCode.length = 0;
  footnotes.length = 0;

  // Extract code blocks and inline code before processing
  markdown = extractCodeBlocks(`\n${markdown}\n`);
  markdown = extractInlineCode(markdown);

  // Apply markdown rules
  rules.forEach(([regex, subst, repeat = 1]) => {
    for (let i = 0; i < repeat; i++) {
      markdown = markdown.replace(regex, subst as any);
    }
  });

  // Restore code blocks and inline code with proper escaping
  markdown = restoreCodeBlocks(markdown);
  markdown = restoreInlineCode(markdown);

  // Add footnotes section if there are any footnotes
  markdown = markdown.trim() + generateFootnotesSection();

  if (removeParagraphs) {
    markdown = markdown.replace(/^<p>(.*)<\/p>$/s, '$1');
  }
  if (externalLinks) {
    markdown = markdown.replace(/<a href="/g, '<a target="_blank" href="');
  }
  return markdown;
};

/**
 * Add a new rule: The regex should be global and not use multiline mode.
 */
export const addRule = (regex: RegExp, replacement: RegexReplacer | string) => {
  rules.push([regex, replacement]);
};
