import { Constructor, Dictionary } from 'vuvu/types';

export interface TypoDescriptor {
    name: string;
    constructor: Constructor<object>;
    props: Dictionary<TypoPropDescriptor>;
}

export interface TypoPropDescriptor {
    ignoreJson?: boolean;
}

const typeSymbol = Symbol.for('vuvu:typo:type');
const types: Dictionary<TypoDescriptor> = {};

export function Type(name?: string) {
    return <T extends object>(target: Constructor<T>) => {
        let descriptor: TypoDescriptor = {
            name: name,
            constructor: target,
            props: getAllPropsMeta(target.prototype) || {}
        };

        types[name] = descriptor;
        target[typeSymbol] = descriptor;

        target.prototype.toJSON = function() {
            let obj = Object.assign({}, this);

            if (descriptor.name) {
                obj.type = descriptor.name;
            }

            for (let key of Object.keys(obj)) {
                let prop = descriptor.props[key];
                if (prop && prop.ignoreJson) {
                    delete obj[key];
                }
            }

            return obj;
        };

        return target;
    };
}

export function JsonIgnore<T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
    let propMeta = getPropMeta(target, propertyKey);
    propMeta.ignoreJson = true;
}

const propsSymbol = Symbol.for('vuvu:typo:props');
function getPropMeta(target: any, propertyKey: string): TypoPropDescriptor {
    let targetMeta = getAllPropsMeta(target);
    if (!targetMeta) {
        targetMeta = {};
        Reflect.defineMetadata(propsSymbol, targetMeta, target);
    }

    let propMeta = targetMeta[propertyKey] as TypoPropDescriptor;
    if (!propMeta) {
        propMeta = targetMeta[propertyKey] = {};
    }

    return propMeta;
}

function getAllPropsMeta(target: any) {
    return Reflect.getMetadata(propsSymbol, target) as Dictionary<TypoPropDescriptor>;
}

export function getType(type: string): TypoDescriptor {
    return types[type];
}

export function isTypo(constructor: Constructor<any>) {
    return constructor && constructor[typeSymbol] !== undefined;
}

export function resolve(obj: any): any {
    if (!obj.type) {
        return obj;
    }

    let descriptor = getType(obj.type);
    let result = new descriptor.constructor() as any;

    Object.assign(result, obj);
    delete result.type;
    return result;
}
