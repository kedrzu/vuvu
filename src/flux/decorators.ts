import 'reflect-metadata';

import { addMutation } from './reflection';
import { StoreModule } from './StoreModule';

export function mutation(mutationName?: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let fcn = descriptor.value;
        let name = mutationName || propertyKey;

        addMutation(target, name, fcn);
    };
}
