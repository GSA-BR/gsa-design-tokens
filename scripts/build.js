#!/usr/bin/env node

/**
 * GSA Design Tokens — Build Script
 *
 * Lê os arquivos de token em src/ e gera:
 *   build/css/   → CSS Custom Properties (variáveis CSS)
 *   build/json/  → JSON consolidado de todos os tokens
 *   build/blazor/→ Constantes C# para consumo em Blazor
 *
 * Uso:
 *   node scripts/build.js           → gera tudo
 *   node scripts/build.js --only css
 *   node scripts/build.js --only json
 *   node scripts/build.js --only blazor
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Caminhos ──────────────────────────────────────────────────────────────

const ROOT    = path.resolve(__dirname, '..');
const SRC     = path.join(ROOT, 'src');
const BUILD   = path.join(ROOT, 'build');
const CSS_DIR = path.join(BUILD, 'css');
const JSON_DIR= path.join(BUILD, 'json');
const BLZ_DIR = path.join(BUILD, 'blazor');

// ─── Utilitários ───────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Erro ao ler ${filePath}: ${err.message}`);
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
 * Achata um objeto aninhado em pares chave/valor com separador dado.
 * Ignora chaves que começam com '$' (metadados).
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
 * Converte nome de token para CSS Custom Property.
 * ex: "color.blue.50" → "--gsa-core-color-blue-50"
 */
function toCssVar(category, key) {
  const sanitized = key.replace(/\./g, '-');
  return `--gsa-${category}-${sanitized}`;
}

/**
 * Constrói um mapa de referências a partir dos tokens core.
 * Suporta dois formatos de referência:
 *   {core.color.blue.700}           → usa o caminho dentro dos dados
 *   {core.colors.color.blue.700}    → usa o nome do arquivo como prefixo
 */
function buildCoreRefMap(coreTokens) {
  const map = {};
  for (const { name, data } of coreTokens) {
    const flat = flatten(data, '', '.');
    for (const [key, value] of Object.entries(flat)) {
      // Formato curto: core.{caminho} — ex: core.color.blue.700
      map[`core.${key}`] = value;
      // Formato longo: core.{arquivo}.{caminho} — ex: core.colors.color.blue.700
      map[`core.${name}.${key}`] = value;
    }
  }
  return map;
}

/**
 * Resolve referências no formato {core.categoria.chave} dentro de um objeto de tokens.
 * Referências não encontradas são mantidas como estão (com aviso no console).
 */
function resolveRefs(obj, refMap) {
  const resolved = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      resolved[key] = value.replace(/\{([^}]+)\}/g, (match, ref) => {
        const dotRef = ref.replace(/-/g, '-');
        if (refMap[dotRef] !== undefined) return refMap[dotRef];
        console.warn(`  ⚠ Referência não resolvida: ${match}`);
        return match;
      });
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

/**
 * Converte nome de token para nome de constante C#.
 * ex: "blue-700" → "Blue700"
 * ex: "4"        → "Size4" (prefixo para identificadores numéricos)
 */
