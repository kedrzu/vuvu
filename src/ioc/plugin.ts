import Vue from 'vue';

const containerSymbol = Symbol('vuvu:ioc-container');

export function IocPlugin(vue: typeof Vue) {
    Object.defineProperty(vue.prototype, '$container', {
        get() {
            return this[containerSymbol];
        }
    });

    vue.directive('ioc-container', {});

    // allows to use custom component options
    vue.config.optionMergeStrategies.iocInject = iocOptionMerge;
    vue.config.optionMergeStrategies.iocProvide = iocOptionMerge;

    vue.mixin({
        created(this: Vue) {
            // takes container that is specified in options
            let container = this.$options.container;

            // try get container provided by directive
            if (!container && this.$vnode && this.$vnode.data.directives) {
                let directive = this.$vnode.data.directives.find(d => d.name === 'ioc-container');

                container = directive && directive.value;
            }

            // try get container from parent
            if (!container) {
                container = this.$parent && this.$parent.$container;
            }

            // no container found - nothing to do here
            if (!container) {
                return;
            }

            // if component provides anything we need to create a child container
            // so child components would have their own dependency scope
            let provides = this.$options.iocProvide;
            if (provides) {
                container = container.createChild();
            }

            this[containerSymbol] = container;

            // configure provided values
            if (provides) {
                for (let prop of Object.keys(provides)) {
                    let provideConfig = provides[prop];

                    if (provideConfig.resolve) {
                        // provided value will resolved now and serve as singleton for child components
                        container
                            .bind(provideConfig.identifier)
                            .to(provideConfig.resolve)
                            .inSingletonScope();
                    } else {
                        // provided value will be resolved at runtime with
                        // object property or function call
                        container.bind(provideConfig.identifier).toDynamicValue(() => {
                            let value = this[prop];
                            return typeof value === 'function' ? value.call(this) : value;
                        });
                    }
                }
            }

            // inject values
            let injects = this.$options.iocInject;
            if (injects) {
                for (let prop of Object.keys(injects)) {
                    let injectConfig = injects[prop];

                    if (!injectConfig.optional || container.isBound(injectConfig.identifier)) {
                        this[prop] = container.get(injectConfig.identifier);
                    }
                }
            }
        }
    });
}

function iocOptionMerge(parentVal, childVal) {
    return parentVal || childVal ? Object.assign({}, parentVal, childVal) : null;
}
