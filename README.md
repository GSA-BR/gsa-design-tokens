# gsa-design-tokens

> **Fonte única, versionada e canônica dos design tokens oficiais do ecossistema GSA.**

[![Version](https://img.shields.io/badge/versão-1.0.0-blue)](#)
[![License](https://img.shields.io/badge/licença-MIT-green)](#)

---

## Sumário

- [Objetivo](#objetivo)
- [Princípios](#princípios)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Paleta de Cores](#paleta-de-cores)
- [Convenção de Nomenclatura](#convenção-de-nomenclatura)
- [Como Consumir os Tokens](#como-consumir-os-tokens)
  - [CSS Variables](#css-variables)
  - [JSON](#json)
  - [Blazor (C#)](#blazor-c)
- [Como Fazer o Build](#como-fazer-o-build)
- [Temas Disponíveis](#temas-disponíveis)
- [Como Evoluir os Tokens](#como-evoluir-os-tokens)
- [Tokens de Ambiente](#tokens-de-ambiente)
- [Decisões de Arquitetura](#decisões-de-arquitetura)

---

## Objetivo

Este repositório é a **fonte única da verdade** dos tokens visuais do ecossistema GSA. Ele define, versiona e distribui os tokens de design que serão consumidos por:

- **`gsa-ui-blazor`** — biblioteca de componentes Blazor
- **Templates oficiais** do ecossistema GSA
- **Futuras bibliotecas web** (React, Angular, Web Components)
- **Aplicações administrativas e operacionais** do ecossistema

O objetivo não é criar um tema solto, e sim uma **base visual reutilizável e governável** que transmita:

- Linguagem enterprise e operacional
- Excelência técnica e integração
- Visual limpo, moderno e consistente
- Confiabilidade e sobriedade corporativa

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
  GsaTokens.Colors.ColorBlue700
  GsaTokens.Spacing.Spacing4
  GsaTokens.Typography.FontSizeBase
```

---

## Como Consumir os Tokens

### CSS Variables

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

**Aplicar tema no HTML:**

```html
<html data-theme="gsa-light">
  <!-- ou -->
<html data-theme="gsa-dark">
  <!-- ou -->
<html data-theme="domain-auth">
```

**Usar as variáveis no CSS:**

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

.btn-primary {
  background-color: var(--gsa-theme-action-primary-bg);
  color: var(--gsa-theme-action-primary-text);
}

.btn-primary:hover {
  background-color: var(--gsa-theme-action-primary-bg-hover);
}
```

---

### JSON

**Consumir JSON consolidado (estrutura aninhada):**

```js
import tokens from 'path/to/build/json/tokens.json';

const blueBase = tokens.core.colors.color.blue[700]; // "#1D4ED8"
const textPrimary = tokens.themes['gsa-light'].text.primary; // "#0F172A"
```

**Consumir JSON achatado (chave direta):**

```js
import flat from 'path/to/build/json/tokens.flat.json';

const blue700 = flat['core.colors.color-blue-700']; // "#1D4ED8"
```

---

### Blazor (C#)

**1. Adicionar os arquivos `GsaTokens.cs` e `GsaThemes.cs` ao projeto.**

**2. Usar constantes de token em componentes Razor:**

```csharp
// Em um serviço ou componente
var primaryColor = GsaTokens.Colors.Blue700;   // "#1D4ED8"
var spacing4     = GsaTokens.Spacing.Size4;    // "1rem"
var radiusMd     = GsaTokens.Radius.Md;        // "0.375rem"
```

**3. Aplicar tema dinamicamente:**

```razor
@inject IThemeService ThemeService

<html data-theme="@ThemeService.Current.ToDataAttribute()">
  ...
</html>
```

```csharp
// Exemplo de uso do enum
var tema = GsaTheme.DomainAuth;
var atributo = tema.ToDataAttribute(); // "domain-auth"
```

**4. Para projetos com SCSS, importar as variáveis:**

```scss
@use 'path/to/build/blazor/gsa-tokens' as gsa;

.meu-botao {
  background-color: $gsa-colors-color-blue-700;
  padding: $gsa-spacing-spacing-4;
}
```

---

## Como Fazer o Build

**Pré-requisito:** Node.js 18 ou superior.

```bash
# Instalar dependências (nenhuma dependência externa necessária)
npm install

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

---

## Temas Disponíveis

| Tema              | Descrição                                    | Cor primária      |
|-------------------|----------------------------------------------|-------------------|
| `gsa-light`       | Tema claro padrão do ecossistema             | Azul corporativo  |
| `gsa-dark`        | Tema escuro para ambientes de baixa luz      | Azul sobre grafite|
| `domain-auth`     | Módulo de autenticação e autorização         | Azul profundo     |
| `domain-iam`      | Identity and Access Management               | Ciano corporativo |
| `domain-mdm`      | Master Data Management                       | Azul médio        |
| `domain-sgq`      | Sistema de Gestão da Qualidade               | Verde técnico     |
| `domain-ops`      | Operações e monitoramento                    | Grafite           |
| `domain-factory`  | Automação e manufatura                       | Âmbar industrial  |

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

## Como Evoluir os Tokens

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

### Versionamento

Este repositório segue **Semantic Versioning (semver)**:

- **PATCH** (`1.0.x`) — correções de valores sem quebra de compatibilidade
- **MINOR** (`1.x.0`) — adição de novos tokens, sem remoção
- **MAJOR** (`x.0.0`) — renomeação, remoção ou mudança de estrutura

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

