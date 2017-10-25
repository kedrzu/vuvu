import { Container } from 'inversify';
import Vue from 'vue';

const containerSymbol = Symbol('vuvu:ioc-container');

export function IocPlugin(vue: typeof Vue) {
    Object.defineProperty(vue.prototype, '$container', {
        get() {
            return this[containerSymbol];
        },
    });

    vue.mixin({
        created(this: Vue) {

            let container = this.$options.container || (this.$parent && this.$parent.$container);
            if (!container) {
                return;
            }

            // if component provides anything we need to create a child container
            // so child components would have their own dependency scope
            let provides = getProvideConfig(this);
            if (provides) {
                container = container.createChild();
            }

            this[containerSymbol] = container;

            // inject values
            let injects = getInjectConfig(this);
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

function getInjectConfig(vm: Vue) {
    return vm.$options.ioc && vm.$options.ioc.inject;
}

function getProvideConfig(vm: Vue) {
    return vm.$options.ioc && vm.$options.ioc.provide;
}

function setupContainer(vm: Vue) {
    if (vm.$options.container) {
        vm[containerSymbol] = vm.$options.container;
    } else if (vm.$parent && vm.$parent.$container) {
        vm[containerSymbol] = vm.$parent.$container;
    }
}
