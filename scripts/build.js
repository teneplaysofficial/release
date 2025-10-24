import { rm } from 'fs/promises';
import { join } from 'path';
import { build } from 'esbuild';

try {
  await rm(join(process.cwd(), 'dist'), { recursive: true });
} catch {
  //
}

await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  minify: true,
  bundle: true,
});
