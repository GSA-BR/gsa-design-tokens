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
 * The 3-layer token model (src/core, src/semantic, src/themes) stays alive in src/
 * as the future theming path, but is NOT built — the C#/SCSS/domain-theme outputs
 * were removed from the build (dormant train; resurrect via git history + panel
 * when real theming demand exists).
 *
 * Usage:
 *   node scripts/build.js             → emits build/css + build/json
 *   node scripts/build.js --validate  → parse/consistency checks only, no writes
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CANONICAL = path.join(ROOT, 'src', 'canonical', 'gsa-tokens.css');
const BUILD = path.join(ROOT, 'build');
const CSS_OUT = path.join(BUILD, 'css', 'gsa-tokens.css');
const JSON_OUT = path.join(BUILD, 'json', 'gsa-tokens.json');

const VAR_RE = /^\s*(--gsa-[a-z0-9-]+)\s*:\s*(.+?)\s*;\s*(?:\/\*.*\*\/\s*)?$/;

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function parseCanonical(css) {
  const tokens = {};
  const order = [];
  for (const line of css.split('\n')) {
    const m = line.match(VAR_RE);
    if (!m) continue;
    const [, name, value] = m;
    if (Object.prototype.hasOwnProperty.call(tokens, name)) {
      fail(`duplicate token in canonical source: ${name}`);
    }
    tokens[name] = value;
    order.push(name);
  }
  return { tokens, order };
}

function main() {
  const validateOnly = process.argv.includes('--validate');

  if (!fs.existsSync(CANONICAL)) fail(`canonical source missing: ${CANONICAL}`);
  const css = fs.readFileSync(CANONICAL, 'utf8');
  const { tokens, order } = parseCanonical(css);

  if (order.length === 0) fail('canonical source parsed to zero tokens');
  if (!css.includes(':root')) fail('canonical source has no :root block');

  // Unresolved var() references must point at tokens defined in the same file.
  for (const [name, value] of Object.entries(tokens)) {
    const refs = value.match(/var\((--gsa-[a-z0-9-]+)\)/g) || [];
    for (const ref of refs) {
      const target = ref.slice(4, -1);
      if (!Object.prototype.hasOwnProperty.call(tokens, target)) {
        fail(`token ${name} references undefined token ${target}`);
      }
    }
  }

  console.log(`Canonical source OK: ${order.length} tokens.`);
  if (validateOnly) return;

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
