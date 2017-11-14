import * as vuex from 'vuex';
import * as types from 'vuvu/types';
import { Store } from './store';
export declare type Mutations = types.Dictionary<vuex.Mutation<any>>;
export declare function addMutation<T extends Store<any>>(storeClass: types.Constructor<T>, name: string, fcn: vuex.Mutation<any>): void;
export declare function getMutations<T extends Store<any>>(storeClass: types.Constructor<T>): Mutations;
