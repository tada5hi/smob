/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Options } from '../type';

export function buildOptions(options?: Partial<Options>) {
    options = options || {};

    options.array = options.array ?? true;
    options.arrayDistinct = options.arrayDistinct ?? false;
    options.priority = options.priority || 'left';

    return options as Options;
}
