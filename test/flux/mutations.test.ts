import Vue from 'vue';
import * as vuex from 'vuex';

import Flux, * as flux from 'vuvu/flux';

Vue.use(Flux);

describe('Flux store mutations', () => {
    let errors: Error[];

    beforeEach(() => {
        errors = [];
        Vue.config.errorHandler = e => {
            errors.push(e);
        };
    });

    afterEach(() => {
        for (let error of errors) {
            expect(error).toBeUndefined(error);
        }
    });

    interface Foo {
        count: number;
    }

    class Counter extends flux.Store<Foo> {
        @flux.mutation()
        public increment() {
            this.state.count++;
        }

        @flux.mutation()
        public decrement() {
            this.state.count--;
        }

        @flux.mutation()
        public incrementBy(count: number) {
            this.state.count += count;
        }
    }

    it('asdasd', () => {
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
        counter.decrement();

        expect(counter.state.count).toBe(1);
    });
});
