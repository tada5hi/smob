import { PriorityName } from '../constants';
import type { Options, OptionsInput } from '../type';

export function buildOptions(options: OptionsInput = {}) : Options {
    options.array = options.array ?? true;
    options.arrayDistinct = options.arrayDistinct ?? false;
    options.clone = options.clone ?? false;
    options.inPlace = options.inPlace ?? false;
    options.priority = options.priority || PriorityName.LEFT;
    options.arrayPriority = options.arrayPriority || options.priority;

    return options as Options;
}
