import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC plugin', () => {
    it('allows setting a container for component', () => {
        let container = new ioc.Container();
        let vm = new Vue({
            container: container
        });

        expect(vm.$container).toBe(container);
    });
});
