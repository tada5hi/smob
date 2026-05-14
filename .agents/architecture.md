# Architecture

## Overview

`smob` implements a **recursive, options-driven merge algorithm** over plain objects and arrays. The shape is:

```
createMerger(input?: OptionsInput) -> Merger
   ↓
Merger(...sources) -> MergerResult
   ↓ (sets up MergerContext: normalized options + WeakMap cycle guard)
baseMerger(ctx, ...sources) -> recursive worker
```

There is no class hierarchy and no dependency injection — the only "layer" is the boundary between the public `createMerger`/`merge` API and the internal `baseMerger` recursion. Everything is pure functions over the `MergerContext` value.

## Core Design Decisions

### 1. Reduce arity by two each recursion

`baseMerger` takes a variadic source list and consumes **two** at a time (a `target` and a `source`), then recurses with the merged result back into the source list. Direction of consumption depends on `priority`:

- `priority: 'left'`  → `shift()` two from the front, recurse with `(merged, ...rest)`.
- `priority: 'right'` → `pop()` two from the end, recurse with `(...rest, merged)`.

Recursion terminates when only one source remains; it is returned (with an optional `distinctArray` pass if it's an array and `arrayDistinct: true`).

### 2. Separate `priority` from `arrayPriority`

Object merge direction and array merge direction can be configured independently:

- `priority` controls how *objects* are folded.
- `arrayPriority` controls how *arrays* are folded; defaults to `priority` if unspecified.

When the *first and last* sources are both arrays, `priority` is overridden by `arrayPriority` at the top of `baseMerger`. When merging two arrays under conflicting priorities at a nested key, the array priority is **toggled** (see `togglePriority` in `src/utils/options.ts`) so the user's intent for the *outer* fold is preserved at the inner level.

### 3. Cycle protection via `WeakMap`

`MergerContext.map: WeakMap<any, any>` records sources that have already been recursed into. When a circular reference is encountered (`context.map.has(source[key])`), the algorithm degrades gracefully: it copies any *new* keys from the cycle target onto the result and stops recursing. After each top-level merge step completes, the map is reset to a fresh `WeakMap`.

### 4. Prototype pollution guard

Keys `'__proto__'`, `'prototype'`, and `'constructor'` are filtered via `isSafeKey()` in `src/utils/check.ts` before any property assignment. This is non-negotiable — any new write path that copies keys must call `isSafeKey()` first.

### 5. Three input mutation modes

`createMerger` chooses one of three pre-merge transformations based on options (see `src/module.ts:172-217`):

- `clone: true` → deep-clone every source via `clone()` (uses `structuredClone` if available, else `polyfillClone`).
- `inPlace: true` → mutate the *first* source argument; no extra source is prepended/appended.
- *default* (`clone: false, inPlace: false`) → prepend or append an empty `{}` / `[]` to neutralize mutation of caller-owned sources. The choice depends on `arrayPriority` (for array tops) or `priority` (otherwise).

## Design Patterns

### Factory + Closure over Options

`createMerger(input?)` normalizes the options once (`buildOptions`) and returns a closure (`Merger`) that creates a fresh `MergerContext` on each invocation. This means options are pay-once and the returned merger is reusable.

```typescript
export type Merger = <B extends MergerSource[]>(...sources: B) => MergerResult<B>;

export function createMerger(input?: OptionsInput): Merger {
    const options = buildOptions(input);
    return (...sources) => {
        const ctx: MergerContext = { options, map: new WeakMap() };
        // ... apply clone / inPlace / sentinel injection ...
        return baseMerger(ctx, ...sources);
    };
}
```

### Strategy Hook

A user-supplied `options.strategy` runs *before* the recursive merge of a conflicting key:

```typescript
strategy?: (target: Record<string, any>, key: string, value: unknown)
            => Record<string, any> | undefined
```

A return value of any kind (truthy or `null`) signals "I handled this key — skip the default merge". `undefined` (or omitting `return`) falls through to default behavior. The convention is: mutate `target[key]` and `return target`.

### Type-Level Result Unification

`MergerResult<B>` uses a `UnionToIntersection` helper to fold the input array's element types into a single intersection type. This lets `merge({a:1}, {b:2})` infer as `{a: number} & {b: number}` rather than `{a:1} | {b:2}`.

## Data Flow

```
Input:
  └── 1..N sources, each an array or a plain Record<string, any>

Processing (per call):
  1. buildOptions() fills defaults             [createMerger, once]
  2. New MergerContext { options, WeakMap }    [per call]
  3. Optional clone / inPlace / sentinel       [createMerger inner closure]
  4. baseMerger recursion, consuming 2 sources at a time
     - array+array  → push, recurse with collapsed list
     - object+object → for each source key:
         * skip if unsafe key (__proto__, prototype, constructor)
         * try options.strategy first
         * if both are objects → recurse (respecting cycle map)
         * if both are arrays and options.array → recurse with priority-adjusted order
         * else → assign source[key] onto target
     - else (primitive / mismatched) → drop source, recurse

Output:
  └── A single merged value, optionally passed through distinctArray()
```

## Error Handling

There is exactly one runtime error path: `createMerger()` returns a function that throws `SyntaxError('At least one input element is required.')` when called with zero arguments (`src/module.ts:178-180`). All other invalid inputs are tolerated — mismatched types degrade to "use whichever side is mergeable" or "drop the source".

## File Structure (Algorithm Map)

```text
createMerger / merge       → src/module.ts (lines 172-219)
baseMerger (recursion)     → src/module.ts (lines 19-170)
buildOptions / defaults    → src/utils/options.ts
PriorityName enum          → src/constants.ts
Cycle guard / equality     → src/utils/check.ts (isObject, isEqual, isSafeKey)
Cloning                    → src/utils/clone.ts
Deduplication              → src/utils/array.ts (distinctArray, used when arrayDistinct: true)
Public types               → src/type.ts
```

## Configuration

Configuration is purely an `OptionsInput` argument passed to `createMerger`. There are no environment variables and no config files.

| Option          | Default                | Purpose                                                    |
|-----------------|------------------------|------------------------------------------------------------|
| `array`         | `true`                 | Whether to merge array-typed object properties at all.     |
| `arrayDistinct` | `false`                | Deduplicate when merging array elements.                   |
| `arrayPriority` | `priority`             | Direction (`'left'` / `'right'`) used for arrays.          |
| `priority`      | `'left'`               | Direction (`'left'` / `'right'`) used for objects.         |
| `clone`         | `false`                | Deep-clone sources before merging (uses `structuredClone`).|
| `inPlace`       | `false`                | Mutate the first source instead of producing a new value.  |
| `strategy`      | *unset*                | Per-key override hook; non-`undefined` return wins.        |
