/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isEqual } from './check';

export function distinctArray(arr: any[]) : any[] {
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

export function mergeArrays(...sources: any[][]) : any[] {
    return ([] as any[]).concat.apply([], [...sources]);
}

export function mergeArraysDistinct(...sources: any[][]) : any[] {
    return distinctArray(mergeArrays(...sources));
}
