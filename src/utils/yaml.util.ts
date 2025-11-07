import { parse } from 'yaml';
import fs from 'fs';

export function readYaml<T>(file: string): T {
  const txt = fs.readFileSync(file, 'utf-8');
  return parse(txt) as T;
}