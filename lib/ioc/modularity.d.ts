import * as types from 'vuvu/types';
import { Container } from './container';
export interface Module {
    register?(container: Container): any;
    run?(container: Container): any;
}
export declare class Bootstrapper {
    container: Container;
    private modules;
    constructor(container?: Container);
    addModule(module: Module): Bootstrapper;
    hasModule(module: Module | types.Constructor<Module>): boolean;
    run(): void;
}
