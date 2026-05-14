<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

# smob — Agent Guide

`smob` is a zero-dependency TypeScript library for safe, customizable merging of objects and arrays. It exposes a default `merge` function plus a `createMerger` factory that returns mergers configured with options (priority, array handling, in-place vs cloned, custom strategies). The library is published as both CJS and ESM with bundled type declarations.

## Quick Reference

```bash
# Setup
npm install

# Development
npm run build              # build:types (tsc --noEmit typecheck) + build:js (tsdown bundle + d.ts emit)
npm run build:types        # tsc — typecheck only (noEmit)
npm run build:js           # tsdown — emit dist/index.{cjs,mjs,d.cts,d.mts}
npm run test               # vitest --run
npm run test:coverage      # vitest --run --coverage (v8)
npm run lint               # eslint (flat config)
npm run lint:fix           # eslint --fix
```

- **Node.js**: `>=20.0.0`
- **Package manager**: npm (lockfile checked in)
- **Build tool**: [tsdown](https://tsdown.dev) (Rolldown + Oxc — bundles JS and emits types in one pass; targets `es2022`)
- **Test runner**: Vitest 4
- **Linter**: ESLint 10 with flat config (`@tada5hi/eslint-config`)
- **Module format**: ESM source (`"type": "module"`), dual CJS/ESM build output

## Package Surface

This is a single-package library, not a monorepo. The published package exports a single entry point:

| Export    | File          |
|-----------|---------------|
| `import`  | `dist/index.mjs` (ESM) |
| `require` | `dist/index.cjs` (CJS) |
| `types`   | `dist/index.d.mts` (ESM) / `dist/index.d.cts` (CJS) |

Everything re-exported from `src/index.ts` is public API. There is no CLI and no documentation site.

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Directory layout, module responsibilities, public API surface
- **[Architecture](.agents/architecture.md)** — Recursive merger algorithm, priority/cycle handling, custom strategies
- **[Testing](.agents/testing.md)** — Vitest setup, where unit specs live, coverage
- **[Conventions](.agents/conventions.md)** — Code style, ESLint, Conventional Commits, release-please, CI

## Commits

- Commit messages MUST follow Conventional Commits (enforced by commitlint via husky `commit-msg` hook). See [Conventions → Commit Convention](.agents/conventions.md#commit-convention).
- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
- Releases are automated by release-please on pushes to `master`; do not manually bump `version` in `package.json` or edit `CHANGELOG.md` / `.release-please-manifest.json`.
