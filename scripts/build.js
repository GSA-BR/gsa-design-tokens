#!/usr/bin/env node

/**
 * GSA Design Tokens — Canonical Build (ADR-0020 D1/D2, issue #7)
 *
 * The canonical source of truth is `src/canonical/gsa-tokens.css` — the palette
 * running in production (gsa-iam / gsa-template-admin-blazor), frozen bit-for-bit
 * by ADR-0020 D1. Known anomalies are documented in the README as frozen legacy.
 *
 * The build emits ONLY the pruned output set (ADR-0020 D2 / Painel P-4):
 *   build/css/gsa-tokens.css   → verbatim copy of the canonical source (byte-identical)
 *   build/json/gsa-tokens.json → deterministic parse of the custom properties
 *                                (multi-stack consumption: web portals, Python UIs, LMS)
 *
 * build/ is recreated from scratch on every run — any extra artifact, tracked or
 * not, is wiped so the reproducibility gate (`git status --porcelain -- build/`)
 * proves the emitted set is EXACTLY these two files (review EX-2).
 *
 * The parser is fail-closed (review EX-1): every `--gsa-` custom-property
 * DEFINITION found in the source must be captured as a token — a declaration the
 * parser cannot fully recognize (e.g. missing trailing `;`) aborts the build
 * instead of being silently dropped from the JSON.
 *
 * The 3-layer token model (src/core, src/semantic, src/themes) stays alive in src/
 * as the future theming path, but is NOT built — the C#/SCSS/domain-theme outputs
 * were removed from the build (dormant train; resurrect via git history + panel
 * when real theming demand exists).
 *
 * Usage:
 *   node scripts/build.js             → emits build/css + build/json
 *   node scripts/build.js --validate  → parse/consistency checks only, no writes
 *   node scripts/build.js --self-test → run embedded negative/positive fixtures
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CANONICAL = path.join(ROOT, 'src', 'canonical', 'gsa-tokens.css');
const BUILD = path.join(ROOT, 'build');
const CSS_OUT = path.join(BUILD, 'css', 'gsa-tokens.css');
const JSON_OUT = path.join(BUILD, 'json', 'gsa-tokens.json');

// A full declaration: name, colon, value (may span lines), terminated by `;`.
const DECL_RE = /(--gsa-[a-z0-9-]+)\s*:\s*([^;{}]+);/g;
// Any place a --gsa-* custom property is DEFINED (name followed by `:`), as
// opposed to referenced via var(...). Used as the completeness oracle.
const DEF_RE = /(?:^|[{;\s])(--gsa-[a-z0-9-]+)\s*:/g;

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Fail-closed parse: returns {tokens, order} or throws with a precise reason.
 * Every definition matched by DEF_RE must be captured by DECL_RE — otherwise a
 * valid-but-unusual declaration (multiline, missing `;` before `}`) would be
 * copied to build/css yet silently missing from build/json.
 */
