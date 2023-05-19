/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isEqual } from './check';

export function distinctArray(arr: any[]) {
    const copy = [...arr];

    for (let i = 0; i < copy.length; i++) {
        for (let j = copy.length - 1; j > i; j--) {
            if (isEqual(copy[i], copy[j])) {
                copy.splice(j, 1);
            }
        }
    }

    return copy;
}

export function mergeArrays(
    first: any[],
    second: any[],
    arrayDistinct: boolean,
) {
    const merged = first.concat(second);

    if (arrayDistinct) {
        return distinctArray(merged);
    }

    return merged;
}
