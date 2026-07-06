import katex, { type KatexOptions } from 'katex';
import type { SlimdownExtension } from 'slimdown-js';

export interface KatexExtensionOptions extends Omit<KatexOptions, 'displayMode'> {
  /**
   * When false, invalid math falls back to escaped slimdown-js math HTML.
   * Default: false.
   */
  throwOnError?: boolean;
}

const fallbackInline = (math: string, escapeHtml: (value: string) => string) =>
  `<span class="math-inline">${escapeHtml(math)}</span>`;

const fallbackBlock = (math: string, escapeHtml: (value: string) => string) =>
  `<div class="math-block">${escapeHtml(math)}</div>`;

const renderKatex = (
  math: string,
  displayMode: boolean,
  escapeHtml: (value: string) => string,
  options: KatexExtensionOptions,
) => {
  try {
    return katex.renderToString(math, {
      throwOnError: false,
      ...options,
      displayMode,
    });
  } catch (error) {
    if (options.throwOnError) throw error;
    return displayMode
      ? fallbackBlock(math, escapeHtml)
      : fallbackInline(math, escapeHtml);
  }
};

export const katexExtension = (
  options: KatexExtensionOptions = {},
): SlimdownExtension => ({
  renderInlineMath: ({ math, escapeHtml }) =>
    renderKatex(math, false, escapeHtml, options),
  renderMathBlock: ({ math, escapeHtml }) =>
    renderKatex(math, true, escapeHtml, options),
});

export default katexExtension;
