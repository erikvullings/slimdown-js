import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'iife',
      name: 'slimdown',
      sourcemap: true,
    },
  ],
  plugins: [
    // Compile TypeScript files
    typescript({
      exclude: [ "*.d.ts", "**/*.d.ts", "**/*.test.ts", "**/*.test.d.ts" ],
      rollupCommonJSResolveHack: true,
      // tsconfigOverride: { compilerOptions: { module: 'ES2015' } },
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    // commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    // resolve({
    //   customResolveOptions: {
    //     moduleDirectory: 'node_modules',
    //   },
    // }),
    // Resolve source maps to the original source
    sourceMaps(),
    // minifies generated bundles
    production && terser({ sourcemap: true }),
  ],
};
