export function getAllMetadata(symbol, target) {
    let meta = {};
    while (target) {
        Object.assign(meta, Reflect.getOwnMetadata(symbol, target));
        target = Reflect.getPrototypeOf(target);
    }
    return meta;
}
//# sourceMappingURL=reflection.js.map