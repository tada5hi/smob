import { isObject } from './check';

/* istanbul ignore next */
const gT = (() => {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }

    // eslint-disable-next-line no-restricted-globals
    if (typeof self !== 'undefined') {
        // eslint-disable-next-line no-restricted-globals
        return self;
    }

    if (typeof window !== 'undefined') {
        return window;
    }

    if (typeof global !== 'undefined') {
        return global;
    }

    throw new Error('unable to locate global object');
})();

export function polyfillClone<T>(input: T) {
    const map = new WeakMap();

    const fn = <A>(value: A) : A => {
        if (Array.isArray(value)) {
            if (map.has(value)) {
                return map.get(value);
            }

            const cloned = [] as A;
            map.set(value, cloned);

            value.map((el) => (cloned as any[]).push(fn(el)));

            return cloned;
        }

        if (isObject(value)) {
            if (map.has(value)) {
                return map.get(value);
            }

            const output = {} as A;
            const keys = Object.keys(value);

            map.set(value, output);
            for (let i = 0; i < keys.length; i++) {
                output[keys[i] as keyof A] = fn(value[keys[i]]);
            }

            return output;
        }

        return value;
    };

    return fn(input);
}

/* istanbul ignore next */
export function clone<T>(value: T) : T {
    if (gT.structuredClone) {
        return gT.structuredClone(value);
    }

    /* istanbul ignore next */
    return polyfillClone(value);
}
