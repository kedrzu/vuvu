import * as vuex from 'vuex';
import * as types from 'vuvu/types';
import { StoreModule } from './StoreModule';
export declare type Mutations = types.Dictionary<vuex.Mutation<any>>;
export declare function addMutation<T extends StoreModule<any>>(storeClass: types.Constructor<T>, name: string, fcn: vuex.Mutation<any>): void;
export declare function getMutationsForStore<T extends StoreModule<any>>(store: T): Mutations;
