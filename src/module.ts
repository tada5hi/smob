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
    MergerSourceUnwrap,
    Options,
    OptionsInput,
} from './type';

import {
    buildOptions,
    clone,
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

    let target : MergerSourceUnwrap<B>;
    let source : MergerSourceUnwrap<B> | undefined;
    if (options.priority === PriorityName.RIGHT) {
        target = sources.pop() as MergerSourceUnwrap<B>;
        source = sources.pop() as MergerSourceUnwrap<B>;
    } else {
        target = sources.shift() as MergerSourceUnwrap<B>;
        source = sources.shift() as MergerSourceUnwrap<B>;
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
        target.push(...source as MergerSource[]);

        if (options.priority === PriorityName.RIGHT) {
            return baseMerger(
                options,
                ...sources,
                target,
            ) as MergerResult<B>;
        }

        return baseMerger(
            options,
            target,
            ...sources,
        ) as MergerResult<B>;
    }

    if (
        isObject(target) &&
        isObject(source)
    ) {
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i] as (keyof MergerSourceUnwrap<B>);

            if (hasOwnProperty(target, key)) {
                if (!isSafeKey(key as string)) {
                    continue;
                }

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
                        target[key] = baseMerger(
                            options,
                            source[key] as MergerSource,
                            target[key] as MergerSource,
                        ) as MergerSourceUnwrap<B>[keyof MergerSourceUnwrap<B>];
                    } else {
                        target[key] = baseMerger(
                            options,
                            target[key] as MergerSource,
                            source[key] as MergerSource,
                        ) as MergerSourceUnwrap<B>[keyof MergerSourceUnwrap<B>];
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
    ) : MergerResult<B> => {
        if (options.clone) {
            return baseMerger(options, ...clone(sources));
        }

        if (!options.inPlace) {
            if (options.priority === PriorityName.LEFT) {
                if (Array.isArray(sources[0])) {
                    sources.unshift([]);
                } else {
                    sources.unshift({});
                }
            } else if (Array.isArray(sources[0])) {
                sources.push([]);
            } else {
                sources.push({});
            }
        }

        return baseMerger(options, ...sources);
    };
}

export const merge = createMerger();

export function assign<A extends Record<string, any>, B extends Record<string, any>[]>(
    target: A,
    ...sources: B
) : A & MergerResult<B> {
    return createMerger({
        inPlace: true,
        priority: 'left',
        array: false,
    })(target, ...sources) as A & MergerResult<B>;
}
