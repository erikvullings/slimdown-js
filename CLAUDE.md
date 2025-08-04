# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

slimdown-js is a lightweight, regex-based Markdown parser written in TypeScript. It converts Markdown text to HTML with support for headers, images, links, formatting, lists, tables, code blocks, footnotes, and more. The library prioritizes small bundle size (2.3KB uncompressed) over full Markdown spec compliance.

## Core Architecture

### Main Components

- **src/index.ts** - Main library containing the `render()` function and all markdown parsing rules
- **src/slimdown.test.ts** - Comprehensive test suite using AVA test framework

### Key Functions

- `render(markdown, removeParagraphs?, externalLinks?)` - Main parsing function
- `addRule(regex, replacement)` - Adds custom parsing rules
- `extractCodeBlocks()` / `restoreCodeBlocks()` - Handles code block preservation during parsing
- `extractInlineCode()` / `restoreInlineCode()` - Handles inline code preservation

### Parsing Architecture

The parser uses a rule-based system with an array of regex patterns and replacements. Code blocks and inline code are extracted first to prevent markdown processing within them, then restored after all other rules are applied.

## Development Commands

### Testing
- `npm test` - Run AVA tests once (src/slimdown.test.ts)
- `npm run test:watch` - Run AVA test watcher for continuous testing
- Tests use AVA framework with TypeScript compilation

### Building  
- `npm run build` - Build using microbundle to generate multiple output formats
- `npm run clean` - Clean build artifacts and cache
- `npm start` - TypeScript watch mode compilation

### Publishing
- `npm run dry-run` - Test publish without actually publishing
- `npm run patch` - Clean, build, version patch, publish, and push with tags
- `npm run minor` - Clean, build, version minor, publish, and push with tags  
- `npm run major` - Clean, build, version major, publish, and push with tags

## Code Patterns

### Adding New Markdown Rules

Rules are stored in the `rules` array as tuples of `[RegExp, replacement, repeat?]`. Add new rules by pushing to this array or using the `addRule()` function:

```typescript
// Example: Convert :) to smiley image
addRule(/(\W)\:\)(\W)/g, '$1<img src="smiley.png" />$2');
```

### HTML Escaping

Use the `esc()` function for HTML entity escaping. Code blocks and inline code are automatically escaped when restored.

### Test Structure

Tests use a helper function `removeWhitespaces()` to normalize output for comparison. Each test follows the pattern:
- Define expected HTML output
- Call `render()` with markdown input  
- Compare normalized results

## Build Output

The build generates multiple formats via microbundle:
- CommonJS: `dist/slimdown.cjs`
- ES Module: `dist/slimdown.module.mjs` 
- Modern ES: `dist/slimdown.modern.mjs`
- UMD: `dist/slimdown.umd.js`
- TypeScript definitions: `dist/index.d.ts`