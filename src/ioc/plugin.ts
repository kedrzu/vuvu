import { Container } from 'inversify';
import Vue from 'vue';

const containerSymbol = Symbol('vuvu:ioc-container');

export function IocPlugin(vue: typeof Vue) {
    Object.defineProperty(vue.prototype, '$container', {
        get() {
            return this[containerSymbol];
        },
    });

    // allows to use custom component options
    vue.config.optionMergeStrategies.iocInject = iocOptionMerge;
    vue.config.optionMergeStrategies.iocProvide = iocOptionMerge;

    vue.mixin({

        created(this: Vue) {

            // takes container that is specified in options or inherits it from parent
            let container = this.$options.container || (this.$parent && this.$parent.$container);
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

            // inject values
            let injects = this.$options.iocInject;
            if (injects) {
                for (let prop of Object.keys(injects)) {
                    let identifier = injects[prop];

                    this[prop] = container.get(identifier);
                }
            }

            // configure provided values
            if (provides) {
                for (let prop of Object.keys(provides)) {
                    let identifier = provides[prop];

                    // provided value will be resolved at runtime with
                    // object property or function call
                    container.bind(identifier).toDynamicValue(() => {
                        let value = this[prop];
                        return typeof value === 'function' ? value.call(this) : value;
                    });
                }
            }
        }
    });
}

function iocOptionMerge(parentVal, childVal) {
    return parentVal || childVal ? Object.assign({}, parentVal, childVal) : null;
}
