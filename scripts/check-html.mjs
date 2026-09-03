import { readFileSync, writeFileSync } from 'node:fs';

const h = readFileSync('release/spaceman-run.html', 'utf8');
console.log('len', h.length);
const body = h.indexOf('<body>');
const app = h.indexOf('id="app"');
const scr = h.lastIndexOf('<script>');
console.log({ body, app, scr, orderOk: body < app && app < scr });
console.log('tail:\n', h.slice(-200));
console.log('script open count', (h.match(/<script/g) || []).length);
console.log('script close count', (h.match(/<\/script>/g) || []).length);
const start = h.lastIndexOf('<script>');
const end = h.lastIndexOf('</script>');
const code = h.slice(start + '<script>'.length, end);
try {
  new Function(code);
  console.log('Function ctor ok');
} catch (e) {
  console.log('Function ctor fail', e.message);
}
