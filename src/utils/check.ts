/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasOwnProperty } from './has-own-property';

export function isObject(item: unknown) : item is Record<string, any> {
    return (
        item &&
        typeof item === 'object' &&
        !Array.isArray(item)
    );
}

export function isObjectDeeperThan(value: unknown, depth: number) {
    if (depth <= 0) {
        return isObject(value);
    }

    if (typeof value !== 'object') {
        return false;
    }

    const nextDepth = depth - 1;
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
        if (
            hasOwnProperty(value, keys[i]) &&
            isObjectDeeperThan(value[keys[i]], nextDepth)
        ) {
            return true;
        }
    }

    return false;
}

export function isSafeObject(object: Record<string, any>) : boolean {
    try {
        JSON.stringify(object);
        return true;
    } catch (e) {
        return false;
    }
}

export function isSafeKey(key: string) : boolean {
    return key !== '__proto__' &&
        key !== 'prototype' &&
        key !== 'constructor';
}
