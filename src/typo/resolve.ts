import { AbstractConstructor, Constructor, DefaultConstructor, Dictionary } from '../types';
import { Descriptor, DescriptorFor, getDescriptorFor, WithType } from './descriptors';

export interface ResolvableOptions<T> {
    for: DefaultConstructor<Descriptor<any>>;
    as?: AbstractConstructor<T>;
    role?: string | symbol;
    order?: number;
}

interface ResolvableMetadata {
    typeSymbol: symbol;
}

const metadataSymbol = Symbol.for('vuvu:resolvr');

interface ResolvableTypeDescriptor {
    type: Constructor;
    order: number;
}

interface ResolvableTypesPerRole { [role: string]: ResolvableTypeDescriptor[]; }
interface ResolvableTypesPerBase { [type: string]: ResolvableTypesPerRole; }

interface DescriptorMetadata {
    types: ResolvableTypesPerBase;
    parent?: DescriptorMetadata;
}

export function ResolvableType<TBase>(options: ResolvableOptions<TBase>) {
    return <T extends Constructor<TBase>>(constructor: T) => {

        if (process.env.NODE_ENV !== 'production') {
            if (options.as && (constructor.prototype instanceof (options.as as any)) === false) {
                throw new Error(`Resolvable type ${constructor.name} must derive from ${options.as.name}`);
            }
        }

        let meta = getMetadata(options.for.prototype);
        let baseSymbol = getSymbolFor(options.as) as any;
        let role = (options.role || null) as any;

        let typesForBase = meta.types[baseSymbol] || (meta.types[baseSymbol] = {});
        let typesForRole = typesForBase[role] || (typesForBase[role] = []);

        typesForRole.push({
            type: constructor,
            order: options.order || Number.MAX_SAFE_INTEGER
        });

        typesForRole.sort((a, b) => a.order - b.order);

        return constructor;
    };
}

function getSymbolFor(type: AbstractConstructor): symbol {
    if (!type) {
        return null;
    }

    let meta: ResolvableMetadata =
        type[metadataSymbol] ||
        (type[metadataSymbol] = { typeSymbol: Symbol() });

    return meta.typeSymbol;
}

function getMetadata(proto: any): DescriptorMetadata {
    let meta = Reflect.getOwnMetadata(metadataSymbol, proto) as DescriptorMetadata;

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

export interface ResolveOptions<T = any> {
    for: string | object;
    as?: AbstractConstructor<T>;
    role?: string | symbol;
}

export function resolveTypes<T>(options: ResolveOptions<T>): Array<Constructor<T>> {

    let descriptor = getDescriptorFor(options.for as WithType);
    if (!descriptor) {
        return [];
    }

    let descriptorProto = Object.getPrototypeOf(descriptor);
    let descriptorMeta = getMetadata(descriptorProto);
    let baseSymbol = getSymbolFor(options.as) as any;
    let role = options.role || null as any;

    let types: Constructor[] = [];

    while (descriptorMeta) {
        let forBase = descriptorMeta.types[baseSymbol];
        let forRole = forBase && forBase[role];

        if (forRole) {
            for (let resolvable of forRole) {
                types.push(resolvable.type);
            }
        }

        descriptorMeta = descriptorMeta.parent;
    }

    return types;
}