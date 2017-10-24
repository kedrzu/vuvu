import { ComponentOptions } from 'vue';

const decoratorsSymbol = Symbol('vuts:decorators');

export type LifecycleHook = () => void;

export type DecoratorCallback = (options: ComponentOptions<any>) => void;

export function addDecorator(target: any, callback: DecoratorCallback) {
    let decorators: DecoratorCallback[];

    if (target.hasOwnProperty(decoratorsSymbol)) {
        decorators = target[decoratorsSymbol];
    } else {
        target[decoratorsSymbol] = decorators = [];
    }

    decorators.push(callback);
}

export function getDecorators(target: any): DecoratorCallback[] {

    let decorators: DecoratorCallback[] = [];

    let proto = target.prototype;

    return proto[decoratorsSymbol] || [];

    while (proto !== Object.prototype) {
        if (proto.hasOwnProperty(decoratorsSymbol)) {
            let localDecorators = proto[decoratorsSymbol] as DecoratorCallback[];
            decorators = localDecorators.concat(decorators);
        }

        proto = Object.getPrototypeOf(proto);
    }

    return decorators;
}

export function addLifecycleHook(target: any, hook: string, callback: LifecycleHook) {
    addDecorator(target, opts => {
        let hooks = opts[hook] as LifecycleHook[];
        if (!hooks) {
            opts[hook] = hooks = [];
        }

        hooks.push(callback);
    });
}
