// Builds src/i18n/strings.json (every English sentence the site shows) from
// t(), tn(), tr() and tx() calls, prunes stale keys from the language files,
// and reports what is still missing or unwrapped.
//   node scripts/i18n-extract.mjs            catalogue + coverage
//   node scripts/i18n-extract.mjs --leftover  also list JSX text not in t()
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "src";
const LANGS = ["dz", "hi", "ne"];
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mjs)$/.test(f) && !p.endsWith("lib/i18n.ts")) files.push(p);
  }
})(SRC);

// One JS string literal: "..." | '...' | `...` (no ${} allowed).
const LIT = String.raw`("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\`(?:[^\`\\$]|\\.)*\`)`;
const unquote = (q) =>
  q[0] === "`"
    ? q.slice(1, -1)
    : JSON.parse(q[0] === "'" ? `"${q.slice(1, -1).replace(/"/g, '\\"')}"` : q);

const found = new Map(); // text -> first file
const add = (s, f) => {
  if (s.trim() && !found.has(s)) found.set(s, f);
};
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(new RegExp(String.raw`\b(?:t|tr|tx)\(\s*` + LIT, "g")))
    add(unquote(m[1]), f);
  for (const m of src.matchAll(new RegExp(String.raw`\btn\([^,]+,\s*` + LIT + String.raw`\s*,\s*` + LIT, "g"))) {
    add(unquote(m[1]), f);
    add(unquote(m[2]), f);
  }
}

const strings = [...found.keys()].sort((a, b) => a.localeCompare(b));
writeFileSync(join(SRC, "i18n/strings.json"), JSON.stringify(strings, null, 2) + "\n");
console.log(`catalogue: ${strings.length} sentences from ${new Set(found.values()).size} files`);

const set = new Set(strings);
for (const l of LANGS) {
  const p = join(SRC, `i18n/${l}.json`);
  const d = JSON.parse(readFileSync(p, "utf8"));
  const kept = Object.fromEntries(Object.entries(d).filter(([k]) => set.has(k)));
  const missing = strings.filter((s) => !(s in kept));
  // Placeholders must survive translation: {name} in, {name} out.
  const broken = Object.entries(kept).filter(([k, v]) => {
    const ph = (x) => (x.match(/\{\w+\}/g) || []).sort().join();
    return ph(k) !== ph(v);
  });
  writeFileSync(p, JSON.stringify(kept, null, 2) + "\n");
  console.log(`${l}: ${Object.keys(kept).length} translated, ${missing.length} missing, ${broken.length} with changed placeholders`);
  if (process.argv.includes("--missing")) missing.forEach((s) => console.log(`  ${l} missing: ${s}`));
  broken.forEach(([k]) => console.log(`  ${l} placeholder mismatch: ${k}`));
}

if (process.argv.includes("--leftover")) {
  // Heuristic: capitalised words between > and < that are not inside {...}.
  let n = 0;
  for (const f of files.filter((f) => f.endsWith(".tsx"))) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/>\s*([A-Z][A-Za-z][^<>{}\n]{1,})\s*</g)) {
      console.log(`  leftover ${f}: ${m[1].trim()}`);
      n++;
    }
    for (const m of src.matchAll(/\b(?:placeholder|aria-label|alt|title)="([A-Za-z][^"]{2,})"/g)) {
      console.log(`  leftover attr ${f}: ${m[1]}`);
      n++;
    }
  }
  console.log(`leftover candidates: ${n}`);
}
