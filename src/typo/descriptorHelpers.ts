import { DefaultConstructor } from '../types';

import { Descriptor, Typed } from './descriptor';
import { descriptors } from './descriptorRegister';

/**
 * Registers descriptor for specific type
 * @param type Name of the type to register descriptor for
 */
export function DescriptorFor(type: string) {
    return <T extends Descriptor<any>>(constructor: DefaultConstructor<T>) => {

        if (process.env.NODE_ENV !== 'production') {
            if (!type) {
                throw new Error('Type cannot be null or empty');
            }

            if (descriptors[type]) {
                throw new Error(`Descriptor for type ${type} is already registered`);
            }
        }

        let descriptor = new constructor();
        let proto = constructor.prototype as any;

        proto.type = type;

        descriptor = Object.freeze(descriptor);

        descriptors[type] = descriptor;

        return constructor;
    };
}

/**
 * Retrieves descriptor for given type
 * @param type Name of type
 */
export function getDescriptorFor(type: string): Descriptor;

/**
 * Retrieves descriptor for given typed object
 * @param obj Object to retrieve descriptor for
 */
export function getDescriptorFor(obj: Typed): Descriptor;

export function getDescriptorFor(objOrType: Typed | string): Descriptor {
    if (!objOrType) {
        return null;
    }

    if (typeof objOrType === 'string') {
        return descriptors[objOrType] || null;
    }

    if (objOrType.$type) {
        return descriptors[objOrType.$type] || null;
    }

    return undefined;
}

export function clearAllDescriptors() {
    for (let id of Object.keys(descriptors)) {
        delete descriptors[id];
    }
}