function parseCanonical(css) {
  const text = stripComments(css);

  const defined = [];
  for (const m of text.matchAll(DEF_RE)) defined.push(m[1]);

  const tokens = {};
  const order = [];
  for (const m of text.matchAll(DECL_RE)) {
    const name = m[1];
    const value = m[2].replace(/\s+/g, ' ').trim();
    if (Object.prototype.hasOwnProperty.call(tokens, name)) {
      throw new Error(`duplicate token in canonical source: ${name}`);
    }
    tokens[name] = value;
    order.push(name);
  }

  // Completeness: every definition found must have been parsed as a declaration.
  if (defined.length !== order.length) {
    const parsed = new Set(order);
    const missing = defined.filter((n, i) => defined.indexOf(n) === i && !parsed.has(n));
    throw new Error(
      `unrecognized --gsa- declaration(s): ${defined.length} definition(s) found but ` +
        `${order.length} parsed${missing.length ? ` — first unparsed: ${missing[0]}` : ''}. ` +
        'Every token must be a `--gsa-name: value;` declaration (trailing `;` required).'
    );
  }

  // Unresolved var() references must point at tokens defined in the same file.
  for (const [name, value] of Object.entries(tokens)) {
    const refs = value.match(/var\((--gsa-[a-z0-9-]+)\)/g) || [];
    for (const ref of refs) {
      const target = ref.slice(4, -1);
      if (!Object.prototype.hasOwnProperty.call(tokens, target)) {
        throw new Error(`token ${name} references undefined token ${target}`);
      }
    }
  }

  if (order.length === 0) throw new Error('canonical source parsed to zero tokens');
  return { tokens, order };
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function selfTest() {
  const cases = [
    {
      name: 'multiline declaration is parsed, not dropped (EX-1)',
      css: ':root {\n  --gsa-a: #fff;\n  --gsa-example:\n    #000;\n}\n',
      expect: (r) => r.order.length === 2 && r.tokens['--gsa-example'] === '#000',
    },
    {
      name: 'declaration without trailing `;` fails instead of vanishing (EX-1)',
      css: ':root {\n  --gsa-a: #fff;\n  --gsa-b: #000\n}\n',
      throws: /unrecognized --gsa- declaration/,
    },
    {
      name: 'duplicate token fails',
      css: ':root {\n  --gsa-a: #fff;\n  --gsa-a: #000;\n}\n',
      throws: /duplicate token/,
    },
    {
      name: 'orphan var() reference fails',
      css: ':root {\n  --gsa-a: var(--gsa-nope);\n}\n',
      throws: /undefined token/,
    },
    {
      name: 'commented-out declarations are ignored',
      css: ':root {\n  /* --gsa-old: #123; */\n  --gsa-a: #fff;\n}\n',
      expect: (r) => r.order.length === 1,
    },
  ];

  let failed = 0;
  for (const c of cases) {
    let result = null;
    let err = null;
    try {
      result = parseCanonical(c.css);
    } catch (e) {
      err = e;
    }
    const ok = c.throws
      ? err !== null && c.throws.test(err.message)
      : err === null && c.expect(result);
    console.log(`${ok ? 'PASS' : 'FAIL'}: ${c.name}${!ok && err ? ` (${err.message})` : ''}`);
    if (!ok) failed += 1;
  }
  if (failed > 0) fail(`${failed} self-test case(s) failed`);
  console.log('Self-test OK.');
}

function main() {
  if (process.argv.includes('--self-test')) return selfTest();

  const validateOnly = process.argv.includes('--validate');

  if (!fs.existsSync(CANONICAL)) fail(`canonical source missing: ${CANONICAL}`);
  const css = fs.readFileSync(CANONICAL, 'utf8');
  if (!css.includes(':root')) fail('canonical source has no :root block');

  let parsed;
  try {
    parsed = parseCanonical(css);
  } catch (e) {
    fail(e.message);
    return;
  }
  const { tokens, order } = parsed;

  console.log(`Canonical source OK: ${order.length} tokens.`);
  if (validateOnly) return;

  // Recreate build/ from scratch: the emitted set is EXACTLY the two artifacts
  // below — stale or foreign files do not survive a build (EX-2).
  fs.rmSync(BUILD, { recursive: true, force: true });

  // CSS: byte-identical copy of the canonical source (the diff-check anchor).
  fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
  fs.writeFileSync(CSS_OUT, css);

  // JSON: deterministic (source order preserved), for non-CSS consumers.
  fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
  const json = {
    $meta: {
      source: 'src/canonical/gsa-tokens.css',
      governedBy: 'ADR-0020 D1/D2 (gsa-docs)',
      note: 'Values frozen bit-for-bit to the production palette. Do not edit build/ by hand.',
    },
    tokens: Object.fromEntries(order.map((n) => [n, tokens[n]])),
  };
  fs.writeFileSync(JSON_OUT, JSON.stringify(json, null, 2) + '\n');

  console.log(`Wrote ${path.relative(ROOT, CSS_OUT)} (byte-identical to canonical source)`);
  console.log(`Wrote ${path.relative(ROOT, JSON_OUT)} (${order.length} tokens)`);
}

main();
