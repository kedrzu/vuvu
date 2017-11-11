import * as vuex from 'vuex';
import * as types from 'vuvu/types';

import { Store } from './store';

const mutationsSymbol = Symbol('vuvu:flux-mutations');

export type Mutations = types.Dictionary<vuex.Mutation<any>>;

export function addMutation<T extends Store<any>>(
    storeClass: types.Constructor<T>,
    name: string,
    fcn: vuex.Mutation<any>
) {
    let mutations: Mutations = storeClass[mutationsSymbol] || (storeClass[mutationsSymbol] = {});

    mutations[name] = fcn;
}

export function getMutations<T extends Store<any>>(storeClass: types.Constructor<T>): Mutations {
    return storeClass[mutationsSymbol] || {};
}
