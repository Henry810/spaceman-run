/** Move inlined app script after #app so file:// and picky WebViews still boot. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'dist', 'index.html');

if (!existsSync(htmlPath)) {
  console.error('dist/index.html missing');
  process.exit(1);
}

let html = readFileSync(htmlPath, 'utf8');
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/i;
const match = html.match(scriptRe);
if (!match) {
  console.log('fix-html: no script tag, skip');
  process.exit(0);
}

const code = match[1];
html = html.replace(scriptRe, '');
html = html.replace(
  '<div id="app"></div>',
  `<div id="app"></div>
  <script>
${code}
  </script>`,
);

// Prefer classic script: more reliable in WeChat's in-app browser over https too
html = html.replace(/<script\s+type="module">/g, '<script>');

writeFileSync(htmlPath, html, 'utf8');
console.log('fix-html: script placed after #app');
