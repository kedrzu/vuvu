const decoratorsSymbol = Symbol('vuts:decorators');
export function addDecorator(target, callback) {
    let decorators;
    if (target.hasOwnProperty(decoratorsSymbol)) {
        decorators = target[decoratorsSymbol];
    }
    else {
        target[decoratorsSymbol] = decorators = [];
    }
    decorators.push(callback);
}
export function getDecorators(target) {
    let decorators = [];
    let proto = target.prototype;
    return proto[decoratorsSymbol] || [];
}
export function addLifecycleHook(target, hook, callback) {
    addDecorator(target, opts => {
        let hooks = opts[hook];
        if (!hooks) {
            opts[hook] = hooks = [];
        }
        hooks.push(callback);
    });
}
//# sourceMappingURL=reflection.js.map