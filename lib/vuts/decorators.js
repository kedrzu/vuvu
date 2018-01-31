import Vue from 'vue';
import * as cmp from './component';
import * as reflection from './reflection';
export function Component(idOrOptions, options) {
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
export function Ref(refName) {
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
const propSymbol = Symbol('vuts:prop');
export function Prop(options) {
    return (target, propertyKey) => {
        let propMeta = getMeta(target, propSymbol);
        if (!propMeta) {
            target[propSymbol] = propMeta = {};
            reflection.addDecorator(target, opts => {
                if (!opts.props) {
                    opts.props = propMeta;
                }
                else {
                    Object.assign(opts.props, propMeta);
                }
            });
        }
        propMeta[propertyKey] = options || {};
    };
}
const dataSymbol = Symbol('vuts:data');
export function Data(defaultValue) {
    return (target, propertyKey) => {
        let dataMeta = getMeta(target, dataSymbol);
        if (!dataMeta) {
            target[dataSymbol] = dataMeta = {};
            reflection.addDecorator(target, opts => {
                opts.data = () => {
                    let values = {};
                    for (let i in dataMeta) {
                        if (dataMeta.hasOwnProperty(i)) {
                            values[i] = dataMeta[i]();
                        }
                    }
                    return values;
                };
            });
        }
        dataMeta[propertyKey] = defaultValue || (() => null);
    };
}
const provideSymbol = Symbol('vuts:provide');
export function Provide(name) {
    return (target, propertyKey) => {
        let meta = getMeta(target, provideSymbol);
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
export function Inject(name) {
    return (target, propertyKey) => {
        reflection.addDecorator(target, opts => {
            let meta = opts.inject || (opts.inject = {});
            meta[propertyKey] = {
                from: name || propertyKey
            };
        });
    };
}
export function Watch(propName, watchOptions) {
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
export function BeforeCreate(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeCreate', target[propertyKey]);
}
export function Created(target, propertyKey) {
    reflection.addLifecycleHook(target, 'created', target[propertyKey]);
}
export function BeforeMount(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeMount', target[propertyKey]);
}
export function Mounted(target, propertyKey) {
    reflection.addLifecycleHook(target, 'mounted', target[propertyKey]);
}
export function BeforeUpdate(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeUpdate', target[propertyKey]);
}
export function Updated(target, propertyKey) {
    reflection.addLifecycleHook(target, 'updated', target[propertyKey]);
}
export function BeforeDestroy(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeDestroy', target[propertyKey]);
}
export function Destroyed(target, propertyKey) {
    reflection.addLifecycleHook(target, 'destroyed', target[propertyKey]);
}
function getMeta(target, symbol) {
    return target.hasOwnProperty(symbol) ? target[symbol] : null;
}
//# sourceMappingURL=decorators.js.map