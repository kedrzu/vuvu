import Vue, { PropOptions, WatchOptions } from 'vue';

import * as cmp from './component';
import * as reflection from './reflection';

import { ComponentOptions } from './defs';

export function Component();
export function Component(options: ComponentOptions): any;
export function Component(id: string, options?: ComponentOptions): any;
export function Component(
    idOrOptions?: string | ComponentOptions,
    options?: ComponentOptions
): any {
    return <T>(constructor: T) => {
        let id: string = null;
        if (typeof idOrOptions === 'string') {
            id = idOrOptions;
        } else {
            options = idOrOptions;
        }

        let c = cmp.setupComponent(constructor as any, options);

        if (id) {
            Vue.component(id, c);
        }

        return c;
    };
}

export function Ref(refName?: string) {
    return (target: any, propertyKey: string) => {
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

export function Prop(options?: PropOptions) {
    return (target: any, propertyKey: string) => {
        let propMeta = getMeta(target, propSymbol) as any;
        if (!propMeta) {
            target[propSymbol] = propMeta = {};

            reflection.addDecorator(target, opts => {
                if (!opts.props) {
                    opts.props = propMeta;
                } else {
                    Object.assign(opts.props, propMeta);
                }
            });
        }

        propMeta[propertyKey] = options || {};
    };
}

const dataSymbol = Symbol('vuts:data');

export function Data(defaultValue?: () => any) {
    return (target: any, propertyKey: string) => {
        let dataMeta = getMeta(target, dataSymbol) as object;
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

export function Provide(name?: string) {
    return (target: any, propertyKey: string) => {
        let meta = getMeta(target, provideSymbol) as object;
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

export function Inject(name?: string) {
    return (target: any, propertyKey: string) => {
        reflection.addDecorator(target, opts => {
            let meta = opts.inject || ((opts.inject = {}) as object);
            meta[propertyKey] = {
                from: name || propertyKey
            };
        });
    };
}

export function Watch<T = any>(propName: keyof T, watchOptions?: WatchOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        reflection.addDecorator(target, componentOptions => {
            if (!componentOptions.watch) {
                componentOptions.watch = {};
            }

            componentOptions.watch[propName as string] = Object.assign({
                handler: descriptor.value,
                watchOptions
            });
        });
    };
}

export function BeforeCreate(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeCreate', target[propertyKey]);
}

export function Created(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'created', target[propertyKey]);
}

export function BeforeMount(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeMount', target[propertyKey]);
}

export function Mounted(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'mounted', target[propertyKey]);
}

export function BeforeUpdate(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeUpdate', target[propertyKey]);
}

export function Updated(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'updated', target[propertyKey]);
}

export function BeforeDestroy(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeDestroy', target[propertyKey]);
}

export function Destroyed(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'destroyed', target[propertyKey]);
}

function getMeta(target, symbol) {
    return target.hasOwnProperty(symbol) ? (target[symbol] as object) : null;
}
