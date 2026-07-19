# gsa-design-tokens

> **Canonical standards:** [gsa-docs](https://github.com/GSA-BR/gsa-docs) · [Constitution](https://github.com/GSA-BR/gsa-docs/tree/main/constitution) · [Standards](https://github.com/GSA-BR/gsa-docs/tree/main/standards)

> **Fonte única, versionada e canônica dos design tokens oficiais do ecossistema GSA.**

[![Version](https://img.shields.io/badge/versão-2.0.0-blue)](#)
[![License](https://img.shields.io/badge/licença-interna-gray)](#)

---

## ⚓ Cânone vigente (ADR-0020 — leia antes de tudo)

> **Fonte canônica:** `src/canonical/gsa-tokens.css` — a paleta **em produção**
> (`gsa-iam` / `gsa-template-admin-blazor`), congelada **bit a bit** pelo ADR-0020 D1
> (gsa-docs). O build emite **apenas** `build/css/gsa-tokens.css` (cópia byte-idêntica —
> âncora do diff-check dos consumidores) e `build/json/gsa-tokens.json` (consumo
> multi-stack). Release = **tag protegida `v*` + entrada no CHANGELOG** (sem npm).
> CI exige build reprodutível (`git diff --exit-code -- build/`).
>
> **Trem dormente:** as seções deste README que descrevem saídas C#/Blazor, SCSS e os
> 6 temas de domínio referem-se ao modelo de 3 camadas que **permanece vivo em `src/`**
> como caminho de theming futuro, mas **fora do build** (ADR-0020 D2 / Painel P-4).
> Ressuscitar = histórico git + painel, quando houver demanda real.

### Legado congelado (anomalias documentadas — ADR-0020 D1)

Estas características da paleta são **anomalias conhecidas, congeladas como parte do
cânone** — não são bugs a corrigir silenciosamente; mudá-las é mudança visual (painel +
MAJOR na lib consumidora):

| Anomalia | Detalhe |
|---|---|
| `--gsa-color-primary-950` mais **clara** que a 900 | `#0c1929` (950) vs `#0a1628` (900) — a escala não é monotônica no extremo escuro |
| `--gsa-color-primary-accent` duplica a 500 | ambas `#1d4ed8` — o accent não é um matiz próprio |
| Salto de matiz na rampa | 900–600 são **navy** dessaturado (`#0a1628…#1e3a5f`); 500–50 saltam para **azul** saturado (`#1d4ed8`, `#2563eb`, …) — duas famílias de matiz numa escala só |
| `--gsa-sidebar-bg-dark` é claro | `#f8fafc` — o sufixo `-dark` não corresponde a um tema escuro (não há dark theme no cânone) |

---

## Sumário

- [Objetivo](#objetivo)
- [Quem Consome este Repositório](#quem-consome-este-repositório)
- [O que é OBRIGATÓRIO](#o-que-é-obrigatório)
- [O que é PROIBIDO](#o-que-é-proibido)
- [Princípios](#princípios)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Paleta de Cores](#paleta-de-cores)
- [Convenção de Nomenclatura](#convenção-de-nomenclatura)
- [Como Fazer o Build](#como-fazer-o-build)
- [Como Consumir em CSS](#como-consumir-em-css)
- [Como Consumir em Blazor](#como-consumir-em-blazor)
- [Como Consumir via JSON](#como-consumir-via-json)
- [Exemplos Reais de Consumo](#exemplos-reais-de-consumo)
- [Temas Disponíveis](#temas-disponíveis)
- [Tokens de Ambiente](#tokens-de-ambiente)
- [Política de Versionamento](#política-de-versionamento)
- [Política de Evolução de Tokens](#política-de-evolução-de-tokens)
- [Fluxo para Propor Novos Tokens](#fluxo-para-propor-novos-tokens)
- [Decisões de Arquitetura](#decisões-de-arquitetura)

---

## Objetivo

Este repositório é a **fonte única da verdade** dos tokens visuais do ecossistema GSA. Ele define, versiona e distribui os tokens de design que serão consumidos por todas as aplicações e bibliotecas do ecossistema.

O objetivo não é criar um tema solto, e sim uma **base visual reutilizável e governável** que transmita:

- Linguagem enterprise e operacional
- Excelência técnica e integração
- Visual limpo, moderno e consistente
- Confiabilidade e sobriedade corporativa

---

## Quem Consome este Repositório

| Consumidor | Como consome | Artefato utilizado |
|---|---|---|
| **`gsa-ui-blazor`** | Importa `GsaTokens.cs`, `GsaThemes.cs` e `_gsa-tokens.scss` | `build/blazor/` |
| **Templates oficiais GSA** | Importa CSS via `tokens.all.css` | `build/css/` |
| **Futuras bibliotecas web** (React, Angular, Web Components) | CSS Custom Properties ou JSON | `build/css/` ou `build/json/` |
| **Aplicações administrativas** do ecossistema | CSS Custom Properties com tema de domínio | `build/css/theme.domain-*.css` |

---

## O que é OBRIGATÓRIO

- Todo valor visual (cor, espaçamento, tipografia, sombra, etc.) **deve** ser definido como token neste repositório.
- Consumidores **devem** usar os artefatos gerados em `build/` — nunca copiar valores manualmente.
- Toda alteração de token **deve** passar por PR com revisão.
- O build **deve** passar sem erros antes de qualquer merge.
- Tokens semânticos **devem** referenciar valores core — nunca valores arbitrários.
- Temas de domínio **devem** estender `gsa-light` e funcionar como sotaques visuais, não identidades independentes.
- O versionamento **deve** seguir Semantic Versioning (semver).

## O que é PROIBIDO

- **Não** defina cores, espaçamentos ou tipografias diretamente em componentes, CSS ou código de aplicação.
- **Não** edite arquivos em `build/` diretamente — eles são regenerados a cada build.
- **Não** renomeie ou remova tokens sem incrementar a versão MAJOR.
- **Não** introduza dependências externas no build (o script roda com Node.js puro).
- **Não** crie temas de domínio que descaracterizem a identidade visual GSA.
- **Não** use valores core diretamente em componentes — use tokens semânticos ou de tema.

---

## Princípios

1. **Fonte única** — nenhum valor visual arbitrário deve existir fora deste repositório
2. **Separação clara** entre tokens `core`, `semantic` e `themes`
3. **Agnóstico de framework** — gera saídas consumíveis por qualquer tecnologia
4. **Simples e escalável** — estrutura fácil de entender, evoluir e governar
5. **Tudo real e utilizável** — sem estruturas vazias ou sugestões incompletas

---

## Arquitetura

```
core → semantic → themes
```

### Core
Valores brutos e primitivos. Não possuem semântica de uso — são a paleta base.
- Exemplos: `#1D4ED8`, `1rem`, `0.375rem`, `200ms`

### Semantic
Tokens com propósito de uso definido. Referenciam valores do `core`.
- Exemplos: "cor de texto primário", "superfície do sidebar", "borda de foco"

### Themes
Conjuntos de sobrescrita semântica para contextos específicos. Cada tema aplica valores adequados ao seu domínio.
- Exemplos: `gsa-light`, `gsa-dark`, `domain-auth`, `domain-iam`

---

## Estrutura de Pastas

```
gsa-design-tokens/
├── src/                        # Fonte dos tokens (editar aqui)
│   ├── core/                   # Tokens primitivos
│   │   ├── colors.json         # Paleta completa de cores
│   │   ├── typography.json     # Fontes, tamanhos, pesos, line-height
│   │   ├── spacing.json        # Escala de espaçamento
│   │   ├── radius.json         # Escala de border-radius
│   │   ├── shadow.json         # Escala de box-shadow
│   │   ├── breakpoints.json    # Pontos de corte responsivos
│   │   ├── motion.json         # Durações e curvas de animação
│   │   └── sizing.json         # Ícones, alturas de componente, z-index
│   ├── semantic/               # Tokens com propósito de uso
│   │   ├── text.json           # Cores de texto
│   │   ├── surface.json        # Backgrounds e superfícies
│   │   ├── border.json         # Bordas e foco
│   │   ├── action.json         # Botões e elementos interativos
│   │   ├── status.json         # Feedback visual (sucesso, erro, etc.)
│   │   └── environment.json    # Indicadores de ambiente (dev, hml, prod)
│   └── themes/                 # Temas por contexto
│       ├── gsa-light.json      # Tema claro padrão
│       ├── gsa-dark.json       # Tema escuro
│       ├── domain-auth.json    # Domínio: Autenticação
│       ├── domain-iam.json     # Domínio: IAM
│       ├── domain-mdm.json     # Domínio: MDM
│       ├── domain-sgq.json     # Domínio: SGQ
│       ├── domain-ops.json     # Domínio: Operações
│       └── domain-factory.json # Domínio: Factory
├── build/                      # Artefatos gerados (não editar)
│   ├── css/                    # CSS Custom Properties
│   │   ├── tokens.core.css     # Variáveis core
│   │   ├── tokens.semantic.css # Variáveis semânticas
│   │   ├── theme.gsa-light.css # Tema claro
│   │   ├── theme.gsa-dark.css  # Tema escuro
│   │   ├── theme.domain-*.css  # Temas de domínio
│   │   └── tokens.all.css      # Bundle com @import de todos os arquivos
│   ├── json/                   # JSON consolidado
│   │   ├── tokens.json         # Estrutura completa aninhada
│   │   └── tokens.flat.json    # Estrutura achatada (chave → valor)
│   └── blazor/                 # Artefatos para Blazor
│       ├── GsaTokens.cs        # Constantes C# dos tokens core
│       ├── GsaThemes.cs        # Enum e extensões dos temas
│       └── _gsa-tokens.scss    # Variáveis SCSS para projetos Blazor
├── scripts/
│   └── build.js                # Script de geração dos artefatos
├── package.json
└── README.md
```

---

## Paleta de Cores

A paleta GSA foi definida para transmitir **estética industrial-tech**, enterprise e sóbria:

| Papel                    | Cor Base        | Uso                                          |
|--------------------------|-----------------|----------------------------------------------|
| **Azul profundo**        | `blue-700–950`  | Primário corporativo, ações principais       |
| **Grafite / Cinzas**     | `gray-50–950`   | Neutros, textos, superfícies, bordas         |
| **Ciano frio**           | `cyan-500–800`  | Destaque técnico, ambiente dev, IAM          |
| **Verde técnico**        | `green-500–800` | Sucesso, SGQ, confirmações                   |
| **Âmbar industrial**     | `amber-500–800` | Atenção, ambiente HML/STG, Factory           |
| **Vermelho limpo**       | `red-500–800`   | Erro, destructive, alertas críticos          |

Cada cor possui escala de **50 a 950** (11 tons), permitindo flexibilidade total de uso.

---

## Convenção de Nomenclatura

### Tokens em JSON (source)

```
{categoria}.{subcategoria}.{variante}

Exemplos:
  color.blue.700
  font.size.base
  spacing.4
  radius.md
```

### CSS Custom Properties (geradas)

```
--gsa-core-{arquivo}-{caminho}    → tokens core
--gsa-{categoria}-{caminho}       → tokens semânticos
--gsa-theme-{caminho}             → tokens de tema (aplicados via data-theme)

Exemplos:
  --gsa-core-colors-blue-700        → cor blue-700 da paleta core
  --gsa-core-radius-md              → border-radius médio
  --gsa-core-spacing-4              → espaçamento 4 (1rem)
  --gsa-text-primary                → cor de texto primário (semântico)
  --gsa-surface-sidebar             → cor do sidebar (semântico)
  --gsa-theme-text-primary          → texto primário do tema ativo
  --gsa-theme-action-primary-bg     → background do botão primário no tema ativo
```

### Constantes C# (geradas)

```csharp
GsaTokens.{Categoria}.{CaminhoEmPascalCase}

Exemplos:
  GsaTokens.Colors.Blue700
  GsaTokens.Spacing.Size4
  GsaTokens.Typography.SizeBase
```

---

## Como Fazer o Build

**Pré-requisito:** Node.js 18 ou superior.

```bash
# Instalar dependências (nenhuma dependência externa necessária)
npm install

# Validar estrutura de tokens (sem gerar artefatos)
npm run validate

# Gerar todos os artefatos
npm run build

# Gerar apenas CSS
npm run build:css

# Gerar apenas JSON
npm run build:json

# Gerar apenas artefatos Blazor
npm run build:blazor
```

Os artefatos são gerados em `build/`. **Não edite arquivos em `build/` diretamente** — eles são regenerados a cada build.

O build valida automaticamente:
- Existência dos diretórios obrigatórios (`src/core/`, `src/semantic/`, `src/themes/`)
- Existência dos arquivos obrigatórios de cada camada
- Validade do JSON em todos os arquivos-fonte
- Falha com mensagens claras caso alguma categoria crítica esteja ausente

---

## Como Consumir em CSS

### Importar tokens

**Opção 1 — Bundle completo (recomendado):**

```html
<link rel="stylesheet" href="path/to/build/css/tokens.all.css" />
```

**Opção 2 — Importar individualmente:**

```html
<link rel="stylesheet" href="path/to/build/css/tokens.core.css" />
<link rel="stylesheet" href="path/to/build/css/tokens.semantic.css" />
<link rel="stylesheet" href="path/to/build/css/theme.gsa-light.css" />
```

### Aplicar tema no HTML

```html
<html data-theme="gsa-light">
  <!-- ou -->
<html data-theme="gsa-dark">
  <!-- ou tema de domínio -->
<html data-theme="domain-auth">
```

### Usar variáveis no CSS

```css
.meu-componente {
  color: var(--gsa-theme-text-primary);
  background-color: var(--gsa-theme-surface-card);
  border: 1px solid var(--gsa-theme-border-default);
  border-radius: var(--gsa-core-radius-md);
  padding: var(--gsa-core-spacing-4);
  font-size: var(--gsa-core-typography-size-base);
  transition: background-color var(--gsa-core-motion-duration-normal)
              var(--gsa-core-motion-easing-ease-in-out);
}
```

### Usar variáveis em SCSS

```scss
// Arquivo: meu-componente.scss
.card {
  background: var(--gsa-theme-surface-card);
  border: 1px solid var(--gsa-theme-border-default);
  border-radius: var(--gsa-core-radius-md);
  padding: var(--gsa-core-spacing-4);
  box-shadow: var(--gsa-core-shadow-sm);

  &__title {
    color: var(--gsa-theme-text-primary);
    font-size: var(--gsa-core-typography-size-lg);
    font-weight: var(--gsa-core-typography-weight-semibold);
  }

  &__body {
    color: var(--gsa-theme-text-secondary);
    font-size: var(--gsa-core-typography-size-base);
  }
}
```

---

## Como Consumir em Blazor

### 1. Adicionar os arquivos gerados ao projeto

Copie os arquivos de `build/blazor/` para o projeto `gsa-ui-blazor`:
- `GsaTokens.cs` — constantes de todos os tokens core
- `GsaThemes.cs` — enum de temas + extensão `ToDataAttribute()`
- `_gsa-tokens.scss` — variáveis SCSS para uso em estilos isolados

### 2. Usar constantes de token em componentes

```csharp
// Referenciando valores de token no C#
var primaryColor = GsaTokens.Colors.Blue700;   // "#1D4ED8"
var spacing      = GsaTokens.Spacing.Size4;    // "1rem"
var radius       = GsaTokens.Radius.Md;        // "0.375rem"
```

### 3. Aplicar tema dinamicamente

```razor
@inject IThemeService ThemeService

<html data-theme="@ThemeService.Current.ToDataAttribute()">
  ...
</html>
```

```csharp
// Trocar tema em runtime
var tema = GsaTheme.DomainAuth;
var atributo = tema.ToDataAttribute(); // "domain-auth"
```

### 4. Usar variáveis SCSS em componentes Blazor

```scss
@use 'path/to/build/blazor/gsa-tokens' as gsa;

.meu-botao {
  background-color: $gsa-colors-blue-700;
  padding: $gsa-spacing-4;
}
```

---

## Como Consumir via JSON

**Consumir JSON consolidado (estrutura aninhada):**

```js
import tokens from 'path/to/build/json/tokens.json';

const blueBase = tokens.core.colors.blue[700]; // "#1D4ED8"
const textPrimary = tokens.themes['gsa-light'].text.primary; // "#0F172A"
```

**Consumir JSON achatado (chave direta):**

```js
import flat from 'path/to/build/json/tokens.flat.json';

const blue700 = flat['core.colors.blue-700']; // "#1D4ED8"
```

---

## Exemplos Reais de Consumo

### Botão primário em CSS

```css
.btn-primary {
  background-color: var(--gsa-theme-action-primary-bg);
  color: var(--gsa-theme-action-primary-text);
  border: none;
  border-radius: var(--gsa-core-radius-md);
  padding: var(--gsa-core-spacing-2) var(--gsa-core-spacing-4);
  font-size: var(--gsa-core-typography-size-sm);
  font-weight: var(--gsa-core-typography-weight-medium);
  cursor: pointer;
  transition: background-color var(--gsa-core-motion-duration-fast)
              var(--gsa-core-motion-easing-ease-in-out);
}

.btn-primary:hover {
  background-color: var(--gsa-theme-action-primary-bg-hover);
}

.btn-primary:active {
  background-color: var(--gsa-theme-action-primary-bg-active);
}

.btn-primary:disabled {
  background-color: var(--gsa-theme-action-primary-bg-disabled);
  color: var(--gsa-theme-action-primary-text-disabled);
  cursor: not-allowed;
}
```

### Alerta de status em CSS

```css
.alert {
  padding: var(--gsa-core-spacing-3) var(--gsa-core-spacing-4);
  border-radius: var(--gsa-core-radius-md);
  font-size: var(--gsa-core-typography-size-sm);
}

.alert--success {
  background-color: var(--gsa-theme-status-success-bg);
  color: var(--gsa-theme-status-success-text);
  border: 1px solid var(--gsa-theme-status-success-border);
}

.alert--error {
  background-color: var(--gsa-theme-status-error-bg);
  color: var(--gsa-theme-status-error-text);
  border: 1px solid var(--gsa-theme-status-error-border);
}
```

### Tema por domínio — mesma aplicação, visual diferente

```html
<!-- Aplicação do módulo Auth -->
<html data-theme="domain-auth">
  <body>
    <aside class="sidebar"><!-- sidebar com identidade Auth --></aside>
    <main><!-- conteúdo usa o mesmo design system --></main>
  </body>
</html>

<!-- Aplicação do módulo SGQ -->
<html data-theme="domain-sgq">
  <body>
    <aside class="sidebar"><!-- sidebar com identidade SGQ --></aside>
    <main><!-- mesmo layout, apenas cores de destaque mudam --></main>
  </body>
</html>
```

```css
/* O CSS é o mesmo — o tema controla as cores automaticamente */
.sidebar {
  background-color: var(--gsa-theme-surface-sidebar);
  color: var(--gsa-theme-text-inverse);
}

.sidebar__item--active {
  background-color: var(--gsa-theme-surface-sidebar-active);
}
```

### Componente Blazor com tokens

```razor
@* Componente GsaButton.razor *@
<button class="btn-primary" data-theme="@Theme.ToDataAttribute()">
  @ChildContent
</button>

@code {
    [Parameter] public GsaTheme Theme { get; set; } = GsaTheme.GsaLight;
    [Parameter] public RenderFragment? ChildContent { get; set; }
}
```

---

## Temas Disponíveis

| Tema              | Descrição                                    | Cor primária      | Papel no ecossistema |
|-------------------|----------------------------------------------|-------------------|----------------------|
| `gsa-light`       | Tema claro padrão do ecossistema             | Azul corporativo  | Base obrigatória     |
| `gsa-dark`        | Tema escuro para ambientes de baixa luz      | Azul sobre grafite| Alternativa de luminosidade |
| `domain-auth`     | Módulo de autenticação e autorização         | Azul profundo     | Sotaque de domínio   |
| `domain-iam`      | Identity and Access Management               | Ciano corporativo | Sotaque de domínio   |
| `domain-mdm`      | Master Data Management                       | Azul médio        | Sotaque de domínio   |
| `domain-sgq`      | Sistema de Gestão da Qualidade               | Verde técnico     | Sotaque de domínio   |
| `domain-ops`      | Operações e monitoramento                    | Grafite           | Sotaque de domínio   |
| `domain-factory`  | Automação e manufatura                       | Âmbar industrial  | Sotaque de domínio   |

> **Importante:** Os temas de domínio funcionam como **sotaques visuais** — alteram sidebar, header e ação primária, mas preservam a identidade base do GSA (textos, bordas, superfícies). Eles **não** são identidades visuais independentes.

---

## Tokens de Ambiente

Os tokens de ambiente permitem que a interface comunique claramente em qual contexto o sistema está rodando:

| Ambiente | Visual          | `label` | Uso                              |
|----------|-----------------|---------|----------------------------------|
| `dev`    | Ciano técnico   | `DEV`   | Ambiente local de desenvolvimento |
| `hml`    | Âmbar industrial| `HML`   | Homologação                       |
| `stg`    | Âmbar escuro    | `STG`   | Staging / pré-produção            |
| `prod`   | Grafite sóbrio  | `PROD`  | Produção (sem indicador de alerta)|

**Exemplo de uso:**

```css
.env-badge {
  background-color: var(--gsa-environment-dev-badge);
  color: var(--gsa-environment-dev-text);
}
.env-badge::after {
  content: var(--gsa-environment-dev-label);
}
```

---

## Política de Versionamento

Este repositório segue **Semantic Versioning (semver)** rigorosamente:

| Tipo de mudança | Versão | Exemplo | Impacto |
|---|---|---|---|
| **MAJOR** (`x.0.0`) | Mudança incompatível | Renomear `text.primary` → `text.main` | Quebra consumidores |
| **MINOR** (`1.x.0`) | Adição compatível | Novo token `text.caption` | Nenhuma quebra |
| **PATCH** (`1.0.x`) | Correção de valor | Ajustar `#1D4ED8` → `#1E4FD9` | Nenhuma quebra |

### Regras de compatibilidade

- **Nunca remova** um token existente sem incrementar MAJOR.
- **Nunca renomeie** um token sem incrementar MAJOR.
- **Adição** de tokens novos é sempre MINOR.
- **Alteração de valor** sem mudança de nome ou remoção é PATCH.
- Adição de novo tema de domínio é MINOR.

### Como consumidores devem tratar upgrades

| Tipo | `gsa-ui-blazor` deve | Ação necessária |
|---|---|---|
| PATCH | Atualizar livremente | Nenhuma |
| MINOR | Atualizar livremente | Nenhuma (tokens novos são opcionais) |
| MAJOR | Atualizar com cautela | Revisar changelog, adaptar referências removidas/renomeadas |

> **Recomendação:** `gsa-ui-blazor` deve fixar a dependência em `~1.x` (aceitar MINOR/PATCH, travar MAJOR).

---

## Política de Evolução de Tokens

### Adicionar um novo token core

1. Edite o arquivo correspondente em `src/core/` (ex: `src/core/colors.json`)
2. Adicione o novo valor seguindo a convenção de nomenclatura
3. Execute `npm run build`
4. Verifique os artefatos gerados em `build/`

### Adicionar um novo token semântico

1. Edite o arquivo correspondente em `src/semantic/` (ex: `src/semantic/text.json`)
2. Referencie um valor core usando a sintaxe `{core.categoria.chave}`
3. Execute `npm run build`

### Criar um novo tema de domínio

1. Crie um arquivo `src/themes/domain-{nome}.json`
2. Defina apenas os tokens que diferem do tema base `gsa-light`
3. Execute `npm run build`
4. O novo tema estará disponível automaticamente

**Exemplo de novo tema:**

```json
{
  "$description": "Tema do domínio XYZ.",
  "$name": "domain-xyz",
  "$type": "light",
  "$extends": "gsa-light",
  "surface": {
    "sidebar": "#1C1917",
    "sidebar-active": "#EA580C",
    "header": "#1C1917"
  },
  "action": {
    "primary-bg": "#EA580C",
    "primary-bg-hover": "#C2410C"
  },
  "brand": {
    "primary": "#1C1917",
    "secondary": "#EA580C",
    "accent": "#FB923C",
    "name": "XYZ"
  }
}
```

### Categorias futuras planejadas

As seguintes categorias semânticas poderão ser adicionadas em versões futuras (MINOR), conforme demanda dos consumidores:

| Categoria | Propósito | Status |
|---|---|---|
| `focus` | Tokens de foco e acessibilidade | Parcialmente coberto em `border.json` |
| `interactive` | Estados de elementos interativos genéricos | Parcialmente coberto em `action.json` |
| `overlay` | Tokens de sobreposição e modais | Parcialmente coberto em `surface.json` |

> **Nota:** Novas categorias só devem ser criadas quando houver demanda real de ao menos um consumidor. Não inflar o MVP com estruturas vazias.

---

## Fluxo para Propor Novos Tokens

1. **Abra uma issue** descrevendo o token necessário, sua categoria e justificativa de uso
2. **Discuta** com a equipe de arquitetura — validar se o token é semântico e reutilizável
3. **Implemente** a alteração em um branch separado (`feat/token-nome`)
4. **Execute** `npm run build` e verifique os artefatos gerados
5. **Abra um PR** com:
   - Descrição clara do token adicionado
   - Categoria (core/semantic/theme)
   - Consumidores esperados
   - Tipo de versionamento (MINOR para adição, PATCH para ajuste)
6. **Revisão** por pelo menos um membro da equipe de arquitetura
7. **Merge** após aprovação — versão é atualizada conforme semver

---

## Decisões de Arquitetura

### Por que JSON como formato fonte?

JSON é legível, sem dependências, suportado nativamente em Node.js e editável por qualquer ferramenta. Não requer compilação para inspecionar os valores.

### Por que o build script é simples e sem dependências externas?

Para garantir que qualquer desenvolvedor possa rodar `node scripts/build.js` sem precisar instalar pacotes. Zero dependências de produção, zero risco de supply-chain.

### Por que CSS Custom Properties e não SCSS/Less?

CSS Custom Properties funcionam em runtime, permitindo troca de tema sem recarregar a página. São suportadas nativamente em todos os browsers modernos, inclusive WebView do Blazor WebAssembly e Blazor Server.

### Por que temas via `data-theme` e não via classes?

O atributo `data-theme` é semânticamente correto para este uso, não conflita com classes CSS de outros frameworks, e é fácil de aplicar no elemento raiz do documento.

### Por que tokens de ambiente são separados?

Ambientes (dev/hml/prod) têm um ciclo de vida diferente dos tokens de UI. Eles não variam por tema — variam pelo contexto de execução. Mantê-los separados evita acoplamento.

---

*Mantido pela equipe de arquitetura do ecossistema GSA.*

