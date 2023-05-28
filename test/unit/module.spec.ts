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

        merged = merge({});
        expect(merged).toEqual({})

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
    });

    it('should merge nested objects with right priority', () => {
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

        const merged = createMerger({ priority: 'right' })({}, a, b);
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

    it('should merge circular objects', () => {
        const foo : Record<string, any> = {bar: 'baz'};
        foo.boz = foo;

        const boo : Record<string, any> = {bar: 'baz', extra: foo};
        boo.boz = boo;

        const merged = merge(foo, boo);
        expect(merged.extra).toBeDefined();
        expect(merged.bar).toEqual('baz');
        expect(merged.boz.bar).toEqual('baz');
        expect(merged.boz.boz).toBeDefined();
        expect(merged.boz.boz.extra).toBeDefined();
        expect(merged.boz.extra).toEqual(boo.extra);
    })

    it('should merge circular arrays', () => {
        const foo : any[] = ['bar'];
        foo.push(foo);

        const boo : any[] = ['bar'];
        boo.push(boo);

        const merged = merge(foo, boo);
        expect(merged.length).toEqual(4);
    })

    it('should not merge unsafe key', () => {
        let merger = createMerger({priority: 'right'});
        const merged = merger( {prototype: null}, {prototype: 1});
        expect(merged).toEqual({prototype: 1})
    });

    it('should return optimized return type', () => {
        let item : Record<string, any> = {
            id: 1,
            name: 'admin'
        }

        let data = merge({}, item);
        expect(data.id).toEqual(1);
        expect(data.name).toEqual('admin');
    });

    it('should merge different types', () => {
        type Foo = {
            foo: string
        }

        type Bar = {
            bar: string
        }

        let foo : Foo = {
            foo: 'bar'
        }

        let bar : Bar = {
            bar: 'baz'
        }

        const ob = merge(foo, bar);
        expect(ob).toEqual({foo: 'bar', bar: 'baz'});

        const arr = merge([foo], [bar]);
        expect(arr).toEqual([foo, bar]);
    })

    it('should merge arrays', () => {
        expect(merge(['foo'], ['bar'])).toEqual(['foo', 'bar']);

        expect(merge(['foo', 'bar'], ['baz'])).toEqual(['foo', 'bar', 'baz']);

        expect(merge(['foo', 'bar'], [['baz']])).toEqual(['foo', 'bar', ['baz']]);

        expect(merge(['foo'], ['bar'], ['baz'])).toEqual(['foo', 'bar', 'baz']);
    })

    it('should merge arrays with right priority', () => {
        const merger = createMerger({ priority: 'right' });
        expect(merger([4,5,6], [1,2,3,4])).toEqual([1,2,3,4,4,5,6]);

        expect(merger({foo: [4,5,6]}, {foo: [1,2,3,4]})).toEqual({foo: [1,2,3,4,4,5,6]});
    });

    it('should merge with destruction', () => {
        const x = {
            foo: 'bar'
        };

        const y = {
            bar: 'baz'
        }

        const merger = createMerger({ inPlace: false, clone: true });
        expect(merger({foo: x}, { foo: y })).toEqual({foo: {foo: 'bar', bar: 'baz'}});

        expect(x).toEqual({foo: 'bar'});
        expect(y).toEqual({bar: 'baz'});
    });

    it('should merge with destruction and right priority', () => {
        const x = {
            foo: 'bar'
        };

        const y = {
            bar: 'baz'
        }

        const merger = createMerger({ inPlace: false, clone: true, priority: 'right' });
        expect(merger({foo: x}, { foo: y })).toEqual({foo: {foo: 'bar', bar: 'baz'}});

        expect(x).toEqual({foo: 'bar'});
        expect(y).toEqual({bar: 'baz'});
    });

    it('should merge without destruction', () => {
        const x = {
            foo: 'bar'
        };

        const y = {
            bar: 'baz'
        }

        const merger = createMerger({ inPlace: true });
        expect(merger({foo: x}, { foo: y })).toEqual({foo: {foo: 'bar', bar: 'baz'}});

        expect(x).toEqual({foo: 'bar', bar: 'baz'});
        expect(y).toEqual({bar: 'baz'});
    });

    it('should merge without destruction and right priority', () => {
        const x = {
            foo: 'bar'
        };

        const y = {
            bar: 'baz'
        }

        const merger = createMerger({ inPlace: true, priority: 'right' });
        expect(merger({foo: x}, { foo: y })).toEqual({foo: {foo: 'bar', bar: 'baz'}});

        expect(x).toEqual({foo: 'bar' });
        expect(y).toEqual({foo: 'bar', bar: 'baz'});
    });

    it('should merge without array, destruction and right priority', () => {
        const xA = ['bar']
        const x = {
            foo: xA
        };

        const xB = ['baz'];
        const y = {
            foo: xB
        }

        const merger = createMerger({ inPlace: true, priority: 'right' });
        expect(merger({foo: x}, { foo: y })).toEqual({foo: {foo: ['baz', 'bar'] }});

        expect(x).toEqual({foo: ['bar'] });
        expect(y).toEqual({foo: ['baz', 'bar']});

        expect(xB).toEqual(['baz', 'bar']);
    });

    it('should throw error when input source is missing', () => {
        expect(merge).toThrow(SyntaxError);
    });
})
