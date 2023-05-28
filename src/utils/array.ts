/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isEqual } from './check';

export function distinctArray<T = any>(arr: T[]) : T[] {
    for (let i = 0; i < arr.length; i++) {
        for (let j = arr.length - 1; j > i; j--) {
            if (isEqual(arr[i], arr[j])) {
                arr.splice(j, 1);
            }
        }
    }

    return arr;
}

export function mergeArrays(...sources: any[][]) : any[] {
    return ([] as any[]).concat.apply([], [...sources]);
}

export function mergeArraysDistinct(...sources: any[][]) : any[] {
    return distinctArray(mergeArrays(...sources));
}
