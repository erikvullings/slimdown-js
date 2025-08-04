# Usage Examples

## CommonJS (Node.js)

```javascript
const { render, addRule } = require('slimdown-js');

// Basic usage
const html = render('# Hello World\n\nThis is **bold** text.');
console.log(html);

// Math support
const mathHtml = render('Einstein discovered $E = mc^2$ in 1905.');
console.log(mathHtml);

// Task lists
const taskHtml = render(`
- [x] Complete Phase 1
- [ ] Work on Phase 2
`);
console.log(taskHtml);
```

## ES Modules (Modern Node.js / Browser)

```javascript
import { render, addRule } from 'slimdown-js';

// Basic usage
const html = render('# Hello World\n\nThis is **bold** text.');
console.log(html);

// Enhanced tables with caption
const tableHtml = render(`
[Sales Data]
| Product | Q1 || | Q2 |
|---------|-----|-----|
| Widget  | $1000 | $1200 |
`);
console.log(tableHtml);
```

## TypeScript

```typescript
import { render, addRule, RegexReplacer } from 'slimdown-js';

// Type-safe usage
const markdown: string = '# TypeScript Example\n\nWith **type safety**!';
const html: string = render(markdown);

// Custom rule with proper typing
const customRule: RegexReplacer = (match: string, ...args: any[]) => {
  return `<custom>${args[0]}</custom>`;
};

addRule(/\{\{(.*?)\}\}/g, customRule);
```

## Browser (UMD)

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/slimdown-js/dist/slimdown.umd.js"></script>
</head>
<body>
    <div id="output"></div>
    <script>
        const markdown = `
# Browser Example

Math: $E = mc^2$

Tasks:
- [x] Load library
- [x] Render markdown
- [ ] Style the output
        `;
        
        document.getElementById('output').innerHTML = SlimdownJs.render(markdown);
    </script>
</body>
</html>
```

## Advanced Usage

### Custom Rules

```javascript
import { render, addRule } from 'slimdown-js';

// Add highlight syntax
addRule(/==(.*?)==/g, '<mark>$1</mark>');

// Add custom containers
addRule(/:::(\w+)\n([\s\S]*?)\n:::/g, '<div class="$1">$2</div>');

const markdown = `
==Highlighted text==

:::warning
This is a warning box
:::
`;

console.log(render(markdown));
```

### Configuration Options

```javascript
import { render } from 'slimdown-js';

const markdown = 'Visit [my site](https://example.com)';

// Remove paragraph wrappers
const noPara = render(markdown, true);

// Open links in new tabs
const externalLinks = render(markdown, false, true);

// Both options
const customized = render(markdown, true, true);
```