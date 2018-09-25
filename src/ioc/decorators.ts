import { interfaces } from 'inversify';
import { inject as inversifyInject, optional as inversifyOptional } from 'inversify';
import isPlainObject from 'lodash/isPlainObject';
import isSymbol from 'lodash/isSymbol';

import 'reflect-metadata';
import Vue from 'vue';

import * as types from '../types';
import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';
import * as defs from './defs';

export interface InjectConfig<T> {
    optional?: boolean;
    type?: interfaces.ServiceIdentifier<T>;
}

export interface ProvideConfig<T> {
    resolve?: boolean | types.Constructor<T>;
    type?: interfaces.ServiceIdentifier<T>;
}

export function Inject<T>(config?: InjectConfig<T>);
export function Inject<T>(type: interfaces.ServiceIdentifier<T>);
export function Inject<T>(typeOrConfig?: interfaces.ServiceIdentifier<T> | InjectConfig<T>) {
    let optional = false;
    let identifier: interfaces.ServiceIdentifier<T>;

    if (isPlainObject(typeOrConfig)) {
        let config = typeOrConfig as InjectConfig<T>;
        optional = !!config.optional;
        identifier = config.type;
    } else {
        identifier = typeOrConfig as interfaces.ServiceIdentifier<T>;
    }

    return (target: any, propertyKey: string) => {
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
        } else {
            inversifyInject(identifier)(target, propertyKey);
            if (optional) {
                inversifyOptional()(target, propertyKey);
            }
        }
    };
}

export function Provide<T>(config?: ProvideConfig<T>);
export function Provide<T>(type: interfaces.ServiceIdentifier<T>);
export function Provide<T>(typeOrConfig?: interfaces.ServiceIdentifier<T> | ProvideConfig<T>) {
    let identifier: interfaces.ServiceIdentifier<T>;
    let resolve: boolean | types.Constructor<T>;

    if (isPlainObject(typeOrConfig)) {
        let config = typeOrConfig as ProvideConfig<T>;
        identifier = config.type;
        resolve = config.resolve;
    } else {
        identifier = typeOrConfig as interfaces.ServiceIdentifier<T>;
    }

    return (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
        identifier =
            identifier ||
            Reflect.getMetadata('design:returntype', target, propertyKey) ||
            Reflect.getMetadata('design:type', target, propertyKey);

        if (resolve === true) {
            resolve = identifier as types.Constructor;
        } else if (resolve === false) {
            resolve = null;
        }

        // setup ioc provide configuration for this component
        reflection.addDecorator(target, options => {
            setProvideOptions(options, propertyKey, {
                identifier: identifier,
                resolve: resolve as types.Constructor<T>
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

function validateServiceIdentifier(identifier: interfaces.ServiceIdentifier<any>) {
    // TODO: add if statement for webpack builds

    // strings and symbols are valid
    if (typeof identifier === 'string' || isSymbol(identifier)) {
        return;
    }

    if (identifier == null) {
        throw new Error('Identifier of injected service is not defined');
    }

    let prohibited = [Object, Number, Boolean, String];

    if (prohibited.indexOf(identifier as any) >= 0) {
        throw new Error(`Identifier of injected service '${identifier as any}' is not valid`);
    }
}

function setInjectOptions(componentOptions: any, property: string, options: defs.InjectConfig) {
    let injectOptions = componentOptions.iocInject || (componentOptions.iocInject = {});
    injectOptions[property] = options;
}

function setProvideOptions(componentOptions: any, property: string, options: defs.ProvideConfig) {
    let provideOptions = componentOptions.iocProvide || (componentOptions.iocProvide = {});
    provideOptions[property] = options;
}
