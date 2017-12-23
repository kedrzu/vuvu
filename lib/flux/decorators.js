import 'reflect-metadata';
import { addMutation } from './reflection';
export function mutation(mutationName) {
    return (target, propertyKey, descriptor) => {
        let fcn = descriptor.value;
        let name = mutationName || propertyKey;
        addMutation(target, name, fcn);
    };
}
//# sourceMappingURL=decorators.js.map