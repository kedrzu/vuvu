import Vue from 'vue';
import * as vuex from 'vuex';

import Flux, * as flux from 'vuvu/flux';

import * as common from '../common';

Vue.use(Flux);

describe('Flux store mutations', () => {
    common.initTest();

    interface Foo {
        count: number;
    }

    class Counter extends flux.Store<Foo> {
        @flux.mutation()
        public increment() {
            this.state.count++;
        }

        @flux.mutation()
        public incrementBy(count: number) {
            this.state.count += count;
        }
    }

    it('decorated method is run as a mutation', () => {
        let store = new vuex.Store<any>({
            strict: true
        });

        let counter = new Counter({
            name: 'foo',
            state: {
                count: 0
            },
            store: store
        });

        counter.increment();
        counter.increment();

        expect(counter.state.count).toBe(2);
    });

    it('decorated method is run as a mutation with payload', () => {
        let store = new vuex.Store<any>({
            strict: true
        });

        let counter = new Counter({
            name: 'foo',
            state: {
                count: 0
            },
            store: store
        });

        counter.increment();
        counter.incrementBy(3);

        expect(counter.state.count).toBe(4);
    });

    it('decorator based mutations work for inherited types', () => {
        let store = new vuex.Store<any>({
            strict: true
        });

        class ReversibleCounter extends Counter {
            @flux.mutation()
            public decrement() {
                this.state.count--;
            }
        }

        let counter = new ReversibleCounter({
            name: 'foo',
            state: {
                count: 0
            },
            store: store
        });

        counter.incrementBy(7);
        counter.decrement();

        expect(counter.state.count).toBe(6);
    });
});
