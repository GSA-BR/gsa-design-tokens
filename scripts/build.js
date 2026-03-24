#!/usr/bin/env node

/**
 * GSA Design Tokens — Build Script
 *
 * Reads token files from src/ and generates:
 *   build/css/   → CSS Custom Properties
 *   build/json/  → Consolidated JSON of all tokens
 *   build/blazor/→ C# constants for Blazor consumption
 *
 * Usage:
 *   node scripts/build.js           → generates everything
 *   node scripts/build.js --only css
 *   node scripts/build.js --only json
 *   node scripts/build.js --only blazor
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Paths ──────────────────────────────────────────────────────────────

const ROOT    = path.resolve(__dirname, '..');
const SRC     = path.join(ROOT, 'src');
const BUILD   = path.join(ROOT, 'build');
const CSS_DIR = path.join(BUILD, 'css');
const JSON_DIR= path.join(BUILD, 'json');
const BLZ_DIR = path.join(BUILD, 'blazor');

// ─── Utilities ──────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

function readDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ name: path.basename(f, '.json'), data: readJson(path.join(dir, f)) }));
}

/**
 * Flattens a nested object into key/value pairs with the given separator.
 * Ignores keys starting with '$' (metadata).
 */
function flatten(obj, prefix = '', sep = '-') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const newKey = prefix ? `${prefix}${sep}${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey, sep));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

/**
 * Converts a token name to a CSS Custom Property.
 * e.g. "color.blue.50" → "--gsa-core-color-blue-50"
 */
function toCssVar(category, key) {
  const sanitized = key.replace(/\./g, '-');
  return `--gsa-${category}-${sanitized}`;
}

/**
 * Builds a reference map from core tokens.
 * Supports two reference formats:
 *   {core.color.blue.700}           → uses the path within the data
 *   {core.colors.color.blue.700}    → uses the filename as prefix
 */
function buildCoreRefMap(coreTokens) {
  const map = {};
  for (const { name, data } of coreTokens) {
    const flat = flatten(data, '', '.');
    for (const [key, value] of Object.entries(flat)) {
      // Short format: core.{path} — e.g. core.color.blue.700
      map[`core.${key}`] = value;
      // Long format: core.{file}.{path} — e.g. core.colors.color.blue.700
      map[`core.${name}.${key}`] = value;
    }
  }
  return map;
}

/**
 * Resolves references in the format {core.category.key} within a token object.
 * Unresolved references are kept as-is (with a console warning).
 */
function resolveRefs(obj, refMap) {
  const resolved = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      resolved[key] = value.replace(/\{([^}]+)\}/g, (match, ref) => {
        if (refMap[ref] !== undefined) return refMap[ref];
        console.warn(`  ⚠ Unresolved reference: ${match}`);
        return match;
      });
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

/**
 * Converts a token name to a C# constant name.
 * e.g. "blue-700" → "Blue700"
 * e.g. "4"        → "Size4" (prefix for numeric identifiers)
 */
function toCsharpName(key) {
  const name = key
    .split(/[-.]/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  // C# identifiers cannot start with a digit
  return /^\d/.test(name) ? `Size${name}` : name;
}

// ─── Token loading ──────────────────────────────────────────────────────

function loadAllTokens() {
  const core     = readDir(path.join(SRC, 'core'));
  const semantic = readDir(path.join(SRC, 'semantic'));
  const themes   = readDir(path.join(SRC, 'themes'));
  const refMap   = buildCoreRefMap(core);
  return { core, semantic, themes, refMap };
}

// ─── CSS generation ─────────────────────────────────────────────────────

function buildCss(tokens) {
  ensureDir(CSS_DIR);

  const { core, semantic, themes, refMap } = tokens;

  // 1. tokens.core.css — core variables
  let coreLines = ['/**', ' * GSA Design Tokens — Core', ' * Auto-generated. Do not edit directly.', ' */', ':root {'];
  for (const { name, data } of core) {
    coreLines.push(`\n  /* core / ${name} */`);
    const flat = flatten(data);
    for (const [key, value] of Object.entries(flat)) {
      coreLines.push(`  ${toCssVar(`core-${name}`, key)}: ${value};`);
    }
  }
  coreLines.push('}');
  fs.writeFileSync(path.join(CSS_DIR, 'tokens.core.css'), coreLines.join('\n') + '\n');
  console.log('✔ build/css/tokens.core.css');

  // 2. tokens.semantic.css — semantic variables (references resolved)
  let semLines = ['/**', ' * GSA Design Tokens — Semantic', ' * Auto-generated. Do not edit directly.', ' */', ':root {'];
  for (const { name, data } of semantic) {
    semLines.push(`\n  /* semantic / ${name} */`);
    const flat     = flatten(data);
    const resolved = resolveRefs(flat, refMap);
    for (const [key, value] of Object.entries(resolved)) {
      semLines.push(`  ${toCssVar(name, key)}: ${value};`);
    }
  }
  semLines.push('}');
  fs.writeFileSync(path.join(CSS_DIR, 'tokens.semantic.css'), semLines.join('\n') + '\n');
  console.log('✔ build/css/tokens.semantic.css');

  // 3. One CSS file per theme
  for (const { name, data } of themes) {
    const flat = flatten(data);
    const selector = `[data-theme="${name}"]`;
    let lines = [
      '/**',
      ` * GSA Design Tokens — Theme: ${name}`,
      ' * Auto-generated. Do not edit directly.',
      ' */',
      `${selector} {`
    ];
    for (const [key, value] of Object.entries(flat)) {
      lines.push(`  ${toCssVar('theme', key)}: ${value};`);
    }
    lines.push('}');
    fs.writeFileSync(path.join(CSS_DIR, `theme.${name}.css`), lines.join('\n') + '\n');
    console.log(`✔ build/css/theme.${name}.css`);
  }

  // 4. tokens.all.css — single file with everything
  const allFiles = [
    'tokens.core.css',
    'tokens.semantic.css',
    ...themes.map(t => `theme.${t.name}.css`)
  ];
  const allContent = [
    '/**',
    ' * GSA Design Tokens — Complete bundle',
    ' * Auto-generated. Do not edit directly.',
    ' */',
    ...allFiles.map(f => `@import url("./${f}");`)
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(CSS_DIR, 'tokens.all.css'), allContent);
  console.log('✔ build/css/tokens.all.css');
}

// ─── JSON generation ────────────────────────────────────────────────────

function buildJson(tokens) {
  ensureDir(JSON_DIR);

  const { core, semantic, themes } = tokens;

  // Consolidated JSON
  const consolidated = {
    $meta: {
      generated:  new Date().toISOString(),
      version:    '1.0.0',
      description:'GSA Design Tokens — Consolidated tokens for the GSA ecosystem'
    },
    core:     {},
    semantic: {},
    themes:   {}
  };

  for (const { name, data } of core) {
    consolidated.core[name] = data;
  }
  for (const { name, data } of semantic) {
    consolidated.semantic[name] = data;
  }
  for (const { name, data } of themes) {
    consolidated.themes[name] = data;
  }

  fs.writeFileSync(
    path.join(JSON_DIR, 'tokens.json'),
    JSON.stringify(consolidated, null, 2) + '\n'
  );
  console.log('✔ build/json/tokens.json');

  // Flat JSON for direct consumption
  const flat = {};
  for (const { name, data } of core) {
    const f = flatten(data);
    for (const [key, value] of Object.entries(f)) {
      flat[`core.${name}.${key}`] = value;
    }
  }
  for (const { name, data } of semantic) {
    const f = flatten(data);
    for (const [key, value] of Object.entries(f)) {
      flat[`semantic.${name}.${key}`] = value;
    }
  }
  for (const { name, data } of themes) {
    const f = flatten(data);
    for (const [key, value] of Object.entries(f)) {
      flat[`theme.${name}.${key}`] = value;
    }
  }

  fs.writeFileSync(
    path.join(JSON_DIR, 'tokens.flat.json'),
    JSON.stringify(flat, null, 2) + '\n'
  );
  console.log('✔ build/json/tokens.flat.json');
}

// ─── Blazor generation ──────────────────────────────────────────────────

function buildBlazor(tokens) {
  ensureDir(BLZ_DIR);

  const { core, themes } = tokens;

  // 1. GsaTokens.cs — C# constants with core token values
  let csLines = [
    '// GSA Design Tokens — C# Constants',
    '// Auto-generated. Do not edit directly.',
    '',
    'namespace Gsa.DesignTokens;',
    '',
    '/// <summary>',
    '/// Design tokens for the GSA ecosystem.',
    '/// Use these constants to reference design values in a type-safe manner.',
    '/// </summary>',
    'public static class GsaTokens',
    '{'
  ];

  for (const { name, data } of core) {
    const flat = flatten(data);
    csLines.push('');
    csLines.push(`    // ── ${name} ──`);
    csLines.push(`    public static class ${toCsharpName(name)}`);
    csLines.push('    {');
    for (const [key, value] of Object.entries(flat)) {
      const constName = toCsharpName(key);
      const escaped   = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      csLines.push(`        public const string ${constName} = "${escaped}";`);
    }
    csLines.push('    }');
  }

  csLines.push('}');

  fs.writeFileSync(path.join(BLZ_DIR, 'GsaTokens.cs'), csLines.join('\n') + '\n');
  console.log('✔ build/blazor/GsaTokens.cs');

  // 2. GsaThemes.cs — enum of available themes
  const themeNames = themes.map(t => t.name);
  const enumLines = [
    '// GSA Design Tokens — Theme Enum',
    '// Auto-generated. Do not edit directly.',
    '',
    'namespace Gsa.DesignTokens;',
    '',
    '/// <summary>',
    '/// Available themes in the GSA ecosystem.',
    '/// Apply the value as a data-theme attribute on the page root element.',
    '/// </summary>',
    'public enum GsaTheme',
    '{'
  ];
  for (const themeName of themeNames) {
    const enumName = toCsharpName(themeName);
    enumLines.push(`    /// <summary>${themeName}</summary>`);
    enumLines.push(`    ${enumName},`);
  }
  enumLines.push('}');
  enumLines.push('');
  enumLines.push('public static class GsaThemeExtensions');
  enumLines.push('{');
  enumLines.push('    /// <summary>Returns the data-theme attribute value for the given theme.</summary>');
  enumLines.push('    public static string ToDataAttribute(this GsaTheme theme) => theme switch');
  enumLines.push('    {');
  for (const themeName of themeNames) {
    const enumName = toCsharpName(themeName);
    enumLines.push(`        GsaTheme.${enumName} => "${themeName}",`);
  }
  enumLines.push('        _ => "gsa-light"');
  enumLines.push('    };');
  enumLines.push('}');

  fs.writeFileSync(path.join(BLZ_DIR, 'GsaThemes.cs'), enumLines.join('\n') + '\n');
  console.log('✔ build/blazor/GsaThemes.cs');

  // 3. _gsa-tokens.scss — SCSS variables for Blazor projects with styles
  const scssLines = [
    '// GSA Design Tokens — SCSS Variables',
    '// Auto-generated. Do not edit directly.',
    '// Import this file before using design variables.',
    ''
  ];
  for (const { name, data } of core) {
    const flat = flatten(data);
    scssLines.push(`// ── core / ${name} ──`);
    for (const [key, value] of Object.entries(flat)) {
      const varName = `$gsa-${name}-${key.replace(/\./g, '-')}`;
      scssLines.push(`${varName}: ${value};`);
    }
    scssLines.push('');
  }

  fs.writeFileSync(path.join(BLZ_DIR, '_gsa-tokens.scss'), scssLines.join('\n') + '\n');
  console.log('✔ build/blazor/_gsa-tokens.scss');
}

