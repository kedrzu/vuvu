import Vue from 'vue';
import * as reflection from './reflection';
export function setupComponent(component, options) {
    if (!options) {
        options = {};
    }
    options.name = component.name;
    reflection.getDecorators(component).forEach(d => d(options));
    if (component.prototype.render) {
        options.render = component.prototype.render;
    }
    if (options && options.components) {
        options.components = options.components;
    }
    let proto = component.prototype;
    Object.getOwnPropertyNames(proto).forEach((key) => {
        if (key === 'constructor') {
            return;
        }
        let descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.get || descriptor.set) {
            let computed = options.computed || (options.computed = {});
            computed[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    return extendComponent(component, options);
}
function extendComponent(component, options) {
    let base = Object.getPrototypeOf(component);
    component.options = Vue.util.mergeOptions(base.options, options);
    component.extend = base.extend;
    component.mixin = base.mixin;
    component.use = base.use;
    component.super = base;
    component.options.components[options.name] = component;
    component.superOptions = base.options;
    component.extendOptions = options;
    component.sealedOptions = Object.assign({}, component.options);
    return component;
}
//# sourceMappingURL=component.js.map