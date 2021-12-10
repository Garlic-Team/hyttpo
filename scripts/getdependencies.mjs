import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf-8'));

const dependencies = Object.keys(packageJson.devDependencies);

console.log(dependencies.map(d => d).join(' '))