function toCsharpName(key) {
  const name = key
    .split(/[-.]/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  // Identificadores C# não podem começar com dígito
  return /^\d/.test(name) ? `Size${name}` : name;
}

// ─── Leitura dos tokens ────────────────────────────────────────────────────

function loadAllTokens() {
  const core     = readDir(path.join(SRC, 'core'));
  const semantic = readDir(path.join(SRC, 'semantic'));
  const themes   = readDir(path.join(SRC, 'themes'));
  const refMap   = buildCoreRefMap(core);
  return { core, semantic, themes, refMap };
}

// ─── Geração de CSS ────────────────────────────────────────────────────────

function buildCss(tokens) {
  ensureDir(CSS_DIR);

  const { core, semantic, themes, refMap } = tokens;

  // 1. tokens.core.css — variáveis core
  let coreLines = ['/**', ' * GSA Design Tokens — Core', ' * Gerado automaticamente. Não editar diretamente.', ' */', ':root {'];
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

  // 2. tokens.semantic.css — variáveis semânticas (referências resolvidas)
  let semLines = ['/**', ' * GSA Design Tokens — Semantic', ' * Gerado automaticamente. Não editar diretamente.', ' */', ':root {'];
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

  // 3. Um arquivo CSS por tema
  for (const { name, data } of themes) {
    const flat = flatten(data);
    const selector = `[data-theme="${name}"]`;
    let lines = [
      '/**',
      ` * GSA Design Tokens — Theme: ${name}`,
      ' * Gerado automaticamente. Não editar diretamente.',
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

  // 4. tokens.all.css — arquivo único com tudo
  const allFiles = [
    'tokens.core.css',
    'tokens.semantic.css',
    ...themes.map(t => `theme.${t.name}.css`)
  ];
  const allContent = [
    '/**',
    ' * GSA Design Tokens — Bundle completo',
    ' * Gerado automaticamente. Não editar diretamente.',
    ' */',
    ...allFiles.map(f => `@import url("./${f}");`)
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(CSS_DIR, 'tokens.all.css'), allContent);
  console.log('✔ build/css/tokens.all.css');
}

// ─── Geração de JSON ───────────────────────────────────────────────────────

function buildJson(tokens) {
  ensureDir(JSON_DIR);

  const { core, semantic, themes } = tokens;

  // JSON consolidado completo
  const consolidated = {
    $meta: {
      generated:  new Date().toISOString(),
      version:    '1.0.0',
      description:'GSA Design Tokens — Tokens consolidados do ecossistema GSA'
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

  // JSON achatado (flat) para consumo direto
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

// ─── Geração de Blazor ─────────────────────────────────────────────────────

function buildBlazor(tokens) {
  ensureDir(BLZ_DIR);

  const { core, themes } = tokens;

  // 1. GsaTokens.cs — constantes C# com valores dos tokens core
  let csLines = [
    '// GSA Design Tokens — Constantes C#',
    '// Gerado automaticamente. Não editar diretamente.',
    '',
    'namespace Gsa.DesignTokens;',
    '',
    '/// <summary>',
    '/// Tokens de design do ecossistema GSA.',
    '/// Use as constantes desta classe para referenciar valores de design de forma type-safe.',
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
      const escaped   = value.replace(/"/g, '\\"');
      csLines.push(`        public const string ${constName} = "${escaped}";`);
    }
    csLines.push('    }');
  }

  csLines.push('}');

  fs.writeFileSync(path.join(BLZ_DIR, 'GsaTokens.cs'), csLines.join('\n') + '\n');
  console.log('✔ build/blazor/GsaTokens.cs');

  // 2. GsaThemes.cs — enum de temas disponíveis
  const themeNames = themes.map(t => t.name);
  const enumLines = [
    '// GSA Design Tokens — Enum de Temas',
    '// Gerado automaticamente. Não editar diretamente.',
    '',
    'namespace Gsa.DesignTokens;',
    '',
    '/// <summary>',
    '/// Temas disponíveis no ecossistema GSA.',
    '/// Aplique o valor como atributo data-theme no elemento raiz da página.',
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
  enumLines.push('    /// <summary>Retorna o valor do atributo data-theme para o tema informado.</summary>');
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

  // 3. _gsa-tokens.scss — variáveis SCSS para consumo em projetos Blazor com estilos
  const scssLines = [
    '// GSA Design Tokens — Variáveis SCSS',
    '// Gerado automaticamente. Não editar diretamente.',
    '// Importar este arquivo antes de usar variáveis de design.',
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

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  const args   = process.argv.slice(2);
  const only   = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

  console.log('\n🔨 GSA Design Tokens — Build\n');

  const tokens = loadAllTokens();

  if (!only || only === 'css')    buildCss(tokens);
  if (!only || only === 'json')   buildJson(tokens);
  if (!only || only === 'blazor') buildBlazor(tokens);

  console.log('\n✅ Build concluído.\n');
}

main();
