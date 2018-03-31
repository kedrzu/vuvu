import { isString } from 'lodash';
const typeSymbol = Symbol.for('vuvu:typo:type');
const types = {};
export function Type(name) {
    return (constructor) => {
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
        let descriptor = {
            name: name,
            type: extendTypo(constructor, propNames),
            props: ownProps
        };
        constructor.prototype.toJSON = function () {
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
        return descriptor.type;
    };
}
function extendTypo(constructor, propNames) {
    return class extends constructor {
        constructor(...args) {
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
export function Property(options) {
    options = options || {};
    return function (target, propertyKey, descriptor) {
        let targetMeta = getOwnPropsMeta(target);
        if (!targetMeta) {
            targetMeta = {};
            Reflect.defineMetadata(propsSymbol, targetMeta, target);
        }
        let propType = Reflect.getMetadata('design:returntype', target, propertyKey) ||
            Reflect.getMetadata('design:type', target, propertyKey);
        targetMeta[propertyKey] = {
            json: options.json !== false,
            type: propType
        };
    };
}
function getAllPropsMeta(target) {
    let meta = {};
    while (target) {
        Object.assign(meta, Reflect.getMetadata(propsSymbol, target));
        target = Reflect.getPrototypeOf(target);
    }
    return meta;
}
function getOwnPropsMeta(target) {
    return Reflect.getOwnMetadata(propsSymbol, target);
}
export function getDescriptor(type) {
    if (!type) {
        return null;
    }
    return isString(type) ? types[type] : type[typeSymbol];
}
export function isTypo(constructor) {
    return constructor && constructor[typeSymbol] !== undefined;
}
export function resolve(obj, type) {
    if (!obj) {
        return null;
    }
    type = type || obj.type;
    if (!type) {
        return obj;
    }
    let descriptor = getDescriptor(type);
    if (!descriptor) {
        throw Error(`Could not resolve type ${getTypeName(type)}`);
    }
    else if (!descriptor) {
        return obj;
    }
    let result = new descriptor.type();
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
function getTypeName(type) {
    if (!type) {
        return '--unknown--';
    }
    if (isString(type)) {
        return type;
    }
    return type.name || '--unknown--';
}
//# sourceMappingURL=decorators.js.map