import 'reflect-metadata';

import { addMutation } from './reflection';
import { Store } from './store';

export function mutation(mutationName?: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let fcn = descriptor.value;
        let name = mutationName || propertyKey;

        addMutation(target, name, fcn);

        descriptor.value = function <T>(this: Store<T>, payload: any) {
            let path = `${this.id}/${name}`;
            this.root.commit(path, payload);
        };
    };
}
