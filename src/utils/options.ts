/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { PriorityName } from '../constants';
import type { Options, OptionsInput } from '../type';

export function buildOptions(options?: OptionsInput) : Options {
    options = options || {};

    options.array = options.array ?? true;
    options.arrayDistinct = options.arrayDistinct ?? false;
    options.modifyTarget = options.modifyTarget ?? false;
    options.priority = options.priority || PriorityName.LEFT;

    return options as Options;
}
