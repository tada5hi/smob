# Conventions

## Tooling

| Tool                                   | Purpose                                                              |
|----------------------------------------|----------------------------------------------------------------------|
| TypeScript 5 (`@tada5hi/tsconfig`)     | Type checking; emits `.d.ts` into `dist/` for the published bundle.  |
| Rollup 4 + `@swc/core`                 | Bundles `src/index.ts` to `dist/index.cjs` and `dist/index.mjs`.     |
| `@rollup/plugin-node-resolve`          | Allows Rollup to resolve relative imports across `src/`.             |
| Vitest 4                               | Test runner (config at `test/vitest.config.ts`).                     |
| ESLint 8 (`@tada5hi/eslint-config-typescript`) | Linting; scans `./src` only.                                 |
| Husky 9                                | Git hooks (currently only `commit-msg`).                             |
| commitlint + `@tada5hi/commitlint-config` | Validates Conventional Commits on every commit.                   |
| release-please                         | Automates version bumps, CHANGELOG, and GitHub releases.             |
| `workspaces-publish`                   | Publishes the package to npm from CI.                                |
| Codecov                                | Receives coverage upload from the release workflow.                  |

## Workflow

After making source changes:

1. `npm run build` if you touched anything in `src/` (especially before manually testing the dist output).
2. `npm run lint` (or `npm run lint:fix`) — ESLint scans only `./src`.
3. `npm run test` — Vitest runs against `src/` directly, no build needed for tests.
4. Commit with a Conventional Commits message (commitlint will reject otherwise).

There is no `prepare` build of the artifact at commit time; `prepublishOnly` runs the build right before `npm publish` (which only happens from CI).

## Code Style

- **Module format**: ESM source (`import`/`export`). The build produces dual CJS + ESM.
- **Indentation**: 4 spaces (enforced by `.editorconfig`). LF line endings, final newline, no trailing whitespace.
- **Linting**: extends `@tada5hi/eslint-config-typescript` with project-specific overrides in `.eslintrc`:
  - `class-methods-use-this`, `no-continue`, `no-shadow`, `no-use-before-define`, `no-useless-escape`, `no-nested-ternary` — **off**.
  - `@typescript-eslint/no-unused-vars`, `@typescript-eslint/no-use-before-define` — **off**.
  - `import/no-extraneous-dependencies` allows devDependencies in `test/**`, `*.spec.{js,ts}`, and `rollup.config.mjs`.
  - `**/dist/*` and `**/*.d.ts` are ignored.
- **Type-aware ESLint**: parses with `tsconfig.eslint.json` (covers `src/`, `test/`, `commitlint.config.js`, `rollup.config.mjs`).

## Naming Conventions

- **Type exports** live in `src/type.ts` and use `Options`, `Merger`, `Merger*` (`MergerSource`, `MergerResult`, `MergerContext`, `MergerSourceUnwrap`) — no `I`-prefix.
- **Predicates** are prefixed `is*` and return `item is T` where useful (`isObject`, `isSafeKey`, `isEqual`).
- **Builders** are prefixed `build*` (`buildOptions`); **togglers** are prefixed `toggle*` (`togglePriority`).
- **Factories** are prefixed `create*` (`createMerger`).
- **Files**: kebab-case is unused — all source files are single-word lowercase (`module.ts`, `presets.ts`, `array.ts`, etc.) sitting next to their barrel `index.ts`.

## File Organization

- `src/type.ts` is the single home for **all exported types**. Do not split types across multiple files unless they are unambiguously internal to one module.
- `src/utils/` is a flat directory of single-concern utility files plus an `index.ts` barrel that re-exports everything.
- Public API is **only** what `src/index.ts` re-exports — adding a new file under `src/` does not automatically expose it; it must be re-exported from a reachable barrel.

## Pre-commit Hooks

Husky runs **`commit-msg`** only (`.husky/commit-msg`):

1. `commitlint --edit` validates the commit message against `@tada5hi/commitlint-config`.

There is no `pre-commit` lint or test hook. Lint/test failures are caught in CI, not locally on commit.

