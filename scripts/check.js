'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const ignored = new Set(['node_modules', '.git', 'assets', 'server/data']);
const files = [];
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

walk(root);
let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed = true;
    console.error(`❌ ${path.relative(root, file)}\n${result.stderr}`);
  }
}
let inlineScripts = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const scriptSource = /<script\b([^>]*)>/gi;
  let sourceMatch;
  while ((sourceMatch = scriptSource.exec(html)) !== null) {
    const srcMatch = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(sourceMatch[1]);
    if (!srcMatch) continue;
    const source = srcMatch[1].replace(/[?#].*$/, '');
    if (/^(?:https?:|\/\/|data:)/i.test(source)) continue;
    const localPath = source.startsWith('/')
      ? path.resolve(root, source.replace(/^\/+/, ''))
      : path.resolve(path.dirname(file), source);
    if (!fs.existsSync(localPath)) {
      failed = true;
      console.error(`❌ ${path.relative(root, file)} référence un script absent : ${source}`);
    }
  }
  const apiIndex = html.indexOf('js/api.js');
  const progressIndex = html.indexOf('js/progress.js');
  const syncIndex = html.indexOf('js/progress-sync.js');
  const syncCount = (html.match(/<script\b[^>]*src=["'](?:\.\/)?js\/progress-sync\.js["']/gi) || []).length;
  if (progressIndex >= 0 && (syncIndex < 0 || syncIndex < progressIndex)) {
    failed = true;
    console.error(`❌ ${path.relative(root, file)} doit charger progress-sync.js après progress.js.`);
  }
  if (syncIndex >= 0 && (apiIndex < 0 || apiIndex > syncIndex)) {
    failed = true;
    console.error(`❌ ${path.relative(root, file)} doit charger api.js avant progress-sync.js.`);
  }
  if (syncCount > 1) {
    failed = true;
    console.error(`❌ ${path.relative(root, file)} charge progress-sync.js plusieurs fois.`);
  }
  const scriptTag = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match;
  let index = 0;
  while ((match = scriptTag.exec(html)) !== null) {
    index += 1;
    const attributes = match[1];
    if (/\bsrc\s*=/i.test(attributes)) continue;
    if (/\btype\s*=\s*["'](?:application\/json|application\/ld\+json|importmap)["']/i.test(attributes)) continue;
    inlineScripts += 1;
    try {
      new vm.Script(match[2], { filename: `${path.relative(root, file)}#inline-${index}` });
    } catch (error) {
      failed = true;
      console.error(`❌ ${path.relative(root, file)} (script inline ${index})\n${error.message}`);
    }
  }
}
if (failed) process.exit(1);
console.log(`✅ ${files.length} fichiers JavaScript, ${inlineScripts} scripts inline et références HTML valides.`);
