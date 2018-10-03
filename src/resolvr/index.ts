
import { AbstractConstructor, Constructor, DefaultConstructor, Dictionary } from '../types';

export interface ResolvableOptions {
    for: AbstractConstructor;
    role?: string | symbol;
    order?: number;
}

interface ResolvableTypeDescriptor {
    type: Constructor;
    order: number;
}

const metadataSymbol = Symbol.for('vuvu:resolvr');

interface ResolvableMetadata {
    types: Dictionary<ResolvableTypeDescriptor[]>;
    parent?: ResolvableMetadata;
}

export function Resolvable(options: ResolvableOptions) {
    return <T>(constructor: Constructor<T>) => {
        let meta = getMetadata(options.for.prototype);
        let role = (options.role || null) as string;
        let types = meta.types[role] || (meta.types[role] = []);

        types.push({
            type: constructor,
            order: options.order || Number.MAX_SAFE_INTEGER
        });

        types.sort((a, b) => a.order - b.order);
    };
}

function getMetadata(proto: any): ResolvableMetadata {
    let meta = Reflect.getOwnMetadata(metadataSymbol, proto) as ResolvableMetadata;

    if (!meta) {
        meta = {
            types: {}
        };

        let parent = Reflect.getPrototypeOf(proto);
        if (parent && parent !== Object.prototype) {
            meta.parent = getMetadata(parent);
        }

        Reflect.defineMetadata(metadataSymbol, meta, proto);
    }

    return meta;
}

export interface ResolveOptions {
    for: AbstractConstructor | object;
    role?: string;
}

export function resolveTypes(options: ResolveOptions): Constructor[] {

    let resolveFor = options.for as any;
    let proto = resolveFor.prototype || Object.getPrototypeOf(resolveFor);
    let meta = getMetadata(proto);
    let role = options.role || null;

    let types: Constructor[] = [];

    while (meta) {
        let forRole = meta.types[role];

        if (forRole) {
            for (let descriptor of forRole) {
                types.push(descriptor.type);
            }
        }

        meta = meta.parent;
    }

    return types;
}
