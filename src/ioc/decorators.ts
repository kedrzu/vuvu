import { Container, interfaces } from 'inversify';
import { inject as inversifyInject, optional as inversifyOptional } from 'inversify';
import { isPlainObject, isString, isSymbol } from 'lodash';

import 'reflect-metadata';
import Vue from 'vue';

import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';
import * as defs from './defs';

export interface InjectConfig {
    optional?: boolean;
}

export function Inject(config?: InjectConfig);
export function Inject<T>(identifier: interfaces.ServiceIdentifier<T>, config?: InjectConfig);
export function Inject<T>(
    identifierOrConfig?: interfaces.ServiceIdentifier<T> | InjectConfig,
    config?: InjectConfig
) {
    let identifier = identifierOrConfig as interfaces.ServiceIdentifier<T>;

    if (isPlainObject(identifierOrConfig)) {
        config = identifierOrConfig as InjectConfig;
        identifier = null;
    }

    return (target: any, propertyKey: string) => {
        identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);

        validateServiceIdentifier(identifier);

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
        } else {
            inversifyInject(identifier)(target, propertyKey);
            if (optional) {
                inversifyOptional()(target, propertyKey);
            }
        }
    };
}

export function Provide(identifier?: interfaces.ServiceIdentifier<any>) {
    return <T>(target: any, propertyKey: string, descriptor?: PropertyDescriptor) => {
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

function validateServiceIdentifier(identifier: interfaces.ServiceIdentifier<any>) {
    // TODO: add if statement for webpack builds

    // strings and symbols are valid
    if (isString(identifier) || isSymbol(identifier)) {
        return;
    }

    if (identifier == null) {
        throw new Error('Identifier of injected service is not defined');
    }

    let prohibited = [Object, Number, Boolean, String];

    if (prohibited.indexOf(identifier as any) >= 0) {
        throw new Error(`Identifier of injected service '${identifier}' is not valid`);
    }
}
