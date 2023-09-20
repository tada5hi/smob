import { PriorityName } from '../constants';
import type { Options, OptionsInput } from '../type';

export function buildOptions(options?: OptionsInput) : Options {
    options = options || {};

    options.array = options.array ?? true;
    options.arrayDistinct = options.arrayDistinct ?? false;
    options.clone = options.clone ?? false;
    options.inPlace = options.inPlace ?? false;
    options.priority = options.priority || PriorityName.LEFT;

    return options as Options;
}
