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
// Store math expressions to prevent markdown processing within them
const mathBlocks: string[] = [];
const inlineMath: string[] = [];
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

const ulList = (
  _text: string,
  indent: string,
  _bullet: string,
  item: string,
) => {
  const level = Math.floor(indent.length / 2);
  return `\n{{LISTITEM:ul:${level}:${item.trim()}}}\n`;
};

const olList = (
  _text: string,
  indent: string,
  _bullet: string,
  item: string,
) => {
  const level = Math.floor(indent.length / 2);
  return `\n{{LISTITEM:ol:${level}:${item.trim()}}}\n`;
};

const blockquote = (_: string, __: string, item = '') =>
  `\n<blockquote>${item.trim()}</blockquote>`;

const taskList = (
  _text: string,
  indent: string,
  checkboxState: string,
  item: string,
) => {
  const level = Math.floor(indent.length / 2);
  const checked = checkboxState.toLowerCase() === 'x';
  const checkboxHtml = `<input type="checkbox"${checked ? ' checked' : ''} disabled>`;
  return `\n{{LISTITEM:ul:${level}:${checkboxHtml} ${item.trim()}}}\n`;
};

const definitionList = (_: string, term: string, definition: string) => {
  return `\n<dl><dt>${term.trim()}</dt><dd>${definition.trim()}</dd></dl>\n`;
};

// Function to process list items into proper nested HTML
const processListItems = (markdown: string): string => {
  if (!markdown.includes('{{LISTITEM:')) return markdown;
  
  // Find groups of consecutive list items separated by non-list content
  const lines = markdown.split('\n');
  const groups: Array<Array<{type: 'ul' | 'ol', level: number, content: string, originalLine: string}>> = [];
  let currentGroup: Array<{type: 'ul' | 'ol', level: number, content: string, originalLine: string}> = [];
  
  for (const line of lines) {
    const listMatch = line.match(/\{\{LISTITEM:([^:]+):([^:]+):(.+)\}\}/);
    if (listMatch) {
      currentGroup.push({
        type: listMatch[1] as 'ul' | 'ol',
        level: parseInt(listMatch[2]),
        content: listMatch[3],
        originalLine: line
      });
    } else if (line.trim() !== '') {
      // Non-empty, non-list line - end current group
      if (currentGroup.length > 0) {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
    }
    // Empty lines don't break list groups
  }
  
  // Add final group if any
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  if (groups.length === 0) return markdown;
  
  // Process each group separately
  for (const group of groups) {
    const html = buildNestedList(group);
    
    // Replace first item in group with the complete HTML
    const firstItem = group[0];
    markdown = markdown.replace(firstItem.originalLine, html);
    
    // Remove remaining items in group
    for (let i = 1; i < group.length; i++) {
      markdown = markdown.replace(group[i].originalLine, '');
    }
  }
  
  return markdown;
};

// Build nested HTML from a group of list items
const buildNestedList = (listItems: Array<{type: 'ul' | 'ol', level: number, content: string, originalLine: string}>): string => {
  if (listItems.length === 0) return '';
  
  let html = '';
  const stack: Array<{type: 'ul' | 'ol', level: number, hasOpenLi: boolean}> = [];
  
  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const nextItem = i < listItems.length - 1 ? listItems[i + 1] : null;
    
    // Close lists that are deeper than current level
    while (stack.length > 0 && stack[stack.length - 1].level > item.level) {
      const last = stack.pop()!;
      if (last.hasOpenLi) {
        html += '</li>';
      }
      html += `</${last.type}>`;
    }
    
    // Close current list if switching types at same level
    if (stack.length > 0 && 
        stack[stack.length - 1].level === item.level && 
        stack[stack.length - 1].type !== item.type) {
      const last = stack.pop()!;
      if (last.hasOpenLi) {
        html += '</li>';
      }
      html += `</${last.type}>`;
    }
    
    // Open new list if needed
    if (stack.length === 0 || stack[stack.length - 1].level < item.level) {
      html += `<${item.type}>`;
      stack.push({type: item.type, level: item.level, hasOpenLi: false});
    }
    
    // Close previous li at same level if needed
    if (stack.length > 0 && stack[stack.length - 1].hasOpenLi && stack[stack.length - 1].level === item.level) {
      html += '</li>';
      stack[stack.length - 1].hasOpenLi = false;
    }
    
    // Add list item
    html += `<li>${item.content}`;
    stack[stack.length - 1].hasOpenLi = true;
    
    // Close li if next item is not deeper
    if (!nextItem || nextItem.level <= item.level) {
      html += '</li>';
      stack[stack.length - 1].hasOpenLi = false;
    }
  }
  
  // Close remaining lists
  while (stack.length > 0) {
    const last = stack.pop()!;
    if (last.hasOpenLi) {
      html += '</li>';
    }
    html += `</${last.type}>`;
  }
  
  return html;
};

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

