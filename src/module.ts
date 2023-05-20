/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PriorityName } from './constants';
import type {
    Merger, MergerResult, Options, OptionsInput,
} from './type';
import {
    buildOptions,
    hasOwnProperty,
    isObject,
    isSafeKey,
    isSafeObject,
    mergeArrays, mergeArraysDistinct,
} from './utils';

export function baseMerger<A extends Record<string, any>, B extends Record<string, any>>(
    options: Options,
    target: A,
    ...sources: B[]
) : MergerResult<A, B> {
    if (!sources.length) return target as MergerResult<A, B>;

    const source = sources.shift();

    if (
        isObject(target) &&
        isObject(source)
    ) {
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            const key : string = keys[i];

            if (!isSafeKey(key)) {
                continue;
            }

            if (hasOwnProperty(target, key)) {
                if (options.strategy) {
                    const applied = options.strategy(target, key, source[key]);
                    if (typeof applied !== 'undefined') {
                        continue;
                    }
                }

                if (!isSafeObject(source[key])) {
                    continue;
                }

                if (
                    isObject(target[key]) &&
                    isObject(source[key])
                ) {
                    baseMerger(options, target[key], source[key]);

                    continue;
                }

                if (
                    options.array &&
                    Array.isArray(target[key]) &&
                    Array.isArray(source[key])
                ) {
                    switch (options.priority) {
                        case PriorityName.LEFT:
                            Object.assign(target, {
                                [key]: options.arrayDistinct ?
                                    mergeArraysDistinct(target[key], source[key]) :
                                    mergeArrays(target[key], source[key]),
                            });
                            break;
                        case PriorityName.RIGHT:
                            Object.assign(target, {
                                [key]: options.arrayDistinct ?
                                    mergeArraysDistinct(source[key], target[key]) :
                                    mergeArrays(source[key], target[key]),
                            });
                            break;
                    }

                    continue;
                }

                if (options.priority === PriorityName.RIGHT) {
                    Object.assign(target, { [key]: source[key] });
                }
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return baseMerger(options, target, ...sources);
}

export function createMerger(input?: OptionsInput) : Merger {
    const options = buildOptions(input);

    return <A extends Record<string, any>, B extends Record<string, any>>(
        target: A,
        ...sources: B[]
    ) => baseMerger(options, target, ...sources);
}

export const merge = createMerger();
