import 'reflect-metadata';

import { Store } from './store';

export function mutation(mutationName?: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let fcn = descriptor.value;
        let name = mutationName || propertyKey;

        Reflect.defineMetadata('foo', fcn, target);
        Reflect.defineMetadata('fooz', fcn, target, propertyKey);
        target['foo'] = fcn;

        descriptor.value = function<T>(this: Store<T>, payload: any) {
            let path = `${this.id}/${name}`;
            this.root.commit(path, payload);
        };
    };
}
