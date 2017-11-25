import {
    Container,
    inject as inversifyInject,
    interfaces,
    optional as inversifyOptional
} from 'inversify';
import 'reflect-metadata';
import Vue from 'vue';

import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';
import * as defs from './defs';

export function inject(identifier?: interfaces.ServiceIdentifier<any>) {
    return <T>(target: any, propertyKey: string) => {
        injectCore(identifier, target, propertyKey);
    };
}

export function injectOptional(identifier?: interfaces.ServiceIdentifier<any>) {
    return <T>(target: any, propertyKey: string) => {
        injectCore(identifier, target, propertyKey, true);
    };
}

function injectCore(
    identifier: interfaces.ServiceIdentifier<any>,
    target: any,
    propertyKey: string,
    optional?: boolean
) {
    identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);

    if (target instanceof Vue) {
        // setup ioc configuration for this component
        reflection.addDecorator(target, componentOptions => {
            let injectOptions =
                componentOptions.iocInject || (componentOptions.iocInject = {});

            injectOptions[propertyKey] = {
                identifier: identifier,
                optional: optional
            };
        });

        // also add this property to be reactive
        decorators.data()(target, propertyKey);
    } else {
        inversifyInject(identifier)(target, propertyKey);
        if (optional) {
            inversifyOptional()(target, propertyKey);
        }
    }
}

export function provide(identifier?: interfaces.ServiceIdentifier<any>) {
    return <T>(target: any, propertyKey: string) => {
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
    };
}

export function register() {
    return <T>(constructor: T) => {
        return constructor;
    };
}
