import { build } from 'esbuild';
await build({
  entryPoints: ['design/mockups/engine-entry.ts'],
  bundle: true,
  format: 'iife',
  globalName: 'PythielBundle',
  outfile: 'design/mockups/engine.bundle.js',
  target: ['es2020'],
  platform: 'browser',
  sourcemap: true,
  logLevel: 'info',
});
console.log('Bundle ready: design/mockups/engine.bundle.js');