const table = (_: string, headers: string, format: string, content: string = '') => {
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
  const headerCells = headers
    .split('|')
    .filter((__, i, arr) => i > 0 && i < arr.length - 1)
    .map((hd) => hd.trim());
    
  const headerResults = [];
  let skipNext = 0;
  
  for (let i = 0; i < headerCells.length; i++) {
    if (skipNext > 0) {
      skipNext--;
      continue;
    }
    
    const hd = headerCells[i];
    if (hd.trim()) {
      // Count consecutive empty cells after this one to determine span
      let spanCount = 1;
      for (let j = i + 1; j < headerCells.length && (!headerCells[j] || headerCells[j].trim() === ''); j++) {
        spanCount++;
      }
      if (spanCount > 1) {
        skipNext = spanCount - 1;
        headerResults.push(`<th${td(i)} colspan="${spanCount}">${hd}</th>`);
      } else {
        headerResults.push(`<th${td(i)}>${hd}</th>`);
      }
    }
  }
    
  const h = `<tr>${headerResults.join('')}</tr>`;
  const rows = content
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row && row.length);
  const c = rows
    .map((row) => {
      const cells = row
        .split('|')
        .filter((__, i, arr) => i > 0 && i < arr.length - 1)
        .map((cell) => cell.trim());
        
      const cellResults = [];
      let skipNext = 0;
      
      for (let i = 0; i < cells.length; i++) {
        if (skipNext > 0) {
          skipNext--;
          continue;
        }
        
        const cell = cells[i];
        if (cell.trim()) {
          // Count consecutive empty cells after this one to determine span
          let spanCount = 1;
          for (let j = i + 1; j < cells.length && (!cells[j] || cells[j].trim() === ''); j++) {
            spanCount++;
          }
          if (spanCount > 1) {
            skipNext = spanCount - 1;
            cellResults.push(`<td${td(i)} colspan="${spanCount}">${cell}</td>`);
          } else {
            cellResults.push(`<td${td(i)}>${cell}</td>`);
          }
        }
      }
      
      return `<tr>${cellResults.join('')}</tr>`;
    })
    .join('');
  return `\n<table><tbody>${h}${c}</tbody></table>\n`;
};

