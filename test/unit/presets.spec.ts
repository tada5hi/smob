import { assign } from '../../src';

describe('src/presets', () => {
    it('should assign default properties', () => {
        const target = {
            foo: 'bar',
        };

        assign(target, {
            baz: 'boz',
        });

        expect(target).toEqual({ foo: 'bar', baz: 'boz' });
    });
});
