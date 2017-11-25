import Vue from 'vue';
import * as vuex from 'vuex';

import Flux, * as flux from 'vuvu/flux';
import * as ioc from 'vuvu/ioc';

import * as common from '../common';

Vue.use(Flux);

describe('Flux store', () => {
    common.initTest();

    it('instance store gives access to Vuex store module', () => {
        let storeBuilder = new flux.StoreBuilder({
            strict: true
        });

        let storeModule = new flux.StoreModule<Foo>({
            foo: 123
        });

        let store = storeBuilder.module('abc', storeModule).build();

        interface Foo {
            foo: number;
        }

        expect(store.state.abc).toBe(storeModule.state);
    });
});
