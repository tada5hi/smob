/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { distinctArray } from '../../../src';

describe('src/utils/array', () => {
    it('should distinct array', () => {
        let arr: any[] = [0, 1, 2, 3];

        expect(distinctArray(arr)).toEqual(arr);

        arr = [0, 1, 2, 0, 0];
        expect(distinctArray(arr)).toEqual([0, 1, 2]);

        arr = [{ foo: 'bar' }, { foo: 'bar' }];

        expect(distinctArray(arr)).toEqual([{ foo: 'bar' }]);

        arr = [{ foo: 'bar' }, { foo: 'baz' }];
        expect(distinctArray(arr)).toEqual(arr);

        arr = [['foo', 'bar'], ['foo']];
        expect(distinctArray(arr)).toEqual([['foo', 'bar'], ['foo']]);

        arr = [['foo', 'bar'], ['foo', 'bar']];
        expect(distinctArray(arr)).toEqual([['foo', 'bar']]);

        arr = [['foo', 'bar'], ['bar', 'foo']];
        expect(distinctArray(arr)).toEqual([['foo', 'bar'], ['bar', 'foo']]);

        const circ : any = { foo: 'bar' };
        circ.bar = circ;

        arr = [{ foo: { bar: 'baz' } }, circ];
        expect(distinctArray(arr)).toEqual(arr);

        const now = Date.now();
        const firstDate = new Date(now);
        const secondData = new Date(now);

        expect(distinctArray([firstDate, secondData])).toEqual([firstDate]);

        const firstRegex = /foo/;
        const secondRegex = /foo/;
        expect(distinctArray([firstRegex, secondRegex])).toEqual([firstRegex]);
    });
});
