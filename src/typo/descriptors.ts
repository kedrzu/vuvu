import { DefaultConstructor, Dictionary } from '../types';

const descriptors: Dictionary<Descriptor<any>> = {};

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
 * Describes a specific type of object
 */
export abstract class Descriptor<T extends WithType> {
    public readonly type: string;

    public make(props?: Partial<T>): T {
        let obj = {
            $type: this.type
        } as T;

        this.fill(obj);

        Object.assign(obj, props);
        return obj;
    }

    public abstract fill(obj: T): void;
}

/**
 * Marks object as having a type defined.
 */
export interface WithType<T = string> {
    $type: T;
}

/**
 * Retrieves descriptor for given type
 * @param type Name of type
 */
export function getDescriptorFor(type: string);

/**
 * Retrieves descriptor for given typed object
 * @param obj Object to retrieve descriptor for
 */
export function getDescriptorFor(obj: WithType);

export function getDescriptorFor(objOrType: WithType | string) {
    if (!objOrType) {
        return null;
    }

    if (typeof objOrType === 'string') {
        return descriptors[objOrType] || null;
    }

    if (objOrType.$type) {
        return descriptors[objOrType.$type] || null;
    }

    return null;
}

export function clearAllDescriptors() {
    for (let id of Object.keys(descriptors)) {
        delete descriptors[id];
    }
}