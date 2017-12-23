import * as vuex from 'vuex';
import { getMutationsForStore } from './reflection';
const rootSymbol = Symbol.for('vuvu:flux-root');
export class StoreBuilder {
    constructor(options) {
        this.options = options;
        this.modules = {};
    }
    module(name, module) {
        this.modules[name] = module;
        let modules = this.options.modules || (this.options.modules = {});
        let mutations = {};
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
    build() {
        let store = new vuex.Store(this.options);
        for (let moduleName of Object.keys(this.modules)) {
            let moduleObj = this.modules[moduleName];
            let mutationsConfig = getMutationsForStore(moduleObj);
            Object.defineProperty(moduleObj, 'state', {
                get: () => store.state[moduleName],
                set: value => (store.state[moduleName] = value)
            });
            for (let mutationName of Object.keys(mutationsConfig)) {
                moduleObj[mutationName] = function (payload) {
                    let path = `${moduleName}/${mutationName}`;
                    store.commit(path, payload);
                };
            }
        }
        return store;
    }
}
//# sourceMappingURL=StoreBuilder.js.map