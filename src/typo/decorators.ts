import isString from 'lodash/isString';
import { Constructor, Dictionary } from 'vuvu/types';

export interface TypoDescriptor {
    name: string;
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
const types: Dictionary<TypoDescriptor> = {};

export function Type(name?: string) {
    return <T extends { new (...args: any[]): {} }>(constructor: T) => {
        let ownProps = getOwnPropsMeta(constructor.prototype) || {};
        let allProps = getAllPropsMeta(constructor.prototype) || {};

        let propNames = Object.keys(ownProps);

        // TODO: probably would be needed in future  (validation and so)
        for (let prop of propNames) {
            Object.defineProperty(constructor.prototype, prop, {
                configurable: true,
                enumerable: true,
                writable: true
            });
        }

        let descriptor: TypoDescriptor = {
            name: name,
            type: extendTypo(constructor, propNames),
            props: ownProps
        };

        constructor.prototype.toJSON = function() {
            let obj = Object.assign({}, this);

            if (descriptor.name) {
                obj.type = descriptor.name;
            }

            for (let key of Object.keys(obj)) {
                let prop = allProps[key];
                if (prop && prop.json === false) {
                    delete obj[key];
                }
            }

            return obj;
        };

        types[name] = descriptor;
        descriptor.type[typeSymbol] = descriptor;

        return descriptor.type as T;
    };
}

function extendTypo(constructor: Constructor, propNames: string[]) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);

            for (let prop of propNames) {
                if (this[prop] === undefined) {
                    this[prop] = null;
                }
            }
        }
    };
}

const propsSymbol = Symbol.for('vuvu:typo:props');
export function Property(options?: TypoPropertyOptions) {
    options = options || {};
    return function<T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
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
    let meta = {};
    while (target) {
        Object.assign(meta, Reflect.getMetadata(propsSymbol, target));
        target = Reflect.getPrototypeOf(target);
    }

    return meta;
}

function getOwnPropsMeta(target: any) {
    return Reflect.getOwnMetadata(propsSymbol, target) as Dictionary<TypoPropertyDescriptor>;
}

export function getDescriptor(type: string | Constructor): TypoDescriptor {
    if (!type) {
        return null;
    }

    return isString(type) ? types[type as string] : type[typeSymbol];
}

export function isTypo(constructor: Constructor) {
    return constructor && constructor[typeSymbol] !== undefined;
}

export function resolve<T extends {} = {}>(obj: Partial<T>, type?: string | Constructor<T>): T {
    if (!obj) {
        return null;
    }

    type = type || (obj as any).type;

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
    delete result.type;

    for (let key of Object.keys(descriptor.props)) {
        let prop = descriptor.props[key];
        if (isTypo(prop.type)) {
            let value = result[key];
            result[key] = resolve(result[key], prop.type);
        }
    }

    return result;
}

function getTypeName(type: any) {
    if (!type) {
        return '--unknown--';
    }

    if (isString(type)) {
        return type;
    }

    return (type as Constructor).name || '--unknown--';
}
