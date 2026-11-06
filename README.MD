<div align="center">
  <img src="https://raw.githubusercontent.com/tada5hi/smob/51a5fc19b0462a7c68a2f48ba3b1debe83e4dbeb/.github/assets/logo.svg" width="144" height="144" alt="smob logo">
  <h1>smob</h1>
  <p><strong>Zero dependency library to safe merge objects.</strong></p>
  <p><a href="https://www.npmjs.com/package/smob"><img src="https://img.shields.io/npm/v/smob" alt="npm version"></a> <a href="https://github.com/tada5hi/smob/actions/workflows/main.yml"><img src="https://github.com/tada5hi/smob/actions/workflows/main.yml/badge.svg" alt="CI status"></a> <a href="LICENSE"><img src="https://img.shields.io/github/license/tada5hi/smob" alt="License"></a></p>
  <p><a href="#why-smob">Why smob?</a> · <a href="#installation">Install</a> · <a href="#usage">Usage</a> · <a href="#options">Options</a> · <a href="#api">API</a></p>
</div>

---

## Why smob?

Combine configuration objects without rewriting precedence and array rules at every call site.

| Concern | Without it | With smob |
| --- | --- | --- |
| Nested defaults | A spread or `Object.assign()` replaces a nested object | Recursively combine nested object properties |
| Precedence | Order each assignment yourself | Leftmost wins by default; configure `priority` |
| Arrays | Implement concatenation or replacement per field | Configure array merging, order and deduplication |
| Isolation | Clone inputs separately when references must not be shared | Enable `clone` for deep-cloned inputs |
| Custom conflicts | Add a second pass over merged keys | Handle an existing key in `strategy` |

```typescript
import { merge } from 'smob';

const config = { port: 3000, db: { host: 'local' }, tags: ['app'] };
const defaults = { port: 80, db: { pool: 5 }, tags: ['defaults'] };
console.log({ ...defaults, ...config }.db); // { host: 'local' }
console.log(merge(config, defaults));
// { port: 3000, db: { host: 'local', pool: 5 }, tags: ['app', 'defaults'] }
```

<img src="https://raw.githubusercontent.com/tada5hi/smob/51a5fc19b0462a7c68a2f48ba3b1debe83e4dbeb/.github/assets/mechanism.svg" width="960" alt="merge combines the left source containing port 3000, db.host local and tags app with the right source containing port 80, db.pool 5 and tags defaults. The result keeps port 3000, combines db properties and concatenates tags in left-to-right order.">

## Installation

```sh
npm install smob
```

Requires Node.js 20 or newer. ESM, CommonJS and TypeScript declarations are included. There are no runtime dependencies.

## Usage

### Set precedence and array behavior

```typescript
import { createMerger } from 'smob';

const merge = createMerger({ priority: 'right', arrayPriority: 'left', arrayDistinct: true });
console.log(merge({ port: 80, tags: ['base'] }, { port: 3000, tags: ['base', 'app'] }));
// { port: 3000, tags: ['base', 'app'] }

const replaceArrays = createMerger({ array: false });
console.log(replaceArrays({ tags: ['app'] }, { tags: ['defaults'] }));
// { tags: ['app'] }
```

`array: false` controls array-valued object properties. Top-level array inputs still concatenate. `arrayDistinct` removes equal elements using `isEqual()`.

### Handle a conflict yourself

```typescript
import { createMerger } from 'smob';

const sum = createMerger({
    strategy: (target, key, value) => {
        if (typeof target[key] === 'number' && typeof value === 'number') {
            target[key] += value;
            return target;
        }
        return undefined;
    },
});
console.log(sum({ count: 1 }, { count: 2 }, { count: 3 })); // { count: 6 }
```

A strategy runs for keys already present on the target. Mutate `target` and return a defined value to mark the conflict handled. The return value is a signal; it does not replace the target. Return `undefined` to let the standard merge continue.

### Assign defaults and deduplicate

```typescript
import { assign, distinctArray, isEqual } from 'smob';

const target = { port: 3000 };
console.log(assign(target, { port: 80, host: 'local' })); // { port: 3000, host: 'local' }
console.log(distinctArray([{ id: 1 }, { id: 1 }])); // [{ id: 1 }]
console.log(isEqual({ tags: ['app'] }, { tags: ['app'] })); // true
```

`assign()` mutates the target, keeps its existing values and disables merging array-valued properties. Its precedence differs from `Object.assign()`. `distinctArray()` also mutates its input.

## Options

Pass options to `createMerger(options)` once, then call the returned merger with one or more sources.

| Option | Type | Default | Behavior |
| --- | --- | --- | --- |
| `priority` | `'left' | 'right'` | `'left'` | Which side wins when values conflict |
| `array` | `boolean` | `true` | Concatenate array-valued object properties |
| `arrayPriority` | `'left' | 'right'` | `priority` | Which side's array elements come first |
| `arrayDistinct` | `boolean` | `false` | Remove deeply equal array elements |
| `inPlace` | `boolean` | `false` | Use the priority-selected source as the target |
| `clone` | `boolean` | `false` | Deep-clone sources before merging; takes precedence over `inPlace` |
| `strategy` | `(target, key, value) => object | undefined` | `undefined` | Handle conflicts for existing object keys |

## API

All exports are named exports from `smob`.

| Export | Kind | Purpose |
| --- | --- | --- |
| `merge(...sources)` | Function | Merger with the defaults above |
| `createMerger(options?)` | Function | Construct a reusable configured merger |
| `assign(target, ...sources)` | Function | In-place, left-priority merge with property-array merging disabled |
| `distinctArray(array)` | Function | Remove deeply equal duplicates in place |
| `isEqual(left, right)` | Function | Compare values recursively, with Date and RegExp handling |
| `isObject(value)` | Type guard | Non-null object excluding arrays; includes class instances |
| `isSafeKey(key)` | Function | Reject `__proto__`, `prototype`, `constructor` |
| `hasOwnProperty(object, key)` | Type guard | Check an own property |
| `clone(value)` | Function | Use native `structuredClone` when available, otherwise the fallback |
| `polyfillClone(value)` | Function | Clone arrays/enumerable string-keyed object fields with cycle tracking |
| `buildOptions(options?)` | Function | Fill defaults into the supplied options object |
| `togglePriority(priority)` | Function | Toggle `'left'` and `'right'` |
| `PriorityName` | Enum | `LEFT`, `RIGHT` |
| `Options`, `OptionsInput` | Types | Full options and partial input |
| `Merger`, `MergerContext` | Types | Merger call signature and internal context shape |
| `MergerSource`, `MergerSourceUnwrap`, `MergerResult` | Types | Accepted sources and inferred result helpers |

## Notes

- **References:** the default creates a new top-level result, but nested objects and arrays can remain shared and can be changed during later merging. Use `clone: true` when input isolation matters.
- **Inputs:** provide at least one object or array. No sources throws `SyntaxError`; this is not a validator for arbitrary input.
- **Properties:** the merge walks enumerable string keys and skips unsafe keys copied from later sources. It does not sanitize an unsafe property already present in an input or clone.
- **Cloning:** native `structuredClone()` can throw for unsupported values such as functions. The fallback does not preserve prototypes or special object semantics.
- **Equality:** `isEqual()` and deduplication do not detect cycles. Avoid them on cyclic structures, even though cloning and the merge have cycle bookkeeping.

## License

Made with 💚

Published under the [MIT License](LICENSE).
