import { isEqual } from './check';

export function distinctArray<T = any>(arr: T[]) : T[] {
    for (let i = 0; i < arr.length; i++) {
        for (let j = arr.length - 1; j > i; j--) {
            if (isEqual(arr[i], arr[j])) {
                arr.splice(j, 1);
            }
        }
    }

    return arr;
}