// Enhanced table with caption support
const tableWithCaption = (_: string, caption: string, headers: string, format: string, content: string = '') => {
  const tableHtml = table(_, headers, format, content);
  // Insert caption after <table> tag
  return tableHtml.replace('<table>', `<table><caption>${caption.trim()}</caption>`);
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

// Function to extract and store math blocks
const extractMathBlocks = (markdown: string): string => {
  return markdown.replace(
    /\n\s*\$\$([^]*?)\$\$\s*\n/g,
    (_match, math) => {
      mathBlocks.push(math.trim());
      return `\n{{MATHBLOCKPH${mathBlocks.length - 1}}}\n`;
    },
  );
};

// Function to extract and store inline math
const extractInlineMath = (markdown: string): string => {
  return markdown.replace(/\$([^$\n]+)\$/g, (_match, math) => {
    inlineMath.push(math);
    return `{{INLINEMATHPH${inlineMath.length - 1}}}`;
  });
};

// Function to restore math blocks
const restoreMathBlocks = (markdown: string): string => {
  return markdown.replace(
    /{{MATHBLOCKPH(\d+)}}/g,
    (_match, index) => {
      const math = mathBlocks[parseInt(index)];
      return `<div class="math-block">${esc(math)}</div>`;
    },
  );
};

// Function to restore inline math
const restoreInlineMath = (markdown: string): string => {
  return markdown.replace(/{{INLINEMATHPH(\d+)}}/g, (_match, index) => {
    const math = inlineMath[parseInt(index)];
    return `<span class="math-inline">${esc(math)}</span>`;
  });
};

/** Pre-paragraph rules (everything except paragraph processing) */
const preParaRules = [
  [/\r\n/g, '\n'], // Remove \r
  [/\n(#+)(.*)/g, header], // headers
  [/!\[([^\[]+)\]\((?:javascript:)?([^\)]+)\)/g, '<img src="$2" alt="$1">'], // images, invoked before links
  [/\[([^\[]+)\]\((?:javascript:)?([^\)]+)\)/g, '<a href="$2">$1</a>'], // links
  [/([^\\])(\*\*|__)(.*?(_|\*)?)\2/g, '$1<strong>$3</strong>'], // bold
  [/([^\\])(\*|_)(.*?)\2/g, '$1<em>$3</em>'], // emphasis
  [/\\_/g, '&#95;'], // underscores part 1
  [/\~\~(.*?)\~\~/g, '<del>$1</del>'], // del
  [/\:\"(.*?)\"\:/g, '<q>$1</q>'], // quote
  [/\n( *)[-*+] \[([xX ])\](.*)/g, taskList], // task lists with checkboxes (must come before regular ul lists)
  [/\n( *)(\*|-|\+)(.*)/g, ulList], // ul lists using +, - or * to denote an entry
  [/\n( *)([0-9]+\.)(.*)/g, olList], // ol lists
  [/\n(&gt;|\>)(.*)/g, blockquote], // blockquotes
  [/(\^)(.*?)\1/g, '<sup>$2</sup>'], // superscript
  [/(\~)(.*?)\1/g, '<sub>$2</sub>'], // subscript
  [/\n-{5,}/g, '\n<hr />'], // horizontal rule
  [/\n\[(.+?)\]\n( *\|[^\n]+\|\r?\n)((?: *\|:?[ -]+:?)+ *\|)(\n(?: *\|[^\n]+\|\r?\n?)*)?/g, tableWithCaption], // tables with captions
  [/( *\|[^\n]+\|\r?\n)((?: *\|:?[ -]+:?)+ *\|)(\n(?: *\|[^\n]+\|\r?\n?)*)?/g, table], // regular tables
  [/\[\^([^\]]+)\](?!:)/g, footnoteReferenceReplacer], // footnote references
  [/\[\^([^\]]+)\]:\s*((?:[^\n]*\n?)*)/g, footnoteDefinitionReplacer], // footnote definitions
  [/\n([A-Z][A-Za-z\s]*?):\s*([A-Z][^\n]*)/g, definitionList], // definition lists (Capitalized Term : Capitalized Definition)
] as Array<[RegExp, RegexReplacer | string]>;

/** Post-paragraph rules (cleanup rules that run after paragraph processing) */
const postParaRules = [
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
  mathBlocks.length = 0;
  inlineMath.length = 0;
  footnotes.length = 0;

  // Extract code blocks, math, and inline code before processing
  markdown = extractCodeBlocks(`\n${markdown}\n`);
  markdown = extractMathBlocks(markdown);
  markdown = extractInlineCode(markdown);
  markdown = extractInlineMath(markdown);

  // Apply pre-paragraph rules
  preParaRules.forEach(([regex, subst, repeat = 1]) => {
    for (let i = 0; i < repeat; i++) {
      markdown = markdown.replace(regex, subst as any);
    }
  });

  // Process collected list items into proper nested structure
  markdown = processListItems(markdown);

  // Apply paragraph processing
  markdown = markdown.replace(/\n([^\n]+)\n/g, para);

  // Apply post-paragraph cleanup rules
  postParaRules.forEach(([regex, subst, repeat = 1]) => {
    for (let i = 0; i < repeat; i++) {
      markdown = markdown.replace(regex, subst as any);
    }
  });

  // Restore code blocks, math, and inline code with proper escaping
  markdown = restoreCodeBlocks(markdown);
  markdown = restoreMathBlocks(markdown);
  markdown = restoreInlineCode(markdown);
  markdown = restoreInlineMath(markdown);

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
  preParaRules.push([regex, replacement]);
};
