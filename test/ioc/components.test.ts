import Vue from 'vue';

import * as vuvu from 'vuvu';
import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('vue components service injection', () => {

    it('injects services into props', () => {
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

    it('register attribute as dependency provider', () => {

        class Foo {

        }

        @vuvu.component()
        class Component extends Vue {

            @ioc.provide()
            public foo: Foo = new Foo();
        }

        let container = new ioc.Container();

        let cmp = new Component({
            container: container
        });

        expect(cmp.$container).toBeDefined('should have container');
        expect(cmp.$container).not.toBe(container, 'should have child container');
        expect(cmp.$container.get(Foo)).toBe(cmp.foo, 'should resolve dependency');
        expect(container.isBound(Foo)).toBe(false, 'should not register in parent container');
    });

    it('register property as dependency provider', () => {

        class Foo {

        }

        @vuvu.component()
        class Component extends Vue {

            private fooz = new Foo();

            @ioc.provide()
            public get foo(): Foo {
                return this.fooz;
            }
        }

        let container = new ioc.Container();

        let cmp = new Component({
            container: container
        });

        expect(cmp.$container).toBeDefined('should have container');
        expect(cmp.$container).not.toBe(container, 'should have child container');
        expect(cmp.$container.get(Foo)).toBe(cmp.foo, 'should resolve dependency');
        expect(container.isBound(Foo)).toBe(false, 'should not register in parent container');
    });

    it('register method as dependency provider', () => {

        class Foo {

        }

        @vuvu.component()
        class Component extends Vue {

            private fooz = new Foo();

            @ioc.provide()
            public foo(): Foo {
                return this.fooz;
            }
        }

        let container = new ioc.Container();

        let cmp = new Component({
            container: container
        });

        expect(cmp.$container).toBeDefined('should have container');
        expect(cmp.$container).not.toBe(container, 'should have child container');
        expect(cmp.$container.get(Foo)).toBe(cmp.foo(), 'should resolve dependency');
        expect(container.isBound(Foo)).toBe(false, 'should not register in parent container');
    });

    it('dependencies are visible in child components', () => {

        class Foo { }

        @ioc.injectable()
        class Bar { }

        @vuvu.component()
        class Parent extends Vue {

            @ioc.provide()
            public foo: Foo = new Foo();
        }

        @vuvu.component()
        class Child extends Vue {

            @ioc.inject()
            public foo: Foo;

            @ioc.inject()
            public bar: Bar;
        }

        let container = new ioc.Container();

        container.bind(Bar).toSelf().inSingletonScope();

        let parent = new Parent({
            container: container
        });

        let child = new Child({
            parent: parent
        });

        expect(child.$container).toBeDefined('should have container');
        expect(child.$container).toBe(parent.$container, 'should inherit container');

        expect(child.foo).toBe(parent.foo, 'should inject dependency from parent into child');
        expect(child.bar).toBe(container.get(Bar), 'should inject dependency from main continer into child');
    });

});
