import { readFileSync } from 'fs';

const contentFile = readFileSync('./src/app/i18n/content.ts', 'utf8');
// This is not standard JSON, so we can't parse it trivially.
// Let's just output it to a temporary CommonJS file and require it.
