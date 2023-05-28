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
    array: boolean,
    arrayDistinct: boolean,
    strategy?: (target: Record<string, any>, key: string, value: unknown) => Record<string, any> | undefined,
    modifyTarget?: boolean,
    cloneSource?: boolean,
    priority: `${PriorityName}`
};

export type OptionsInput = Partial<Options>;
