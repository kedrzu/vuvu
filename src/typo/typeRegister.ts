import isFunction from 'lodash/isFunction';
import Vue from 'vue';

import { Injectable } from '../ioc';
import { Constructor, Dictionary } from '../types';
import { Descriptor, Typed } from './descriptor';
import { getDescriptorFor } from './descriptorHelpers';

type TypeFrom<T extends Typed> = string | Descriptor<T> | Constructor<Descriptor<T>>;

export interface TypeRegisterEntry<TTo, TFrom extends Typed = Typed> {
    from: TypeFrom<TFrom>;
    to: TTo;
}

export interface TypeRegisterConfig<TTo, TFrom extends Typed = Typed> {
    types?: Array<TypeRegisterEntry<TTo, TFrom>>;
}

@Injectable()
export class SingleTypeRegister<TTo, TFrom extends Typed = Typed> {
    private register: Dictionary<TTo> = {};

    constructor(config?: TypeRegisterConfig<TTo, TFrom>) {
        if (config && config.types) {
            for (let entry of config.types) {
                this.add(entry);
            }
        }
    }

    public add(entry: TypeRegisterEntry<TTo, TFrom>): void {
        let descriptor = getDescriptor(entry.from);
        Vue.set(this.register, descriptor.type, entry.to);
    }

    public get(from: TypeFrom<TFrom>): TTo {
        let descriptor = getDescriptor(from);
        if (!descriptor) {
            return undefined;
        }

        return this.register[descriptor.type];
    }
}

@Injectable()
export class MultiTypeRegister<TTo, TFrom extends Typed = Typed> {
    private register: Dictionary<TTo[]> = {};

    constructor(config?: TypeRegisterConfig<TTo, TFrom>) {
        if (config && config.types) {
            for (let entry of config.types) {
                this.add(entry);
            }
        }
    }

    public add(entry: TypeRegisterEntry<TTo, TFrom>): void {
        let descriptor = getDescriptor(entry.from);

        let key = descriptor.type;
        let array = this.register[key];
        if (!array) {
            array = [entry.to];
            Vue.set(this.register, key, array);
        } else {
            array.push(entry.to);
        }
    }

    public get(from: TypeFrom<TFrom>): TTo[] {
        let descriptor = getDescriptor(from);
        if (!descriptor) {
            return [];
        }

        let descriptorProto = Object.getPrototypeOf(descriptor);
        let result: TTo[] = [];

        while (descriptor) {
            let key = descriptor.type;
            let array = this.register[key];
            if (array) {
                result.splice(0, 0, ...array);
            }

            descriptorProto = Object.getPrototypeOf(descriptorProto);
            if (descriptorProto === Object.prototype) {
                break;
            }

            descriptor = new descriptorProto.constructor();
        }

        return result;
    }
}

function getDescriptor(from: TypeFrom<Typed>): Descriptor {
    if (!from) {
        return undefined;
    }

    if (typeof from === 'string') {
        let descriptor = getDescriptorFor(from);
        if (!descriptor) {
            if (!descriptor) {
                throw new Error(`No descriptor defined for ${from}`);
            }
        }
        return descriptor;
    } else if (isFunction(from)) {
        let ctor = from as Constructor<Descriptor>;
        return new ctor();
    } else {
        return from as Descriptor;
    }
}