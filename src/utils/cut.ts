/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject } from './check';

export function cutObject<T extends Record<string, any>>(input: T, depth: number) : T {
    if (depth < 0) {
        return {} as T;
    }

    const value = { ...input };
    const keys : (keyof T)[] = Object.keys(value);

    for (let i = 0; i < keys.length; i++) {
        if (isObject(value[keys[i]])) {
            if (depth === 0) {
                value[keys[i]] = {} as T[keyof T];
            } else {
                value[keys[i]] = cutObject(value[keys[i]], depth - 1);
            }
        }
    }

    return value;
}
