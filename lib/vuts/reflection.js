"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorsSymbol = Symbol('vuts:decorators');
function addDecorator(target, callback) {
    let decorators;
    if (target.hasOwnProperty(decoratorsSymbol)) {
        decorators = target[decoratorsSymbol];
    }
    else {
        target[decoratorsSymbol] = decorators = [];
    }
    decorators.push(callback);
}
exports.addDecorator = addDecorator;
function getDecorators(target) {
    let decorators = [];
    let proto = target.prototype;
    return proto[decoratorsSymbol] || [];
}
exports.getDecorators = getDecorators;
function addLifecycleHook(target, hook, callback) {
    addDecorator(target, opts => {
        let hooks = opts[hook];
        if (!hooks) {
            opts[hook] = hooks = [];
        }
        hooks.push(callback);
    });
}
exports.addLifecycleHook = addLifecycleHook;
//# sourceMappingURL=reflection.js.map