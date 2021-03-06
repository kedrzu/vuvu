import { Container as InversifyContainer } from 'inversify';

export class Container extends InversifyContainer {
    constructor() {
        super();

        this.bind(Container).toDynamicValue(ctx => ctx.container as Container);
    }

    public /* override */ createChild() {
        // we override this method to preserve proper
        // container type across all casesS
        let child = new Container();
        child.parent = this;
        return child;
    }
}
