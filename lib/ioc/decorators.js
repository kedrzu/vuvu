import { inject as inversifyInject, optional as inversifyOptional } from 'inversify';
import { isPlainObject } from 'lodash';
import 'reflect-metadata';
import Vue from 'vue';
import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';
export function Inject(identifierOrConfig, config) {
    let identifier = identifierOrConfig;
    if (isPlainObject(identifierOrConfig)) {
        config = identifierOrConfig;
        identifier = null;
    }
    return (target, propertyKey) => {
        identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);
        let optional = config && config.optional;
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
            decorators.Data()(target, propertyKey);
        }
        else {
            inversifyInject(identifier)(target, propertyKey);
            if (optional) {
                inversifyOptional()(target, propertyKey);
            }
        }
    };
}
export function Provide(identifier) {
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
            decorators.Data()(target, propertyKey);
        }
    };
}
// export function Register() {
//     return <T>(constructor: T) => {
//         return constructor;
//     };
// }
//# sourceMappingURL=decorators.js.map