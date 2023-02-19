/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {cutObject, isObjectDeeperThan} from "../../src";



describe('src/utils/*.ts', () => {
    it('should cut object correct', () => {
        let ob = {};

        let depth = cutObject(ob, 1);
        expect(depth).toEqual({});

        const nested = {
            a: {
                a: {
                    a: {
                        b: 1
                    }
                }
            }
        }

        depth = cutObject(nested, 0);
        expect(depth).toEqual({a: {}});

        depth = cutObject(nested, 1);
        expect(depth).toEqual({a: { a: {}}});

        depth = cutObject(nested, 2);
        expect(depth).toEqual({a: { a: { a: {}}}});

        depth = cutObject(nested, 3);
        expect(depth).toEqual({ a: { a: { a: { b: 1 } } } } );
    });

    it('should determine depth correct', () => {
        // {} = 0
        // { key: {} } = 1

        let ob = {};

        expect(isObjectDeeperThan(ob, 0)).toEqual(true);
        expect(isObjectDeeperThan(ob, 1)).toEqual(false);

        // ---------------------------------------------

        const nested = {
            a: {
                a: {

                },
                foo: 'bar'
            }
        }

        expect(isObjectDeeperThan(nested, 0)).toEqual(true);
        expect(isObjectDeeperThan(nested, 1)).toEqual(true);
        expect(isObjectDeeperThan(nested, 2)).toEqual(true);
        expect(isObjectDeeperThan(nested, 3)).toEqual(false);
        expect(isObjectDeeperThan(nested, 4)).toEqual(false);
    })
})
