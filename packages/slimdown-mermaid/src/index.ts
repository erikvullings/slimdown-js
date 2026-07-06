import type { SlimdownExtension } from 'slimdown-js';

export interface MermaidExtensionOptions {
  /** HTML class used by Mermaid's browser renderer. Default: mermaid. */
  className?: string;
}

const escapeAttribute = (value: string) =>
  value.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });

export const mermaidExtension = (
  options: MermaidExtensionOptions = {},
): SlimdownExtension => {
  const className = options.className ?? 'mermaid';

  return {
    renderCodeBlock: ({ lang, code, escapeHtml }) => {
      if (lang.toLowerCase() !== 'mermaid') return undefined;
      return `<div class="${escapeAttribute(className)}">${escapeHtml(
        code.trim(),
      )}</div>`;
    },
  };
};

export default mermaidExtension;
