import Vue, { PropOptions, WatchOptions } from 'vue';

import * as cmp from './component';
import * as defs from './defs';
import * as reflection from './reflection';

export function component(id?: string, options?: defs.ComponentOptions) {
    return <T>(constructor: T) => {
        let c = cmp.setupComponent(constructor as any, options);

        if (id) {
            Vue.component(id, c);
        }

        return c;
    };
}

export function ref(refName?: string) {
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

export function prop(options?: PropOptions) {
    return (target: any, propertyKey: string) => {
        reflection.addDecorator(target, opts => {
            if (!opts.props) {
                opts.props = {};
            }

            opts.props[propertyKey] = options || {};
        });
    };
}

const dataSymbol = Symbol('vuts:data');

export function data() {
    return (target: any, propertyKey: string) => {

        let meta = target[dataSymbol];
        if (!meta) {
            target[dataSymbol] = meta = {};

            reflection.addDecorator(target, opts => {
                opts.data = () => Object.assign({}, meta);
            });
        }

        meta[propertyKey] = null;
    };
}

// export function provide(name?: string) {
//     return (target: any, propertyKey: string) => {
//         config.setComponentMeta(target, config.provideSymbol, name || propertyKey, propertyKey);
//     };
// }

// export function inject(propName?: string) {
//     return (target: any, propertyKey: string) => {
//         config.setComponentMeta(target, config.injectSymbol, propName || propertyKey, null);
//     };
// }

export function watch<T = any>(propName: keyof T, watchOptions?: WatchOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        reflection.addDecorator(target, componentOptions => {
            if (!componentOptions.watch) {
                componentOptions.watch = {};
            }

            componentOptions.watch[propName] = Object.assign({ handler: descriptor.value, watchOptions });
        });
    };
}

export function beforeCreate(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeCreate', target[propertyKey]);
}

export function created(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'created', target[propertyKey]);
}

export function beforeMount(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeMount', target[propertyKey]);
}

export function mounted(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'mounted', target[propertyKey]);
}

export function beforeUpdate(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeUpdate', target[propertyKey]);
}

export function updated(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'updated', target[propertyKey]);
}

export function beforeDestroy(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'beforeDestroy', target[propertyKey]);
}

export function destroyed(target: any, propertyKey: string) {
    reflection.addLifecycleHook(target, 'destroyed', target[propertyKey]);
}
