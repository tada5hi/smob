/*
 * Copyright (c) 2022-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { cutObject } from '../../../src';

describe('src/utils/*.ts', () => {
    it('should cut object correct', () => {
        const ob = {};

        let depth = cutObject(ob, 1);
        expect(depth).toEqual({});

        const nested = {
            a: {
                a: {
                    a: {
                        b: 1,
                    },
                },
            },
        };

        depth = cutObject(nested, 0);
        expect(depth).toEqual({ a: {} });

        depth = cutObject(nested, 1);
        expect(depth).toEqual({ a: { a: {} } });

        depth = cutObject(nested, 2);
        expect(depth).toEqual({ a: { a: { a: {} } } });

        depth = cutObject(nested, 3);
        expect(depth).toEqual({ a: { a: { a: { b: 1 } } } });
    });
});
