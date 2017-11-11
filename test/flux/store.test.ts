import Vue from 'vue';
import * as vuex from 'vuex';

import Flux, * as flux from 'vuvu/flux';

import * as common from '../common';

Vue.use(Flux);

describe('Flux store', () => {

    common.initTest();

    it('instance store gives access to Vuex store module', () => {
        let store = new vuex.Store<any>({});

        interface Foo {
            foo: number;
        }

        let s1 = new flux.Store<Foo>({
            name: 'foo',
            state: {
                foo: 123
            },
            store: store
        });

        expect(store.state.foo).toBe(s1.state);
    });

    it('different stores of the same name do not share state', () => {
        let store = new vuex.Store<any>({ strict: true  });

        interface Foo {
            foo: number;
        }

        let s1 = new flux.Store<Foo>({
            name: 'foo',
            state: {
                foo: 123
            },
            store: store
        });

        let s2 = new flux.Store<Foo>({
            name: 'foo',
            state: {
                foo: 234
            },
            store: store
        });

        expect(s1.id).not.toEqual(s2.id);
        expect(s1.state.foo).not.toEqual(s2.state.foo);
    });

    it('store module is unregistered after dispose', () => {
        let store = new vuex.Store<any>({ strict: true });

        interface Foo {
            foo: number;
        }

        let s1 = new flux.Store<Foo>({
            name: 'foo',
            state: {
                foo: 123
            },
            store: store
        });

        expect(s1.state).toBeDefined();
        expect(s1.state.foo).toBe(123);

        s1.dispose();

        expect(s1.state).toBeUndefined();
    });
});
