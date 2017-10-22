import Vue from 'vue';
import * as vuvu from 'vuvu';

Vue.use(vuvu.CorePlugin);

describe('Core plugin', () => {
    it('sets $vm prop on vue components', () => {
        const vm = new Vue();
        expect(vm.$vm).toBe(vm);
    });

    it('sasd', () => {
        expect(true).toBe(true);
    });
});
