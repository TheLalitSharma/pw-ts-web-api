import fs from 'fs';

export function readJson<T>(file: string): T {
  const txt = fs.readFileSync(file, 'utf-8');
  return JSON.parse(txt) as T;
}