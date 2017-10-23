import { Container } from 'inversify';
import Vue from 'vue';

import * as vuts from 'vuts';
import * as vuvu from 'vuvu';
import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC populate object', () => {

    it('injects service exported by symbol', () => {
        @ioc.injectable()
        class Foo {
        }

        let fooType = Symbol('foo');

        class Bar {
            @ioc.inject(fooType)
            public prop: any;
        }

        let container = ioc.container.createChild();

        container.bind(fooType).to(Foo);

        let bar = new Bar();

        ioc.populate(bar, container);

        expect(bar.prop).toBeDefined();
        expect(bar.prop).toBeTruthy(p => p instanceof Foo);
    });

    it('injects service exported by class', () => {
        @ioc.injectable()
        class Foo {
        }

        class Bar {
            @ioc.inject()
            public prop: Foo;
        }

        let container = ioc.container.createChild();

        container.bind(Foo).toSelf();

        let bar = new Bar();

        ioc.populate(bar, container);

        expect(bar.prop).toBeDefined();
        expect(bar.prop).toBeTruthy(p => p instanceof Foo);
    });
});
