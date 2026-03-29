import { build } from 'esbuild';

await build({
  entryPoints: ['src/player.jsx'],
  bundle: true,
  outfile: '../scripts/remotion-player.js',
  format: 'iife',
  minify: true,
  target: 'es2020',
  jsx: 'automatic',
  jsxImportSource: 'react',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  loader: {
    '.jsx': 'jsx',
  },
});

console.log('Built remotion-player.js');
