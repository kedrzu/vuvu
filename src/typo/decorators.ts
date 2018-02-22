import { Constructor, Dictionary } from 'vuvu/types';

export interface TypoDescriptor {
    name: string;
    constructor: Constructor<object>;
    props: Dictionary<TypoPropertyOptions>;
}

export interface TypoPropertyOptions {
    json?: boolean;
}

const typeSymbol = Symbol.for('vuvu:typo:type');
const types: Dictionary<TypoDescriptor> = {};

export function Type(name?: string) {
    return <T extends { new (...args: any[]): {} }>(constructor: T) => {
        let props = getAllPropsMeta(constructor.prototype) || {};

        constructor.prototype.toJSON = function() {
            let obj = Object.assign({}, this);

            if (descriptor.name) {
                obj.type = descriptor.name;
            }

            for (let key of Object.keys(obj)) {
                let prop = descriptor.props[key];
                if (prop && prop.json === false) {
                    delete obj[key];
                }
            }

            return obj;
        };

        let propNames = Object.keys(props);

        for (let prop of propNames) {
            Object.defineProperty(constructor.prototype, prop, {
                configurable: true,
                enumerable: true,
                writable: true
            });
        }

        let extended = class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                for (let prop of propNames) {
                    if (this[prop] === undefined) {
                        this[prop] = null;
                    }
                }
            }
        };

        let descriptor: TypoDescriptor = {
            name: name,
            constructor: extended,
            props: props
        };

        types[name] = descriptor;
        extended[typeSymbol] = descriptor;

        return descriptor.constructor;
    };
}

const propsSymbol = Symbol.for('vuvu:typo:props');
export function Property(options?: TypoPropertyOptions) {
    options = options || {};
    return function<T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
        let targetMeta = getAllPropsMeta(target);
        if (!targetMeta) {
            targetMeta = {};
            Reflect.defineMetadata(propsSymbol, targetMeta, target);
        }

        targetMeta[propertyKey] = options;
    };
}

function getAllPropsMeta(target: any) {
    return Reflect.getMetadata(propsSymbol, target) as Dictionary<TypoPropertyOptions>;
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
