import * as vuex from 'vuex';
import { StoreModule } from './StoreModule';
export declare class StoreBuilder<TState = any> {
    private options;
    private modules;
    constructor(options: vuex.StoreOptions<TState>);
    module<T>(name: string, module: StoreModule<T>): this;
    build(): vuex.Store<TState>;
}
