# Testing

## Setup

- **Runner**: Vitest 4 (`vitest run` — non-watch)
- **Test location**: `test/unit/**/*.spec.ts`
- **Config**: `test/vitest.config.ts` (the `npm test` script passes `--config test/vitest.config.ts`)
- **Coverage provider**: `@vitest/coverage-v8`
- **Prerequisite**: nothing — no databases, no Docker, no fixtures. Just `npm install`.

## Running Tests

```bash
npm run test                        # run the full vitest suite
npm run test:coverage               # same, plus v8 coverage report → ./coverage/

# Single file / pattern — bypass the npm script and call vitest directly:
npx vitest run --config test/vitest.config.ts test/unit/module.spec.ts
npx vitest run --config test/vitest.config.ts -t "should merge arrays"
```

`npm test` sets `NODE_ENV=test` via `cross-env`. The `--config test/vitest.config.ts` flag is required because the config does **not** live at the repo root.

## Test Layers

The project has a **single layer**: unit tests. There are no integration tests, no e2e tests, and no infrastructure to spin up — the library has zero runtime dependencies, so every concern is exercised by importing the public API directly from `../../src`.

### Unit Tests

| Spec file                          | Covers                                                                 |
|------------------------------------|------------------------------------------------------------------------|
| `test/unit/module.spec.ts`         | `merge`, `createMerger`, priorities, arrays, cycles, strategy hook, prototype-pollution guard, `SyntaxError` on empty input |
| `test/unit/presets.spec.ts`        | `assign` preset                                                        |
| `test/unit/utils/array.spec.ts`    | `distinctArray` (primitives, objects, arrays, Date, RegExp, cycles)    |
| `test/unit/utils/clone.spec.ts`    | `polyfillClone` (objects and arrays with circular references)          |

Tests import from `../../src` (i.e. the unbuilt source), so there is no build step required before testing. They use only `describe`, `it`, and `expect` from `vitest`.

## Test Helpers & Fixtures

- There are **no shared test helpers, fakes, or fixtures**. Each spec sets up its own plain objects/arrays inline.
- `test/data/` exists but contains only a `.gitignore` placeholder — there is no fixture data to load.

## Testing Philosophy

Tests assert *expected* behavior based on the documented option semantics (see [Architecture](architecture.md) and the README option table) — not merely the current implementation. When a test fails, treat it as a real behavioral regression first; only "fix the test" once you've confirmed the underlying behavior change was intentional.

When adding a new feature or option:

1. Add a test under `test/unit/` mirroring the source location (e.g. a new util in `src/utils/foo.ts` → `test/unit/utils/foo.spec.ts`).
2. Cover the option's default, both explicit values (where applicable), interaction with `priority` / `arrayPriority`, and cycle behavior if the new code recurses.
3. Update the README option table and the `Options` JSDoc in `src/type.ts`.

### Mocking

There is nothing to mock — the library has no I/O, no globals it owns (it consults `globalThis.structuredClone`, but `clone()` is guarded by `/* istanbul ignore next */` because both code paths are exercised: `clone()` for the native path and `polyfillClone` directly for the fallback). Avoid introducing `vi.fn()` / `vi.mock()` unless a new boundary requires it.

## Code Coverage

```bash
npm run test:coverage      # writes lcov / html / json reports into ./coverage/
```

Coverage is gathered by `@vitest/coverage-v8`. The release workflow uploads `./coverage/` to Codecov (see `.github/workflows/release.yml`). There is no enforced coverage threshold configured at the moment; the goal is to keep `src/` fully covered minus the `/* istanbul ignore next */` blocks in `src/utils/clone.ts`.

## CI Pipeline

GitHub Actions (`.github/workflows/main.yml`) runs on push / PR against `develop`, `master`, `next`, `beta`, `alpha`. The job graph is:

```
install ──► build ──► lint
                 └──► tests   (runs `npm run test`)
```

All three downstream jobs reuse cached `node_modules` (keyed by `package.json` hash) and a cached `dist/` (keyed by commit SHA) — so the `tests` job runs against the freshly built artifacts, not source-level.

## Writing New Tests

1. Place the file in `test/unit/` (mirror the `src/` subdirectory for utils) with a `.spec.ts` extension.
2. Import from the **source barrel**: `import { ... } from '../../src';` — do not import from `dist/`.
3. Wrap with `describe('src/<path>', () => { ... })` to match the existing labeling style.
4. Run `npm run test` to verify; run `npm run lint` if you touched anything ESLint scans (it only scans `./src`, so test files are not linted by default).
