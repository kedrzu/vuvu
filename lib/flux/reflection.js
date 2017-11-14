const mutationsSymbol = Symbol('vuvu:flux-mutations');
export function addMutation(storeClass, name, fcn) {
    let mutations = storeClass[mutationsSymbol];
    if (!mutations) {
        // there are no mutations defined
        storeClass[mutationsSymbol] = mutations = {};
    }
    else if (!storeClass.hasOwnProperty(mutationsSymbol)) {
        // mutations have been defined in base class
        // we need to copy them, to preserve inheritance hierachy
        storeClass[mutationsSymbol] = mutations = Object.assign({}, mutations);
    }
    mutations[name] = fcn;
}
export function getMutations(storeClass) {
    return storeClass[mutationsSymbol] || {};
}
//# sourceMappingURL=reflection.js.map