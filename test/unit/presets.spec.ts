/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {assign} from "../../src";

describe('src/presets', () => {
    it('should assign default properties', () => {
        let target = {
            foo: 'bar'
        };

        assign(target, {
            baz: 'boz'
        });

        expect(target).toEqual({foo: 'bar', baz: 'boz'})
    })
})
