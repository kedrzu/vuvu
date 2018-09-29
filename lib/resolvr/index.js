const metadataSymbol = Symbol.for('vuvu:resolvr');
export function Resolvable(options) {
    return (constructor) => {
        let meta = getMetadata(options.for.prototype);
        let role = options.role || null;
        let types = meta.types[role] || (meta.types[role] = []);
        types.push({
            type: constructor,
            order: options.order || Number.MAX_SAFE_INTEGER
        });
        types.sort((a, b) => a.order - b.order);
    };
}
function getMetadata(proto) {
    let meta = Reflect.getOwnMetadata(metadataSymbol, proto);
    if (!meta) {
        meta = {
            types: {}
        };
        let parent = Reflect.getPrototypeOf(proto);
        if (parent && parent !== Object.prototype) {
            meta.parent = getMetadata(parent);
        }
        Reflect.defineMetadata(metadataSymbol, meta, proto);
    }
    return meta;
}
export function resolveTypes(options) {
    let resolveFor = options.for;
    let proto = resolveFor.prototype || Object.getPrototypeOf(resolveFor);
    let meta = getMetadata(proto);
    let role = options.role || null;
    let types = [];
    while (meta) {
        let forRole = meta.types[role];
        if (forRole) {
            for (let descriptor of forRole) {
                types.push(descriptor.type);
            }
        }
        meta = meta.parent;
    }
    return types;
}
//# sourceMappingURL=index.js.map