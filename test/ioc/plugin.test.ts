import { Container } from 'inversify';
import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC plugin', () => {
    it('sets $container prop', () => {
        const vm = new Vue();
        expect(vm.$container).toBeDefined();
    });

    it('sets $container prop to be an inversify container', () => {
        const vm = new Vue();
        expect(vm.$container).toBeTruthy(c => c instanceof Container);
    });
});
