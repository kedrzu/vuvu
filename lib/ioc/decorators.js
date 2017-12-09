import { inject as inversifyInject, optional as inversifyOptional } from 'inversify';
import 'reflect-metadata';
import Vue from 'vue';
import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';
export function inject(identifier) {
    return (target, propertyKey) => {
        injectCore(identifier, target, propertyKey);
    };
}
export function injectOptional(identifier) {
    return (target, propertyKey) => {
        injectCore(identifier, target, propertyKey, true);
    };
}
function injectCore(identifier, target, propertyKey, optional) {
    identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);
    if (target instanceof Vue) {
        // setup ioc configuration for this component
        reflection.addDecorator(target, componentOptions => {
            let injectOptions = componentOptions.iocInject || (componentOptions.iocInject = {});
            injectOptions[propertyKey] = {
                identifier: identifier,
                optional: optional
            };
        });
        // also add this property to be reactive
        decorators.data()(target, propertyKey);
    }
    else {
        inversifyInject(identifier)(target, propertyKey);
        if (optional) {
            inversifyOptional()(target, propertyKey);
        }
    }
}
export function provide(identifier) {
    return (target, propertyKey, descriptor) => {
        identifier =
            identifier ||
                Reflect.getMetadata('design:returntype', target, propertyKey) ||
                Reflect.getMetadata('design:type', target, propertyKey);
        // setup ioc provide configuration for this component
        reflection.addDecorator(target, options => {
            let provideOptions = options.iocProvide || (options.iocProvide = {});
            provideOptions[propertyKey] = {
                identifier: identifier
            };
        });
        // if it's basic attribute, set this to be reactive
        if (!descriptor) {
            decorators.data()(target, propertyKey);
        }
    };
}
export function register() {
    return (constructor) => {
        return constructor;
    };
}
//# sourceMappingURL=decorators.js.map