import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distHtml = join(root, 'dist', 'index.html');
const outDir = join(root, 'release');
/** ASCII name — Windows cmd .bat cannot reliably open Chinese filenames */
const outName = 'spaceman-run.html';
const outHtml = join(outDir, outName);

if (!existsSync(distHtml)) {
  console.error('Missing dist/index.html — run build first.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

let html = readFileSync(distHtml, 'utf8');

// Classic <script> in <head> runs before #app exists (modules are deferred).
// Move the bundle to end of <body> so file:// works on desktop browsers.
const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/i;
const scriptMatch = html.match(scriptRe);
if (!scriptMatch) {
  console.error('No script tag found in dist/index.html');
  process.exit(1);
}
const code = scriptMatch[1];
html = html.replace(scriptRe, '');
if (!html.includes('</body>')) {
  console.error('No </body> in dist/index.html');
  process.exit(1);
}
html = html.replace(
  '<div id="app"></div>',
  `<div id="app">
      <p style="padding:24px;color:#f5f0d8;text-align:center;line-height:1.7;max-width:28em;margin:20vh auto 0">
        正在加载…<br/><br/>
        若一直停在本页：请用 <b>Chrome / Edge / Safari</b> 打开本文件。<br/>
        不要用微信聊天窗口预览；可点「用浏览器打开」或「其他应用打开」。
      </p>
    </div>`,
);

html = html.replace(
  '</body>',
  `  <noscript>
    <p style="padding:24px;color:#f5f0d8;text-align:center;line-height:1.7;max-width:28em;margin:20vh auto 0">
      当前窗口没有运行 JavaScript（常见于微信内置预览）。<br/><br/>
      请用 <b>Chrome / Edge / Safari</b> 打开 spaceman-run.html，<br/>
      或在微信里选「用浏览器打开 / 其他应用打开」。
    </p>
  </noscript>
  <script>
${code}
  </script>
  </body>`,
);

writeFileSync(outHtml, html, 'utf8');

writeFileSync(
  join(outDir, '打开说明.txt'),
  [
    '太空人快跑 — 演示包',
    '',
    '【重要】不要用微信聊天窗口直接预览 html',
    '微信内置预览 / 文件查看器通常不执行游戏脚本，所以只会看到深色背景。',
    '请用下面任一方式打开：',
    '',
    'Windows',
    '1. 双击 spaceman-run.html（用 Chrome / Edge）',
    '2. 或双击 打开游戏.bat',
    '3. 若从微信收到：先「用其他应用打开」→ 选 Chrome / Edge',
    '',
    'Mac',
    '1. 双击 spaceman-run.html（Safari / Chrome）',
    '2. 或双击 打开游戏.command',
    '',
    '安卓手机',
    '1. 用 Chrome 打开本地文件（文件管理器 → 用 Chrome 打开）',
    '2. 从微信接收时：右上角 ··· → 用浏览器打开 / 其他应用打开 → Chrome',
    '3. 不要停留在微信内置页面里玩',
    '',
    '说明',
    '- 无需 Node / npm',
    '- 存档用浏览器本地存储；若环境禁止存储，仍可玩，只是刷新可能丢进度',
    '- 发给投资人更稳妥的方式是部署成 https 链接（微信里点链接即可）',
    '',
  ].join('\n'),
  'utf8',
);

writeFileSync(
  join(outDir, '打开游戏.bat'),
  '@echo off\r\nstart "" "%~dp0spaceman-run.html"\r\n',
  'utf8',
);

writeFileSync(
  join(outDir, '打开游戏.command'),
  ['#!/bin/bash', 'cd "$(dirname "$0")"', 'open "spaceman-run.html"', ''].join(
    '\n',
  ),
  'utf8',
);

console.log(`Share pack ready: ${outDir}`);
console.log(`  - ${outName} (${(html.length / 1024).toFixed(1)} KB)`);
console.log('  - 打开说明.txt');
console.log('  - 打开游戏.bat / 打开游戏.command');
