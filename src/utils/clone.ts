/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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

/* istanbul ignore next */
export function clone<T>(value: T) : T {
    if (gT.structuredClone) {
        return gT.structuredClone(value);
    }

    /* istanbul ignore next */
    if (isObject(value)) {
        return { ...value };
    }

    /* istanbul ignore next */
    if (Array.isArray(value)) {
        return [...value] as T;
    }

    /* istanbul ignore next */
    return value;
}
