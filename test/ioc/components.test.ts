import Vue from 'vue';

import * as vuvu from 'vuvu';
import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

@ioc.injectable()
class Foo {

}

//@vuvu.component()
class Component extends Vue {

    @ioc.inject()
    public foo: Foo;

    public boo = "asd";
}

describe('vue components service injection', () => {

    it('injects services with decorator', () => {
        let cmp = new Component();

        let container = ioc.container.createChild();

        container.bind(Foo).toSelf();

        expect(cmp).toBeTruthy(c => c instanceof Component);

        ioc.populate(cmp, container);

        expect(cmp.foo).toBeDefined('should be injected');
        expect(cmp.foo).toBeTruthy(p => p instanceof Foo);
    });

});
