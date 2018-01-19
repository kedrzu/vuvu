import Vue from 'vue';
import * as cmp from './component';
import * as reflection from './reflection';
export function component(idOrOptions, options) {
    return (constructor) => {
        let id = null;
        if (typeof idOrOptions === 'string') {
            id = idOrOptions;
        }
        else {
            options = idOrOptions;
        }
        let c = cmp.setupComponent(constructor, options);
        if (id) {
            Vue.component(id, c);
        }
        return c;
    };
}
export function ref(refName) {
    return (target, propertyKey) => {
        reflection.addLifecycleHook(target, 'created', function () {
            Object.defineProperty(this, propertyKey, {
                get() {
                    return this.$refs[refName || propertyKey];
                }
            });
        });
    };
}
export function prop(options) {
    return (target, propertyKey) => {
        reflection.addDecorator(target, opts => {
            if (!opts.props) {
                opts.props = {};
            }
            opts.props[propertyKey] = options || {};
        });
    };
}
const dataSymbol = Symbol('vuts:data');
export function data(defaultValue) {
    return (target, propertyKey) => {
        let meta = target[dataSymbol];
        if (!meta) {
            target[dataSymbol] = meta = {};
            reflection.addDecorator(target, opts => {
                opts.data = () => {
                    let values = {};
                    for (let i in meta) {
                        if (meta.hasOwnProperty(i)) {
                            values[i] = meta[i]();
                        }
                    }
                    return values;
                };
            });
        }
        meta[propertyKey] = defaultValue || (() => null);
    };
}
const provideSymbol = Symbol('vuts:provide');
export function provide(name) {
    return (target, propertyKey) => {
        let meta = target[provideSymbol];
        if (!meta) {
            target[provideSymbol] = meta = {};
            reflection.addDecorator(target, opts => {
                opts.provide = function () {
                    const values = {};
                    for (let i in meta) {
                        if (meta.hasOwnProperty(i)) {
                            Object.defineProperty(values, i, {
                                enumerable: true,
                                get: () => this[propertyKey]
                            });
                        }
                    }
                    return values;
                };
            });
        }
        meta[name || propertyKey] = propertyKey;
    };
}
export function inject(name) {
    return (target, propertyKey) => {
        reflection.addDecorator(target, opts => {
            let meta = opts.inject || (opts.inject = {});
            meta[propertyKey] = {
                from: name || propertyKey
            };
        });
    };
}
export function watch(propName, watchOptions) {
    return (target, propertyKey, descriptor) => {
        reflection.addDecorator(target, componentOptions => {
            if (!componentOptions.watch) {
                componentOptions.watch = {};
            }
            componentOptions.watch[propName] = Object.assign({
                handler: descriptor.value,
                watchOptions
            });
        });
    };
}
export function beforeCreate(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeCreate', target[propertyKey]);
}
export function created(target, propertyKey) {
    reflection.addLifecycleHook(target, 'created', target[propertyKey]);
}
export function beforeMount(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeMount', target[propertyKey]);
}
export function mounted(target, propertyKey) {
    reflection.addLifecycleHook(target, 'mounted', target[propertyKey]);
}
export function beforeUpdate(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeUpdate', target[propertyKey]);
}
export function updated(target, propertyKey) {
    reflection.addLifecycleHook(target, 'updated', target[propertyKey]);
}
export function beforeDestroy(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeDestroy', target[propertyKey]);
}
export function destroyed(target, propertyKey) {
    reflection.addLifecycleHook(target, 'destroyed', target[propertyKey]);
}
//# sourceMappingURL=decorators.js.map