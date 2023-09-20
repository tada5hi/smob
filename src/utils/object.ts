// eslint-disable-next-line @typescript-eslint/ban-types
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
