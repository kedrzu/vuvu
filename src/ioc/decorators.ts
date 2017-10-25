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
                let injectOptions = options.iocInject || (options.iocInject = {});

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
            let provideOptions = options.iocProvide || (options.iocProvide = {});

            provideOptions[propertyKey] = identifier;
        });
    };
}
