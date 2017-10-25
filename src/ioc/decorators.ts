import { Container, inject as inversifyInject } from 'inversify';
import 'reflect-metadata';
import Vue from 'vue';

import * as decorators from '../vuts/decorators';
import * as reflection from '../vuts/reflection';

interface PropertyInjectMetadata {
    [prop: string]: any;
}

const injectSymbol = Symbol('vuvu:inject');

export function inject(identifier?: symbol | string) {
    return <T>(target: any, propertyKey: string) => {

        const injectIdentitier = identifier || Reflect.getMetadata('design:type', target, propertyKey);

        if (target instanceof Vue) {
            let meta = target[injectSymbol] as {};

            decorators.data()(target, propertyKey);

            if (!meta) {
                target[injectSymbol] = meta = {};
                reflection.addLifecycleHook(target, 'created', createInjectLifecycleHook(meta));
            }

            meta[propertyKey] = injectIdentitier;

        } else {
            inversifyInject(injectIdentitier)(target, propertyKey);
        }
    };
}

function createInjectLifecycleHook(meta: {}) {
    return function injectLifecycleHook(this: Vue) {
        for (let i of Object.keys(meta)) {
            let resolved = this.$container.resolve(meta[i]);
            this[i] = resolved;
        }
    };
}
