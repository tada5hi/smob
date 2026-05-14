# Project Structure

`smob` is a single-package TypeScript library. There are no apps, no workspaces, and no internal packages — just `src/`, `test/`, and tooling configuration at the repo root.

## Directory Layout

```
smob/
├── src/                       # Library source (all public API re-exported via index.ts)
│   ├── index.ts               # Barrel: re-exports constants, module, utils, presets, type
│   ├── constants.ts           # PriorityName enum ('left' | 'right')
│   ├── module.ts              # baseMerger() recursion + createMerger() + default merge
│   ├── presets.ts             # assign() — Object.assign-style preset over createMerger
│   ├── type.ts                # All exported types (Options, Merger, MergerSource, etc.)
│   └── utils/
│       ├── index.ts           # Barrel for utils
│       ├── array.ts           # distinctArray()
│       ├── check.ts           # isObject(), isSafeKey(), isEqual()
│       ├── clone.ts           # clone() (structuredClone) + polyfillClone()
│       ├── object.ts          # hasOwnProperty() type guard
│       └── options.ts         # buildOptions(), togglePriority()
├── test/
│   ├── vitest.config.ts       # Vitest config (test files matched: test/unit/**/*.spec.ts)
│   ├── data/                  # Test fixture dir (currently only .gitignore)
│   └── unit/
│       ├── module.spec.ts     # Tests for createMerger / merge behavior
│       ├── presets.spec.ts    # Tests for assign()
│       └── utils/
│           ├── array.spec.ts  # Tests for distinctArray()
│           └── clone.spec.ts  # Tests for polyfillClone()
├── .github/
│   ├── workflows/             # main.yml (CI: install→build→lint+test), release.yml (release-please)
│   ├── actions/               # Composite actions: install, build
│   └── dependabot.yml
├── .husky/commit-msg          # Runs commitlint on every commit message
├── tsdown.config.ts           # tsdown bundle config (CJS + ESM, target es2022)
├── tsconfig.json              # tsconfig (extends @tada5hi/tsconfig; noEmit — tsdown handles emission)
├── eslint.config.js           # ESLint flat config (extends @tada5hi/eslint-config)
├── commitlint.config.mjs      # Extends @tada5hi/commitlint-config
├── release-please-config.json # release-please configuration
└── .release-please-manifest.json # Current released version (do not edit manually)
```

## Module Responsibilities

| Module                | Purpose                                                                                                  |
|-----------------------|----------------------------------------------------------------------------------------------------------|
| `src/index.ts`        | Public API barrel — anything not re-exported here is *not* public.                                       |
| `src/constants.ts`    | `PriorityName` enum used for `priority` / `arrayPriority` option values.                                 |
| `src/module.ts`       | Core algorithm: `baseMerger()` (recursive worker) and `createMerger()` factory. Exports default `merge`. |
| `src/presets.ts`      | `assign()` — preset using `createMerger({ inPlace: true, priority: 'left', array: false })`.             |
| `src/type.ts`         | All exported type definitions: `Options`, `OptionsInput`, `Merger`, `MergerSource`, `MergerResult`, `MergerContext`, `MergerSourceUnwrap`. |
| `src/utils/array.ts`  | `distinctArray()` — dedup an array using deep equality (`isEqual`).                                      |
| `src/utils/check.ts`  | Predicates: `isObject` (plain object guard), `isSafeKey` (prototype pollution guard), `isEqual` (deep). |
| `src/utils/clone.ts`  | `clone()` prefers `structuredClone` when available; `polyfillClone()` is the cycle-aware fallback.       |
| `src/utils/object.ts` | `hasOwnProperty()` typed wrapper around `Object.prototype.hasOwnProperty.call`.                          |
| `src/utils/options.ts`| `buildOptions()` fills defaults; `togglePriority()` flips `'left' <-> 'right'`.                          |

## Key Dependencies

There are **no production dependencies** (declared goal in the README and `package.json`). Only `devDependencies`:

| Dependency                          | Role                                                  |
|-------------------------------------|-------------------------------------------------------|
| `tsdown`                            | Bundles `src/index.ts` → `dist/index.{cjs,mjs}` + emits `dist/index.d.{cts,mts}` in a single pass (Rolldown + Oxc) |
| `typescript`                        | Type-checks source (`tsc --noEmit` via the IDE / editors); declaration emission is delegated to tsdown |
| `vitest` + `@vitest/coverage-v8`    | Test runner and coverage                              |
| `eslint` + `@tada5hi/eslint-config` + `typescript-eslint` | Linting (ESLint 10 flat config)    |
| `@tada5hi/tsconfig`                 | Base tsconfig                                         |
| `@tada5hi/commitlint-config` + `husky` | Conventional Commits enforcement                   |

## Package Exports

`package.json` defines a single public entry with conditional exports for ESM and CJS (each pinning its own `.d.mts` / `.d.cts` types):

```json
{
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.mts",
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  }
}
```

The barrel `src/index.ts` re-exports everything from `constants`, `module`, `utils`, `presets`, and `type`. Everything reachable from that barrel is considered public API — renaming or removing such an export is a breaking change.

## Separation of Concerns

- **Pure algorithm** → `src/module.ts` (`baseMerger`, `createMerger`).
- **Type contracts** → `src/type.ts` (no runtime code).
- **Option normalization** → `src/utils/options.ts`.
- **Object/array/equality primitives** → `src/utils/{check,array,object,clone}.ts`.
- **Convenience wrappers** over `createMerger` → `src/presets.ts`.
