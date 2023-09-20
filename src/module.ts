import { PriorityName } from './constants';
import type {
    Merger, MergerContext,
    MergerResult,
    MergerSource,
    MergerSourceUnwrap,
    OptionsInput,
} from './type';

import {
    buildOptions,
    clone,
    distinctArray,
    hasOwnProperty,
    isObject,
    isSafeKey,
} from './utils';

function baseMerger<B extends MergerSource[]>(
    context: MergerContext,
    ...sources: B
) : MergerResult<B> {
    let target : MergerSourceUnwrap<B>;
    let source : MergerSourceUnwrap<B> | undefined;
    if (context.options.priority === PriorityName.RIGHT) {
        target = sources.pop() as MergerSourceUnwrap<B>;
        source = sources.pop() as MergerSourceUnwrap<B>;
    } else {
        target = sources.shift() as MergerSourceUnwrap<B>;
        source = sources.shift() as MergerSourceUnwrap<B>;
    }

    if (!source) {
        if (
            Array.isArray(target) &&
            context.options.arrayDistinct
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

        if (context.options.priority === PriorityName.RIGHT) {
            return baseMerger(
                context,
                ...sources,
                target,
            ) as MergerResult<B>;
        }

        return baseMerger(
            context,
            target,
            ...sources,
        ) as MergerResult<B>;
    }

    context.map.set(source, true);

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

                if (context.options.strategy) {
                    const applied = context.options.strategy(target, key as string, source[key]);
                    if (typeof applied !== 'undefined') {
                        continue;
                    }
                }

                if (
                    isObject(target[key]) &&
                    isObject(source[key])
                ) {
                    if (context.map.has(source[key])) {
                        const sourceKeys = Object.keys(source[key] as Record<string, any>);
                        for (let j = 0; j < sourceKeys.length; j++) {
                            if (
                                isSafeKey(sourceKeys[j]) &&
                                !hasOwnProperty(target[key] as Record<string, any>, sourceKeys[j])
                            ) {
                                (target[key] as Record<string, any>)[sourceKeys[j]] = (source[key] as Record<string, any>)[sourceKeys[j]];
                            }
                        }

                        continue;
                    }

                    if (context.options.priority === PriorityName.RIGHT) {
                        target[key] = baseMerger(
                            context,
                            source[key] as MergerSource,
                            target[key] as MergerSource,
                        ) as MergerSourceUnwrap<B>[keyof MergerSourceUnwrap<B>];
                    } else {
                        target[key] = baseMerger(
                            context,
                            target[key] as MergerSource,
                            source[key] as MergerSource,
                        ) as MergerSourceUnwrap<B>[keyof MergerSourceUnwrap<B>];
                    }

                    continue;
                }

                if (
                    context.options.array &&
                    Array.isArray(target[key]) &&
                    Array.isArray(source[key])
                ) {
                    switch (context.options.priority) {
                        case PriorityName.LEFT:
                            Object.assign(target, {
                                [key]: baseMerger(context, target[key] as MergerSource, source[key] as MergerSource),
                            });
                            break;
                        case PriorityName.RIGHT:
                            Object.assign(target, {
                                [key]: baseMerger(context, source[key] as MergerSource, target[key] as MergerSource),
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

    context.map = new WeakMap();

    if (context.options.priority === PriorityName.RIGHT) {
        return baseMerger(context, ...sources, target) as MergerResult<B>;
    }

    return baseMerger(context, target, ...sources) as MergerResult<B>;
}

export function createMerger(input?: OptionsInput) : Merger {
    const options = buildOptions(input);

    return <B extends MergerSource[]>(
        ...sources: B
    ) : MergerResult<B> => {
        if (!sources.length) {
            throw new SyntaxError('At least one input element is required.');
        }

        const ctx : MergerContext = {
            options,
            map: new WeakMap<any, any>(),
        };

        if (options.clone) {
            return baseMerger(ctx, ...clone(sources));
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

        return baseMerger(ctx, ...sources);
    };
}

export const merge = createMerger();
