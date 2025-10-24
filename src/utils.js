import { statSync } from 'fs';

export const ReleaseJsonFiles = ['package.json', 'deno.json', 'jsr.json'];

export const isFile = (filePath) => statSync(filePath).isFile();

export const contentLength = (filePath) => statSync(filePath).size;

export const DefaultReleaseTypes = [
  'major',
  'minor',
  'patch',
  'prerelease',
  'premajor',
  'preminor',
  'prepatch',
];

export const error = (err) => (err instanceof Error ? err.message : err);
