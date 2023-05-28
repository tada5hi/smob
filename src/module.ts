/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PriorityName } from './constants';

import type {
    Merger,
    MergerResult,
    MergerSource,
    Options,
    OptionsInput,
} from './type';
import {
    buildOptions,
    distinctArray,
    hasOwnProperty,
    isObject,
    isSafeInput,
    isSafeKey,
} from './utils';

function baseMerger<B extends MergerSource[]>(
    options: Options,
    ...sources: B
) : MergerResult<B> {
    if (!sources.length) {
        throw new SyntaxError('At least one input element is required.');
    }

    let target : B;
    let source : B | undefined;
    if (options.priority === PriorityName.RIGHT) {
        target = options.modifyTarget ?
            sources.pop() as B :
            structuredClone(sources.pop() as B);

        source = options.cloneSource ?
            sources.pop() as B :
            structuredClone(sources.pop() as B);
    } else {
        target = options.modifyTarget ?
            sources.shift() as B :
            structuredClone(sources.shift() as B);

        source = options.cloneSource ?
            sources.shift() as B :
            structuredClone(sources.shift() as B);
    }

    if (!source) {
        if (
            Array.isArray(target) &&
            options.arrayDistinct
        ) {
            return distinctArray(target) as MergerResult<B>;
        }

        return target as MergerResult<B>;
    }

    if (
        Array.isArray(target) &&
        Array.isArray(source)
    ) {
        if (options.modifyTarget) {
            target.push(...source as MergerSource[]);
        }

        if (options.priority === PriorityName.RIGHT) {
            return baseMerger(
                options,
                ...sources,
                options.modifyTarget ? target as B : target.concat(source) as B,
            ) as MergerResult<B>;
        }

        return baseMerger(
            options,
            options.modifyTarget ? target as B : target.concat(source) as B,
            ...sources,
        ) as MergerResult<B>;
    }

    if (
        isObject(target) &&
        isObject(source)
    ) {
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i] as (keyof B);

            if (!isSafeKey(key as string)) {
                continue;
            }

            if (hasOwnProperty(target, key)) {
                if (options.strategy) {
                    const applied = options.strategy(target, key as string, source[key]);
                    if (typeof applied !== 'undefined') {
                        continue;
                    }
                }

                if (
                    isObject(target[key]) &&
                    isObject(source[key])
                ) {
                    if (!isSafeInput(source[key])) {
                        continue;
                    }

                    if (options.priority === PriorityName.RIGHT) {
                        target[key] = baseMerger(options, source[key] as MergerSource, target[key] as MergerSource) as B[keyof B];
                    } else {
                        target[key] = baseMerger(options, target[key] as MergerSource, source[key] as MergerSource) as B[keyof B];
                    }

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
                                [key]: baseMerger(options, target[key] as MergerSource, source[key] as MergerSource),
                            });
                            break;
                        case PriorityName.RIGHT:
                            Object.assign(target, {
                                [key]: baseMerger(options, source[key] as MergerSource, target[key] as MergerSource),
                            });
                            break;
                    }
                }
            } else {
                Object.assign(target, {
                    [key]: source[key],
                });
            }
        }
    }

    if (options.priority === PriorityName.RIGHT) {
        return baseMerger(options, ...sources, target) as MergerResult<B>;
    }

    return baseMerger(options, target, ...sources) as MergerResult<B>;
}

export function createMerger(input?: OptionsInput) : Merger {
    const options = buildOptions(input);

    return <B extends MergerSource[]>(
        ...sources: B
    ) : MergerResult<B> => baseMerger(options, ...sources);
}

export const merge = createMerger();

export function assign<A extends Record<string, any>, B extends Record<string, any>[]>(
    target: A,
    ...sources: B
) : A & MergerResult<B> {
    return createMerger({
        modifyTarget: true,
        priority: 'left',
        array: false,
    })(target, ...sources) as A & MergerResult<B>;
}