## Commit Convention

Commits follow **Conventional Commits** (`@tada5hi/commitlint-config`). Format:

```
<type>(<optional scope>): <subject>

[optional body]

[optional footer]
```

Common types: `feat`, `fix`, `chore`, `build`, `ci`, `docs`, `refactor`, `test`. The Dependabot config also produces commits with `fix(<scope>)` and `build(<scope>)` prefixes — keep those conventions if you author similar changes manually.

**Do not** add `Co-Authored-By: Claude ...` (or any AI-attribution) trailers to commits in this repo.

## TypeScript

`tsconfig.json` extends `@tada5hi/tsconfig` with:

- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`
- `lib: ["ESNext", "DOM"]` (DOM is needed for `globalThis` typing in `src/utils/clone.ts`)
- `outDir: dist` — only `tsc --emitDeclarationOnly` runs against this config (Rollup handles JS emission via SWC).

`tsconfig.eslint.json` extends `tsconfig.json` and broadens `include` to cover tests and config files for type-aware lint rules.

## Build Output

`npm run build` produces, in `dist/`:

- `index.cjs` — CommonJS bundle (matches `package.json#main`).
- `index.mjs` — ES module bundle (matches `package.json#module`).
- `index.d.ts` (and supporting `.d.ts` files) — emitted by `tsc --emitDeclarationOnly`.
- `*.map` — sourcemaps for both bundles.

`dist/` is `.gitignore`d but listed in `package.json#files` so it ships to npm. Only `dist/` is published; everything else is excluded.

## Release Process

Fully automated via **release-please** (`.github/workflows/release.yml`):

1. Push to `master` triggers `googleapis/release-please-action@v4`.
2. release-please opens / updates a release PR that bumps `package.json`, updates `CHANGELOG.md`, and updates `.release-please-manifest.json` based on the Conventional Commits since the last release. `release-please-config.json` declares `release-type: node`, `bump-minor-pre-major: true`, `bump-patch-for-minor-pre-major: true`.
3. When that PR is merged, the workflow:
   - checks out, installs, builds
   - runs `npx workspaces-publish` (publishes to npm with provenance via `id-token: write`)
   - runs `npm run test:coverage`
   - uploads coverage to Codecov via `codecov/codecov-action@v4.1.1`.

**Do not manually edit** `package.json#version`, `CHANGELOG.md`, or `.release-please-manifest.json` — release-please owns them.

## CI/CD

Two GitHub Actions workflows:

- **`main.yml`** — runs on push/PR against `develop`, `master`, `next`, `beta`, `alpha`. Job graph: `install → build → {lint, tests}`. All jobs use the composite actions in `.github/actions/install` and `.github/actions/build`, with caching keyed by `package.json` hash and commit SHA respectively. Primary Node version: 22.
- **`release.yml`** — runs on push to `master` only. release-please is the gate; downstream steps run only if `releases_created == 'true'`. Node version for the release job: 20 (the project's minimum supported Node).

## Best Practices

- This is a **zero-runtime-dependency** library — adding any `dependencies` entry to `package.json` is a significant change. Default to writing the helper yourself in `src/utils/`.
- **Never bypass `isSafeKey()`** when iterating user-provided object keys; prototype pollution is the one security boundary the library defends.
- **Always reset `context.map`** between top-level merge steps in `baseMerger` (the existing code does this — preserve the pattern when modifying recursion).
- Keep `src/utils/clone.ts` engine guards (`/* istanbul ignore next */`) accurate: they're there because `structuredClone` availability differs across Node versions / browsers and the polyfill branch can't be hit in modern Node test envs.
- Public API changes (anything reachable from `src/index.ts`) need at minimum a `feat:` or `fix:` commit so release-please picks them up; breaking changes need a `!` or `BREAKING CHANGE:` footer.
- Match existing style: avoid `for...of`, prefer indexed `for` loops with `Object.keys()` (the merge hot path uses this for performance and to control iteration order). The existing code uses this pattern intentionally.
