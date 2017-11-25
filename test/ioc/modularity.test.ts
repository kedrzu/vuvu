import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC modularity', () => {
    it('bootstapper works with plain object modules', () => {
        let container = new ioc.Container();
        let bootstrapper = new ioc.Bootstrapper(container);

        let module: ioc.Module = {};

        expect(bootstrapper.hasModule(module)).toBe(false);

        bootstrapper.addModule(module);

        expect(bootstrapper.hasModule(module)).toBe(true);
    });

    it('bootstapper registers class modules inside container', () => {
        let container = new ioc.Container();
        let bootstrapper = new ioc.Bootstrapper(container);

        class MyModule implements ioc.Module {}

        let module = new MyModule();

        expect(bootstrapper.hasModule(MyModule)).toBe(false);

        bootstrapper.addModule(module);

        expect(bootstrapper.hasModule(MyModule)).toBe(true);
        expect(container.get(MyModule)).toBe(module);
    });
});
