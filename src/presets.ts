/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { createMerger } from './module';
import type { MergerResult } from './type';

/**
 * Assign source attributes to a target object.
 *
 * @param target
 * @param sources
 */
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
