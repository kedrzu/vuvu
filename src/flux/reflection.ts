import * as vuex from 'vuex';
import * as types from 'vuvu/types';

import { StoreModule } from './StoreModule';

const mutationsSymbol = Symbol('vuvu:flux-mutations');

export type Mutations = types.Dictionary<vuex.Mutation<any>>;

export function addMutation<T extends StoreModule<any>>(
    storeClass: types.Constructor<T>,
    name: string,
    fcn: vuex.Mutation<any>
) {
    let mutations: Mutations = storeClass[mutationsSymbol];

    if (!mutations) {
        // there are no mutations defined
        storeClass[mutationsSymbol] = mutations = {};
    } else if (!storeClass.hasOwnProperty(mutationsSymbol)) {
        // mutations have been defined in base class
        // we need to copy them, to preserve inheritance hierachy
        storeClass[mutationsSymbol] = mutations = Object.assign({}, mutations);
    }

    mutations[name] = fcn;
}

export function getMutationsForStore<T extends StoreModule<any>>(store: T): Mutations {
    let proto = Object.getPrototypeOf(store);
    return proto[mutationsSymbol] || {};
}
