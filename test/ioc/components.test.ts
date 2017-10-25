import Vue from 'vue';

import * as vuvu from 'vuvu';
import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('vue components service injection', () => {

    it('injects services with decorator', () => {
        @ioc.injectable()
        class Foo {

        }

        @vuvu.component()
        class Component extends Vue {

            @ioc.inject()
            public foo: Foo;

            public boo = 'asd';
        }

        let container = new ioc.Container();

        container.bind(Foo).toSelf();

        let cmp = new Component({
            container: container
        });

        expect(cmp.foo).toBeDefined();
        expect(cmp.foo instanceof Foo).toBeTruthy('should be instance of injected class');
    });

});
