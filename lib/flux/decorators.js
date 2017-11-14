import 'reflect-metadata';
import { addMutation } from './reflection';
export function mutation(mutationName) {
    return (target, propertyKey, descriptor) => {
        let fcn = descriptor.value;
        let name = mutationName || propertyKey;
        addMutation(target, name, fcn);
        descriptor.value = function (payload) {
            let path = `${this.id}/${name}`;
            this.root.commit(path, payload);
        };
    };
}
//# sourceMappingURL=decorators.js.map