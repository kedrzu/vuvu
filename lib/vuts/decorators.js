"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const cmp = require("./component");
const reflection = require("./reflection");
function component(id, options) {
    return (constructor) => {
        let c = cmp.setupComponent(constructor, options);
        if (id) {
            vue_1.default.component(id, c);
        }
        return c;
    };
}
exports.component = component;
function ref(refName) {
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
exports.ref = ref;
function prop(options) {
    return (target, propertyKey) => {
        reflection.addDecorator(target, opts => {
            if (!opts.props) {
                opts.props = {};
            }
            opts.props[propertyKey] = options || {};
        });
    };
}
exports.prop = prop;
const dataSymbol = Symbol('vuts:data');
function data() {
    return (target, propertyKey) => {
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
exports.data = data;
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
function watch(propName, watchOptions) {
    return (target, propertyKey, descriptor) => {
        reflection.addDecorator(target, componentOptions => {
            if (!componentOptions.watch) {
                componentOptions.watch = {};
            }
            componentOptions.watch[propName] = Object.assign({ handler: descriptor.value, watchOptions });
        });
    };
}
exports.watch = watch;
function beforeCreate(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeCreate', target[propertyKey]);
}
exports.beforeCreate = beforeCreate;
function created(target, propertyKey) {
    reflection.addLifecycleHook(target, 'created', target[propertyKey]);
}
exports.created = created;
function beforeMount(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeMount', target[propertyKey]);
}
exports.beforeMount = beforeMount;
function mounted(target, propertyKey) {
    reflection.addLifecycleHook(target, 'mounted', target[propertyKey]);
}
exports.mounted = mounted;
function beforeUpdate(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeUpdate', target[propertyKey]);
}
exports.beforeUpdate = beforeUpdate;
function updated(target, propertyKey) {
    reflection.addLifecycleHook(target, 'updated', target[propertyKey]);
}
exports.updated = updated;
function beforeDestroy(target, propertyKey) {
    reflection.addLifecycleHook(target, 'beforeDestroy', target[propertyKey]);
}
exports.beforeDestroy = beforeDestroy;
function destroyed(target, propertyKey) {
    reflection.addLifecycleHook(target, 'destroyed', target[propertyKey]);
}
exports.destroyed = destroyed;
//# sourceMappingURL=decorators.js.map