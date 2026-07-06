import hljs from 'highlight.js';
import type { SlimdownExtension } from 'slimdown-js';

export interface HighlightExtensionOptions {
  /** Highlight code without a language using highlight.js auto-detection. */
  autoDetect?: boolean;
  /** Languages that should be ignored by this extension. Default: mermaid. */
  ignoreLanguages?: string[];
}

const defaultIgnoredLanguages = ['mermaid'];

const renderPlainCode = (
  lang: string,
  code: string,
  escapeHtml: (value: string) => string,
) => {
  const classAttr = lang ? ` class="language-${lang}"` : '';
  return `<pre><code${classAttr}>${escapeHtml(code)}</code></pre>`;
};

export const highlightExtension = (
  options: HighlightExtensionOptions = {},
): SlimdownExtension => {
  const ignoreLanguages = options.ignoreLanguages ?? defaultIgnoredLanguages;

  return {
    renderCodeBlock: ({ lang, code, escapeHtml }) => {
      const normalizedLang = lang.toLowerCase();
      if (ignoreLanguages.includes(normalizedLang)) return undefined;

      if (!normalizedLang && !options.autoDetect) {
        return renderPlainCode(lang, code, escapeHtml);
      }

      const highlighted =
        normalizedLang && hljs.getLanguage(normalizedLang)
          ? hljs.highlight(code, { language: normalizedLang }).value
          : hljs.highlightAuto(code).value;

      const languageClass = normalizedLang
        ? ` language-${normalizedLang}`
        : '';
      return `<pre><code class="hljs${languageClass}">${highlighted}</code></pre>`;
    },
  };
};

export default highlightExtension;
