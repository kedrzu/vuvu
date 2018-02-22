import { isString } from 'lodash';
const typeSymbol = Symbol.for('vuvu:typo:type');
const types = {};
export function Type(name) {
    return (constructor) => {
        let props = getAllPropsMeta(constructor.prototype) || {};
        constructor.prototype.toJSON = function () {
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
            props: props
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
        let targetMeta = getAllPropsMeta(target);
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
    return Reflect.getMetadata(propsSymbol, target);
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
    type = type || obj.type;
    if (!type) {
        return null;
    }
    let descriptor = getDescriptor(type);
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
//# sourceMappingURL=decorators.js.map