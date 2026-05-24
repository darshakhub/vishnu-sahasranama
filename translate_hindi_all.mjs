import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.join(__dirname, 'vishnu_sahasranama.html');
const CACHE_PATH = path.join(__dirname, '.hindi_translate_cache.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escJs(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c > 127) out += '\\u' + c.toString(16).padStart(4, '0');
    else if (c === 0x22) out += '\\"';
    else if (c === 0x5c) out += '\\\\';
    else if (c === 0x0a) out += '\\n';
    else if (c === 0x0d) {
      // skip
    } else out += s[i];
  }
  return out;
}

async function translateEnToHi(text, cache) {
  const src = (text || '').trim();
  if (!src) return '';
  if (cache[src]) return cache[src];

  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=' + encodeURIComponent(src);

  let lastErr = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const translated = Array.isArray(data?.[0])
        ? data[0].map((x) => (Array.isArray(x) ? x[0] : '')).join('')
        : '';
      if (!translated) throw new Error('Empty translation payload');
      cache[src] = translated;
      return translated;
    } catch (err) {
      lastErr = err;
      await sleep(300 * attempt);
    }
  }

  throw new Error('Translation failed: ' + (lastErr?.message || 'unknown'));
}

function loadShlokas(html) {
  const start = html.indexOf('const SHLOKAS = [');
  const runtime = html.indexOf('let sidebarShlokas', start);
  const end = html.lastIndexOf('];', runtime);
  if (start < 0 || runtime < 0 || end < 0) throw new Error('Could not locate SHLOKAS block');

  const before = html.slice(0, start);
  const arrayJs = html.slice(start, end + 2);
  const after = html.slice(end + 2);

  const code = arrayJs.replace('const SHLOKAS', 'var SHLOKAS');
  const shlokas = new Function(code + '\nreturn SHLOKAS;')();
  return { before, after, shlokas };
}

function buildHindiBlock(entry, t) {
  const labels = {
    meaning: 'सम्पूर्ण अर्थ',
    forKids: 'बच्चों के लिए',
    yogic: 'योगिक अर्थ',
    spiritual: 'आध्यात्मिक गहराई',
    pauranic: 'पौराणिक कथा',
    philosophical: 'दर्शन',
  };

  let out = '';
  out += (entry.devanagari || '');
  out += '\n' + labels.meaning + '\n' + (t.meaning || '');
  out += '\n' + labels.forKids + '\n' + (t.forKids || '');
  out += '\n' + labels.yogic + '\n' + (t.yogic || '');
  out += '\n' + labels.spiritual + '\n' + (t.spiritual || '');
  out += '\n' + labels.pauranic + '\n' + (t.pauranic || '');
  out += '\n' + labels.philosophical + '\n' + (t.philosophical || '');
  return out;
}

function renderShlokas(shlokas) {
  let s = 'const SHLOKAS = [\n';
  for (const e of shlokas) {
    s += '  {\n';
    s += `    num: ${e.num},\n`;
    s += `    devanagari: "${escJs(e.devanagari || '')}",\n`;
    s += `    transliteration: "${escJs(e.transliteration || '')}",\n`;
    s += `    meaning: "${escJs(e.meaning || '')}",\n`;
    s += '    words: [],\n';
    s += `    spiritual: "${escJs(e.spiritual || '')}",\n`;
    s += `    yogic: "${escJs(e.yogic || '')}",\n`;
    s += `    pauranic: "${escJs(e.pauranic || '')}",\n`;
    s += `    philosophical: "${escJs(e.philosophical || '')}",\n`;
    s += `    forKids: "${escJs(e.forKids || '')}",\n`;
    s += `    gujarati: "${escJs(e.gujarati || '')}",\n`;
    s += `    hindi: "${escJs(e.hindi || '')}",\n`;
    s += '  },\n';
  }
  s += '];\n';
  return s;
}

async function main() {
  const html = readFileSync(HTML_PATH, 'utf8');
  const { before, after, shlokas } = loadShlokas(html);

  const cache = existsSync(CACHE_PATH)
    ? JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
    : {};

  const unique = new Set();
  for (const e of shlokas) {
    ['meaning', 'forKids', 'yogic', 'spiritual', 'pauranic', 'philosophical'].forEach((k) => {
      const v = (e[k] || '').trim();
      if (v) unique.add(v);
    });
  }

  console.log('Unique English text blocks to translate:', unique.size);
  let done = 0;
  for (const text of unique) {
    if (!cache[text]) {
      await translateEnToHi(text, cache);
      await sleep(120);
    }
    done++;
    if (done % 25 === 0 || done === unique.size) {
      console.log('Progress:', done + '/' + unique.size);
      writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
    }
  }

  for (const e of shlokas) {
    const t = {
      meaning: cache[(e.meaning || '').trim()] || e.meaning || '',
      forKids: cache[(e.forKids || '').trim()] || e.forKids || '',
      yogic: cache[(e.yogic || '').trim()] || e.yogic || '',
      spiritual: cache[(e.spiritual || '').trim()] || e.spiritual || '',
      pauranic: cache[(e.pauranic || '').trim()] || e.pauranic || '',
      philosophical: cache[(e.philosophical || '').trim()] || e.philosophical || '',
    };
    e.hindi = buildHindiBlock(e, t);
  }

  const newHtml = before + renderShlokas(shlokas) + after;
  writeFileSync(HTML_PATH, newHtml, 'utf8');
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');

  console.log('Hindi translation update complete. Entries:', shlokas.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
