import { Constructor, Dictionary } from 'vuvu/types';

import { getAllMetadata } from '../reflection';

export interface TypoConfig {
    id?: string;
    name?: string;
}

export interface TypoDescriptor extends TypoConfig {
    type: Constructor;
    props: Dictionary<TypoPropertyDescriptor>;
}

export interface TypoPropertyDescriptor {
    json: boolean;
    type: Constructor;
}

export interface TypoPropertyOptions {
    json?: boolean;
}

const typeSymbol = Symbol.for('vuvu:typo:type');
const abstractSymbol = Symbol.for('vuvu:typo:abstract');

const types: Dictionary<TypoDescriptor> = {};

export function AbstractType() {
    return genericTypo({}, true) as <T>(constructor: T) => T;
}

export function Type(config?: TypoConfig);
export function Type(id: string);
export function Type(idOrConfig?: string | TypoConfig) {
    if (typeof idOrConfig === 'string') {
        return genericTypo({ id: idOrConfig }, false);
    }

    return genericTypo(idOrConfig || {}, false);
}

function genericTypo(config: TypoConfig, abstract: boolean) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        let ownProps = getOwnPropsMeta(constructor.prototype) || {};
        let allProps = getAllPropsMeta(constructor.prototype) || {};

        let propNames = Object.keys(ownProps);

        if (process.env.NODE_ENV !== 'production') {
            constructor.prototype[abstractSymbol] = abstract;
        }

        let extended = class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                if (process.env.NODE_ENV !== 'production') {
                    if (this[abstractSymbol]) {
                        throw new Error(`You cannot instantiate abstract type ${constructor.name}`);
                    }
                }

                for (let prop of propNames) {
                    if (this[prop] === undefined) {
                        this[prop] = null;
                    }
                }
            }
        };

        let descriptor: TypoDescriptor = {
            id: config.id || null,
            name: config.name || null,
            type: extended,
            props: allProps
        };

        constructor.prototype.toJSON = function () {
            let obj = Object.assign({}, this);

            if (descriptor.id) {
                obj.$type = descriptor.id;
            }

            for (let key of Object.keys(obj)) {
                let prop = allProps[key];
                if (prop && prop.json === false) {
                    delete obj[key];
                }
            }

            return obj;
        };

        if (descriptor.id) {
            types[descriptor.id] = descriptor;
        }
        descriptor.type[typeSymbol] = descriptor;

        return descriptor.type as T;
    };
}

const propsSymbol = Symbol.for('vuvu:typo:props');
export function Property(options?: TypoPropertyOptions) {
    options = options || {};
    return function <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
        let targetMeta = getOwnPropsMeta(target);
        if (!targetMeta) {
            targetMeta = {};
            Reflect.defineMetadata(propsSymbol, targetMeta, target);
        }

        let propType =
            Reflect.getMetadata('design:returntype', target, propertyKey) ||
            Reflect.getMetadata('design:type', target, propertyKey);

        targetMeta[propertyKey] = {
            json: options.json !== false,
            type: propType
        };
    };
}

function getAllPropsMeta(target: any) {
    return getAllMetadata(propsSymbol, target) as Dictionary<TypoPropertyDescriptor>;
}

function getOwnPropsMeta(target: any) {
    return Reflect.getOwnMetadata(propsSymbol, target) as Dictionary<TypoPropertyDescriptor>;
}

export function getDescriptor(type: string | Constructor): TypoDescriptor {
    if (!type) {
        return null;
    }

    let descriptor = typeof type === 'string' ? types[type as string] : type[typeSymbol];

    return descriptor || null;
}

export function isTypo(constructor: Constructor) {
    return constructor && constructor[typeSymbol] !== undefined;
}

export function resolve<T extends {} = {}>(obj: Partial<T>, type?: string | Constructor<T>): T {
    if (!obj) {
        return null;
    }

    type = type || (obj as any).$type;

    if (!type) {
        return obj as T;
    }

    let descriptor = getDescriptor(type);
    if (!descriptor) {
        throw Error(`Could not resolve type ${getTypeName(type)}`);
    } else if (!descriptor) {
        return obj as T;
    }

    let result = new descriptor.type() as any;

    Object.assign(result, obj);
    delete result.$type;

    for (let key of Object.keys(descriptor.props)) {
        let prop = descriptor.props[key];
        if (isTypo(prop.type)) {
            result[key] = resolve(result[key], prop.type);
        }
    }

    return result;
}

function getTypeName(type: any) {
    if (!type) {
        return '--unknown--';
    }

    if (typeof type === 'string') {
        return type;
    }

    return (type as Constructor).name || '--unknown--';
}
