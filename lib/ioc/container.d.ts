import { Container as InversifyContainer } from 'inversify';
export declare class Container extends InversifyContainer {
    constructor();
    createChild(): Container;
}
