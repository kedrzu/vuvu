import * as vuex from 'vuex';

import * as types from 'vuvu/types';

import { getMutationsForStore } from './reflection';
import { StoreModule } from './StoreModule';

const rootSymbol = Symbol.for('vuvu:flux-root');

export class StoreBuilder<TState = any> {
    private modules: types.Dictionary<StoreModule<any>> = {};

    constructor(private options: vuex.StoreOptions<TState>) {}

    public module<T>(name: string, module: StoreModule<T>) {
        this.modules[name] = module;
        let modules = this.options.modules || (this.options.modules = {});

        let mutations: vuex.MutationTree<T> = {};
        let mutationsConfig = getMutationsForStore(module);

        for (let key of Object.keys(mutationsConfig)) {
            let mutation = mutationsConfig[key];

            mutations[key] = (state, payload) => {
                mutation.call(module, payload);
            };
        }

        modules[name] = {
            state: module.state,
            namespaced: true,
            mutations: mutations
        };

        return this;
    }

    public build(): vuex.Store<TState> {
        let store = new vuex.Store<TState>(this.options);

        for (let moduleName of Object.keys(this.modules)) {
            let moduleObj = this.modules[moduleName];
            let mutationsConfig = getMutationsForStore(moduleObj);

            Object.defineProperty(moduleObj, 'state', {
                get: () => store.state[moduleName],
                set: value => (store.state[moduleName] = value)
            });

            for (let mutationName of Object.keys(mutationsConfig)) {
                moduleObj[mutationName] = function<T>(
                    this: StoreModule<T>,
                    payload: any
                ) {
                    let path = `${moduleName}/${mutationName}`;
                    store.commit(path, payload);
                };
            }
        }

        return store;
    }
}
