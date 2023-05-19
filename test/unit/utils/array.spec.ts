/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {distinctArray, mergeArrays} from "../../../src";

describe('src/utils/array', function () {
    it('should distinct array', () => {
        let arr: any[] = [0, 1, 2, 3];

        expect(distinctArray(arr)).toEqual(arr);

        arr = [0, 1, 2, 0, 0];
        expect(distinctArray(arr)).toEqual([0, 1, 2]);

        arr = [{foo: 'bar'}, {foo: 'bar'}]

        expect(distinctArray(arr)).toEqual([{ foo: 'bar' }]);

        let circ : any = {foo: 'bar'};
        circ.bar = circ;

        arr = [{foo: { bar: 'baz'}}, circ];
        expect(distinctArray(arr)).toEqual(arr);
    })

    it('should merge arrays', () => {
        let x = ['foo', 'bar', 'baz'];
        let y = ['baz', 'moo', 'bar', 'mal'];

        expect(mergeArrays(x, y, true)).toEqual(['foo', 'bar', 'baz', 'moo', 'mal']);
    })
});
