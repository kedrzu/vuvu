import { inject as inversifyInject, optional as inversifyOptional } from 'inversify';
import isPlainObject from 'lodash/isPlainObject';
import isSymbol from 'lodash/isSymbol';
import 'reflect-metadata';
import Vue from 'vue';
import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';
export function Inject(typeOrConfig) {
    let optional = false;
    let identifier;
    if (isPlainObject(typeOrConfig)) {
        let config = typeOrConfig;
        optional = !!config.optional;
        identifier = config.type;
    }
    else {
        identifier = typeOrConfig;
    }
    return (target, propertyKey) => {
        identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);
        validateServiceIdentifier(identifier);
        if (target instanceof Vue) {
            // setup ioc configuration for this component
            reflection.addDecorator(target, options => {
                setInjectOptions(options, propertyKey, {
                    identifier: identifier,
                    optional: optional
                });
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
export function Provide(typeOrConfig) {
    let identifier;
    let resolve;
    if (isPlainObject(typeOrConfig)) {
        let config = typeOrConfig;
        identifier = config.type;
        resolve = config.resolve;
    }
    else {
        identifier = typeOrConfig;
    }
    return (target, propertyKey, descriptor) => {
        identifier =
            identifier ||
                Reflect.getMetadata('design:returntype', target, propertyKey) ||
                Reflect.getMetadata('design:type', target, propertyKey);
        if (resolve === true) {
            resolve = identifier;
        }
        else if (resolve === false) {
            resolve = null;
        }
        // setup ioc provide configuration for this component
        reflection.addDecorator(target, options => {
            setProvideOptions(options, propertyKey, {
                identifier: identifier,
                resolve: resolve
            });
            if (resolve) {
                setInjectOptions(options, propertyKey, {
                    identifier: identifier
                });
            }
        });
        // if it's basic attribute, set this to be reactive
        if (!descriptor) {
            decorators.Data()(target, propertyKey);
        }
    };
}
function validateServiceIdentifier(identifier) {
    // TODO: add if statement for webpack builds
    // strings and symbols are valid
    if (typeof identifier === 'string' || isSymbol(identifier)) {
        return;
    }
    if (identifier == null) {
        throw new Error('Identifier of injected service is not defined');
    }
    let prohibited = [Object, Number, Boolean, String];
    if (prohibited.indexOf(identifier) >= 0) {
        throw new Error(`Identifier of injected service '${identifier}' is not valid`);
    }
}
function setInjectOptions(componentOptions, property, options) {
    let injectOptions = componentOptions.iocInject || (componentOptions.iocInject = {});
    injectOptions[property] = options;
}
function setProvideOptions(componentOptions, property, options) {
    let provideOptions = componentOptions.iocProvide || (componentOptions.iocProvide = {});
    provideOptions[property] = options;
}
//# sourceMappingURL=decorators.js.map