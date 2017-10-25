import { Container, inject as inversifyInject, interfaces } from 'inversify';
import 'reflect-metadata';
import Vue from 'vue';

import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';

interface PropertyInjectMetadata {
    [prop: string]: any;
}

export function inject(identifier?: interfaces.ServiceIdentifier<any>) {
    return <T>(target: any, propertyKey: string) => {

        identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);

        if (target instanceof Vue) {

            // setup ioc configuration for this component
            reflection.addDecorator(target, options => {
                let iocOptions = options.ioc || (options.ioc = {});
                let injectOptions = iocOptions.inject || (iocOptions.inject = {});

                injectOptions[propertyKey] = identifier;
            });

            // also add this property to be reactive
            decorators.data()(target, propertyKey);
        } else {
            inversifyInject(identifier)(target, propertyKey);
        }
    };
}

export function provide(identifier?: interfaces.ServiceIdentifier<any>) {
    return <T>(target: any, propertyKey: string) => {

        identifier = identifier
            || Reflect.getMetadata('design:returntype', target, propertyKey)
            || Reflect.getMetadata('design:type', target, propertyKey);

        // setup ioc provide configuration for this component
        reflection.addDecorator(target, options => {
            let iocOptions = options.ioc || (options.ioc = {});
            let provideOptions = iocOptions.provide || (iocOptions.provide = {});

            provideOptions[propertyKey] = identifier;
        });
    };
}
