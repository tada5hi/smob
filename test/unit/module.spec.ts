/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {merge, createMerger} from "../../src";

class MyCircularClass {
    ref : MyCircularClass;

    constructor() {
        this.ref = this;
    }
}

describe('src/module/*.ts', () => {
    it('should merge simple objects', () => {
        const a : Record<string, any> = {
            a: 1,
            same: 'a',
        }

        const b : Record<string, any> = {
            b: 2,
            same: 'b'
        }

        let merged = merge({}, a, b);
        expect(merged).toEqual({
            a: 1,
            b: 2,
            same: 'a'
        });

        merged = createMerger({ priority: 'right' })({}, a, b);
        expect(merged).toEqual({
            a: 1,
            b: 2,
            same: 'b'
        })
    });

    it('should merge nested objects', () => {
        const a: Record<string, any> = {
            a: {
                a: 1
            },
            same: {
                a: 1,
                same: 'a'
            },
        }

        const b: Record<string, any> = {
            b: {
                b: 2
            },
            same: {
                b: 1,
                same: 'b'
            }
        }

        let merged = merge({}, a, b);
        expect(merged).toEqual({
            a: {
                a: 1
            },
            b: {
                b: 2
            },
            same: {
                a: 1,
                b: 1,
                same: 'a'
            },
        })

        merged = createMerger({ priority: 'right' })({}, a, b);
        expect(merged).toEqual({
            a: {
                a: 1
            },
            b: {
                b: 2
            },
            same: {
                a: 1,
                b: 1,
                same: 'b'
            },
        })
    });

    it('should merge with custom strategy', () => {
        const merger = createMerger({
            strategy: (target, key, value) => {
                if (
                    typeof target[key] === 'number' &&
                    typeof value === 'number'
                ) {
                    target[key] += value;
                    return target;
                }

                return undefined;
            }
        });

        expect(merger({a: 1}, {a: 2}, {a: 3})).toEqual({a: 6});
        expect(merger({a: 1, b: 'foo'}, {a: 2}, {a: 3, c: {c: 0}})).toEqual({a: 6, b: 'foo', c: {c: 0}});
    });

    it('should (not) merge arrays', () => {
        let merged = merge({a: [1,2,3]}, {a: [4,5,6]});
        expect(merged).toEqual({a: [1,2,3,4,5,6]})

        let merger = createMerger({array: false});
        merged = merger({a: [1,2,3]}, {a: [4,5,6]});
        expect(merged).toEqual({a: [1,2,3]});

        merger = createMerger({array: false, priority: 'right'});
        merged = merger({a: [1,2,3]}, {a: [4,5,6]});
        expect(merged).toEqual({a: [4,5,6]});

        merger = createMerger({ priority: 'right' });
        merged = merger({a: [1,2,3]}, {a: [4,5,6]});
        expect(merged).toEqual({a: [4,5,6,1,2,3]});

        merger = createMerger({ arrayDistinct: true });
        merged = merger({a: [1,2,3]}, {a: [3,4,5]});
        expect(merged).toEqual({a: [1,2,3,4,5]});
    });

    it('should (not) merge circular class reference', () => {
        const one = new MyCircularClass();
        const two = new MyCircularClass();

        const merged = merge(one, two);
        expect(merged).toEqual(one);
    });

    it('should not merge unsafe key', () => {
        let merger = createMerger({priority: 'right'});
        const merged = merger( {prototype: null}, {prototype: 1});
        expect(merged).toEqual({prototype: null})
    })
})
