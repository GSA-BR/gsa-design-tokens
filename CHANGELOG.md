# Changelog — gsa-design-tokens

All releases are protected tags (`v*`, immutable ruleset). A release job fails
without an entry here for the tag version (ADR-0020 D2 / Painel R-4).

## v2.0.0 — 2026-07-19

**Breaking (rationale — Painel #72 confirmação CA-7):** the re-aligned/pruned
source is breaking versus the `1.0.0` in `package.json`, which was **never
published nor consumed** by any real consumer — so the first real release
starts the canonical line at `v2.0.0`.

- **Canonical source (ADR-0020 D1):** `src/canonical/gsa-tokens.css` is now the
  single source of truth — the palette running in production (`gsa-iam` /
  `gsa-template-admin-blazor`), frozen **bit-for-bit** (114 tokens,
  `--gsa-color-primary-*` navy `#0a1628…#1e3a5f` + blue `#1d4ed8`/`#2563eb`).
  Known anomalies are documented in the README as **frozen legacy** — they are
  part of the canon, not bugs to fix silently.
- **Pruned build (ADR-0020 D2 / Painel P-4):** the build emits ONLY
  `build/css/gsa-tokens.css` (byte-identical copy — the diff-check anchor) and
  `build/json/gsa-tokens.json` (deterministic, for non-CSS consumers). Removed
  from the build: C# constants, SCSS, 6 domain themes, light/dark themes,
  core/semantic split CSS. The 3-layer model stays alive in `src/` as the
  future theming path (dormant — resurrect via git history + panel when real
  demand exists).
- **Reproducible build enforced:** CI fails if `build/` is not exactly the
  generated output (`git status --porcelain -- build/` — covers modifications,
  deletions and untracked extras). CODEOWNERS covers `src/` and `build/`.
- **Fail-closed hardening (Modo 1 review, 2ª família — EX-1..EX-4):** the
  parser aborts on any unrecognized `--gsa-` declaration (completeness check +
  `--self-test` negative fixtures); `build/` is recreated from scratch on every
  run; the CHANGELOG gate matches the tag **literally** (never as a regex);
  README operational sections rewritten to the pruned reality (dormant-train
  sections explicitly marked non-executable).
- **Release discipline:** tags `v*` are immutable (repo ruleset); the release
  job fails without a CHANGELOG entry for the tag version. No npm publishing —
  consumption is by pinned-tag raw fetch (diff-check in `gsa-ui-blazor`) and
  by the JSON artifact for non-Blazor stacks.
