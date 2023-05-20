/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function isObject(item: unknown) : item is Record<string, any> {
    return (
        !!item &&
        typeof item === 'object' &&
        !Array.isArray(item)
    );
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

export function isEqual(x: any, y: any): boolean {
    if (Object.is(x, y)) return true;

    if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
    }

    if (x instanceof RegExp && y instanceof RegExp) {
        return x.toString() === y.toString();
    }

    if (
        isObject(x) &&
        isObject(y)
    ) {
        const keysX = Reflect.ownKeys(x) as string[];
        const keysY = Reflect.ownKeys(y) as string[];
        if (keysX.length !== keysY.length) {
            return false;
        }

        for (let i = 0; i < keysX.length; i++) {
            const key = keysX[i];
            if (!Reflect.has(y, key) || !isEqual(x[key], y[key])) {
                return false;
            }
        }

        return true;
    }

    if (
        Array.isArray(x) &&
        Array.isArray(y)
    ) {
        if (x.length !== y.length) {
            return false;
        }

        for (let i = 0; i < x.length; i++) {
            if (!isEqual(x[i], y[i])) {
                return false;
            }
        }

        return true;
    }

    return false;
}
