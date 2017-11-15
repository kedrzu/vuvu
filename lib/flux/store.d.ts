import * as vuex from 'vuex';
export interface StoreOptions<TState extends {}> {
    name?: string;
    state: TState | (() => TState);
    store?: vuex.Store<any>;
}
export declare class Store<TState extends {}> {
    readonly name: string;
    readonly id: string;
    readonly root: vuex.Store<any>;
    state: TState;
    constructor(options: StoreOptions<TState>);
    dispose(): void;
}
