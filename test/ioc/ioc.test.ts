//import { Container } from 'inversify';
import Vue from 'vue';

import * as vuvu from 'vuvu';
import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC plugin', () => {
    it('sets $container prop to be an ioc container', () => {
        const vm = new Vue();
        expect(vm.$container).toBeDefined();
        //expect(vm.$container).toBeTruthy(c => c instanceof Container);
    });
});
