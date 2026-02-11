import { describe, expect, it } from 'vitest';
import { polyfillClone } from '../../../src';

describe('src/utils/clone', () => {
    it('should polyfill clone objects with circular reference', () => {
        const foo : Record<string, any> = { bar: 'baz' };
        foo.boz = foo;

        const copy = polyfillClone(foo);
        expect(copy).toEqual(foo);
    });

    it('should polyfill clone arrays with circular reference', () => {
        const foo : any = ['bar'];
        foo.push(foo);

        const copy = polyfillClone(foo);
        expect(copy).toEqual(foo);
    });
});