// ─── Validation ─────────────────────────────────────────────────────────

/**
 * Required directories and their minimum files.
 * The build fails if any of these are missing.
 */
const REQUIRED_STRUCTURE = {
  'src/core':     ['colors.json', 'typography.json', 'spacing.json', 'radius.json', 'shadow.json'],
  'src/semantic':  ['text.json', 'surface.json', 'border.json', 'action.json', 'status.json'],
  'src/themes':    ['gsa-light.json']
};

/**
 * Validates the directory structure, required files, and valid JSON.
 * Returns a list of errors. Empty list = all OK.
 */
function validate() {
  const errors = [];

  // 1. Check required directories and files
  for (const [dir, requiredFiles] of Object.entries(REQUIRED_STRUCTURE)) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) {
      errors.push(`Required directory not found: ${dir}/`);
      continue;
    }
    for (const file of requiredFiles) {
      const fullPath = path.join(fullDir, file);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Required file not found: ${dir}/${file}`);
      }
    }
  }

  // 2. Validate JSON in all source files
  const srcDirs = ['core', 'semantic', 'themes'];
  for (const sub of srcDirs) {
    const dir = path.join(SRC, sub);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        JSON.parse(raw);
      } catch (err) {
        errors.push(`Invalid JSON in src/${sub}/${file}: ${err.message}`);
      }
    }
  }

  return errors;
}

// ─── Main ───────────────────────────────────────────────────────────────

function main() {
  const args   = process.argv.slice(2);
  const only   = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
  const validateOnly = args.includes('--validate');

  console.log('\n🔨 GSA Design Tokens — Build\n');

  // Pre-build validation
  console.log('🔍 Validating token structure...');
  const errors = validate();
  if (errors.length > 0) {
    console.error('\n❌ Validation failed:\n');
    for (const err of errors) {
      console.error(`  • ${err}`);
    }
    console.error('');
    process.exit(1);
  }
  console.log('✔ Structure valid.\n');

  if (validateOnly) {
    console.log('✅ Validation completed successfully.\n');
    return;
  }

  const tokens = loadAllTokens();

  if (!only || only === 'css')    buildCss(tokens);
  if (!only || only === 'json')   buildJson(tokens);
  if (!only || only === 'blazor') buildBlazor(tokens);

  console.log('\n✅ Build completed.\n');
}

main();
