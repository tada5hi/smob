/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type MergerResult<A, B> = A extends B ?
    B extends A ?
        // eslint-disable-next-line @typescript-eslint/ban-types
        (A extends {} ? B : A) :
        (A & B) :
    (A & B);

export type Merger = <A extends Record<string, any>, B extends Record<string, any>>(target: A, ...sources: B[]) => MergerResult<A, B>;

export type Options = {
    array: boolean,
    arrayDistinct: boolean,
    strategy?: (target: Record<string, any>, key: string, value: unknown) => Record<string, any> | undefined,
    priority: 'left' | 'right'
};
