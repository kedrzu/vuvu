import Vue from 'vue';
import * as vuex from 'vuex';

import Flux, * as flux from 'vuvu/flux';
import * as ioc from 'vuvu/ioc';

import * as common from '../common';

Vue.use(Flux);

describe('Flux store mutations', () => {
    common.initTest();

    interface Foo {
        count: number;
    }

    class Counter extends flux.StoreModule<Foo> {
        @flux.Mutation()
        public increment() {
            this.state.count++;
        }

        @flux.Mutation()
        public incrementBy(count: number) {
            this.state.count += count;
        }
    }

    it('decorated method is run as a mutation', () => {
        let storeBuilder = new flux.StoreBuilder({
            strict: true
        });

        let counter = new Counter({
            count: 0
        });

        let store = storeBuilder.module('counter', counter).build();

        counter.increment();
        counter.increment();

        expect(counter.state.count).toBe(2);
        expect(store.state.counter).toBe(counter.state);
        expect(store.state.counter.count).toBe(2);
    });

    it('decorated method is run as a mutation with payload', () => {
        let storeBuilder = new flux.StoreBuilder({
            strict: true
        });

        let counter = new Counter({
            count: 0
        });

        let store = storeBuilder.module('counter', counter).build();

        counter.increment();
        counter.incrementBy(3);

        expect(counter.state.count).toBe(4);
        expect(store.state.counter).toBe(counter.state);
        expect(store.state.counter.count).toBe(4);
    });

    it('decorator based mutations work for inherited types', () => {
        let storeBuilder = new flux.StoreBuilder({
            strict: true
        });

        class ReversibleCounter extends Counter {
            @flux.Mutation()
            public decrement() {
                this.state.count--;
            }
        }

        let counter = new ReversibleCounter({
            count: 0
        });

        let store = storeBuilder.module('counter', counter).build();

        counter.incrementBy(7);
        counter.decrement();

        expect(counter.state.count).toBe(6);
        expect(store.state.counter).toBe(counter.state);
        expect(store.state.counter.count).toBe(6);
    });

    it('decorator based mutations can alter whole state', () => {
        let storeBuilder = new flux.StoreBuilder({
            strict: true
        });

        interface State {
            bar: string;
        }

        class Foobar extends flux.StoreModule<State> {
            @flux.Mutation()
            public alterState(state: State) {
                this.state = state;
            }
        }

        let foo = new Foobar({
            bar: 'asdf'
        });

        let store = storeBuilder.module('foo', foo).build();

        expect(store.state.foo).toBe(foo.state);

        let newState = { bar: 'gizz' };

        foo.alterState(newState);

        expect(foo.state.bar).toBe('gizz');
        expect(store.state.foo.bar).toBe('gizz');
        expect(foo.state).toBe(newState);
        expect(store.state.foo).toBe(newState);
    });
});
