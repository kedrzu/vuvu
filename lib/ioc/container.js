import { Container as InversifyContainer } from 'inversify';
export class Container extends InversifyContainer {
    constructor() {
        super();
        this.bind(Container).toConstantValue(this);
    }
    createChild() {
        let child = super.createChild();
        child.bind(Container).toConstantValue(child);
        return child;
    }
}
//# sourceMappingURL=container.js.map