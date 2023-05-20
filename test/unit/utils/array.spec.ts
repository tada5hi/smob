/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {distinctArray, mergeArrays, mergeArraysDistinct} from "../../../src";

describe('src/utils/array', function () {
    it('should distinct array', () => {
        let arr: any[] = [0, 1, 2, 3];

        expect(distinctArray(arr)).toEqual(arr);

        arr = [0, 1, 2, 0, 0];
        expect(distinctArray(arr)).toEqual([0, 1, 2]);

        arr = [{foo: 'bar'}, {foo: 'bar'}]

        expect(distinctArray(arr)).toEqual([{ foo: 'bar' }]);

        arr = [{foo: 'bar'}, {foo: 'baz'}]
        expect(distinctArray(arr)).toEqual(arr);

        arr = [['foo', 'bar'], ['foo']];
        expect(distinctArray(arr)).toEqual([['foo', 'bar'], ['foo']]);

        arr = [['foo', 'bar'], ['foo', 'bar']];
        expect(distinctArray(arr)).toEqual([['foo', 'bar']]);

        arr = [['foo', 'bar'], ['bar', 'foo']];
        expect(distinctArray(arr)).toEqual([['foo', 'bar'], ['bar', 'foo']]);

        let circ : any = {foo: 'bar'};
        circ.bar = circ;

        arr = [{foo: { bar: 'baz'}}, circ];
        expect(distinctArray(arr)).toEqual(arr);

        let now = Date.now();
        let firstDate = new Date(now);
        let secondData = new Date(now);

        expect(distinctArray([firstDate, secondData])).toEqual([firstDate]);

        let firstRegex = new RegExp(/foo/);
        let secondRegex = new RegExp(/foo/);
        expect(distinctArray([firstRegex, secondRegex])).toEqual([firstRegex]);
    })

    it('should merge arrays', () => {
        expect(mergeArrays()).toEqual([]);

        expect(mergeArrays(['foo'], ['bar'])).toEqual(['foo', 'bar']);

        expect(mergeArrays(['foo'], ['bar'], ['baz'])).toEqual(['foo', 'bar', 'baz']);
    })

    it('should merge arrays without duplicates', () => {
        let x = ['foo', 'bar', 'baz'];
        let y = ['baz', 'moo', 'bar', 'mal'];

        expect(mergeArraysDistinct(x, y)).toEqual(['foo', 'bar', 'baz', 'moo', 'mal']);
    })
});
