/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PriorityName } from './constants';

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I)=>void) ? I : never;

export type MergerSource = any[] | Record<string, any>;

export type MergerSourceUnwrap<T extends MergerSource> = T extends Array<infer Return> ? Return : T;

export type MergerResult<B extends MergerSource> = UnionToIntersection<MergerSourceUnwrap<B>>;

export type Merger = <B extends MergerSource[]>(...sources: B) => MergerResult<B>;

export type Options = {
    /**
     * Merge array object attributes?
     */
    array: boolean,
    /**
     * Remove duplicates in array.
     */
    arrayDistinct: boolean,
    /**
     * Strategy to merge different object keys.
     *
     * @param target
     * @param key
     * @param value
     */
    strategy?: (target: Record<string, any>, key: string, value: unknown) => Record<string, any> | undefined,
    /**
     * Merge sources in place.
     */
    inPlace?: boolean
    /**
     * Deep clone input arrays/objects.
     */
    clone?: boolean,
    /**
     * Merge sources from left-right or left-right.
     */
    priority: `${PriorityName}`
};

export type OptionsInput = Partial<Options>;
