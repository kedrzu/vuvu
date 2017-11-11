import * as vuex from 'vuex';

import * as types from 'vuvu/types';

import Flux from './plugin';
import { getMutations } from './reflection';

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

        if (!this.root) {
            throw new Error(
                'Flux plugin is not initialized. Call Vue.use(Flux) before creating store or provide your own store.'
            );
        }

        this.name = options.name;
        this.id = getUniqueName(options.name);

        let mutations = getMutations(Object.getPrototypeOf(this));
        let opts: vuex.Module<TState, any> = {
            mutations: {},
            namespaced: true,
            state: options.state,
        };

        for (let key of Object.keys(mutations)) {
            let mutation = mutations[key];
            opts.mutations[key] = (state, payload) => {
                mutation.call(this, payload);
            };
        }

        this.root.registerModule(this.id, opts);

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
