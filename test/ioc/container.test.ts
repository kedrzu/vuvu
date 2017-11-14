import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC container', () => {
    it('injecting container gives the same instance', () => {
        let container = new ioc.Container();
        let self = container.get(ioc.Container);

        expect(container).toBe(self);
    });

    it('injecting container from child gives the same instance', () => {
        let container = new ioc.Container();
        let child = container.createChild();
        let self = child.get(ioc.Container);

        expect(container).not.toBe(child);
        expect(child).toBe(self);
    });
});
