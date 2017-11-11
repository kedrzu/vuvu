import * as vuex from 'vuex';

import * as types from 'vuvu/types';

import Flux from './plugin';

export interface StoreOptions<TState extends {}> {
    name?: string;
    state: TState | (() => TState);
    store?: vuex.Store<any>;
}

export class Store<TState extends {}> {
    public readonly name: string;
    public readonly id: string;
    public readonly root: vuex.Store<any>;

    public get state(): TState {
        return this.root.state[this.id];
    }

    constructor(options: StoreOptions<TState>) {
        this.root = options.store || Flux.store;

        var reflect = Reflect;
        var meta = Reflect.getMetadata('foo', this, 'increment');
        var keys = Reflect.getMetadataKeys(this, 'increment');

        if (!this.root) {
            throw new Error(
                'Flux plugin is not initialized. Call Vue.use(Flux) before creating store or provide your own store.'
            );
        }

        this.name = options.name;
        this.id = getUniqueName(options.name);

        this.root.registerModule(this.id, {
            namespaced: true,
            state: options.state
        });

        modules[this.id] = this;
    }

    public dispose() {
        this.root.unregisterModule(this.id);
        delete modules[this.id];
    }
}

const modules: types.Dictionary<Store<any>> = {};

function getUniqueName(name) {
    if (!modules[name]) {
        return name;
    }

    for (let i = 1; modules[name]; i++) {
        let newName = `${name}-${i}`;
        if (!modules[newName]) {
            return newName;
        }
    }
}
