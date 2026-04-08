import { defineConfig } from 'tsup';
export default defineConfig({
    entry: { slimdown: 'src/index.ts' },
    format: ['cjs', 'esm', 'iife'],
    dts: false,
    sourcemap: true,
    clean: true,
    globalName: 'slimdown',
    outExtension({ format }) {
        if (format === 'cjs')
            return { js: '.cjs' };
        if (format === 'iife')
            return { js: '.umd.js' };
        return { js: '.mjs' };
    },
});
//# sourceMappingURL=tsup.config.js.map