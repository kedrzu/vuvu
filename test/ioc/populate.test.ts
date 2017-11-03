import * as ioc from 'vuvu/ioc';

describe('IoC populate object', () => {
    it('injects service exported by symbol', () => {
        @ioc.injectable()
        class Foo {}

        let fooType = Symbol('foo');

        @ioc.injectable()
        class Bar {
            @ioc.inject(fooType) public prop: any;
        }

        let container = new ioc.Container();

        container.bind(fooType).to(Foo);

        let bar = container.resolve(Bar);

        expect(bar).toBeDefined();
        expect(bar instanceof Bar).toBe(true);
        expect(bar.prop).toBeDefined();
        expect(bar.prop instanceof Foo).toBe(true);
    });

    it('injects service exported by class', () => {
        @ioc.injectable()
        class Foo {}

        @ioc.injectable()
        class Bar {
            @ioc.inject() public prop: Foo;
        }

        let container = new ioc.Container();

        container.bind(Foo).toSelf();

        let bar = container.resolve(Bar);

        expect(bar).toBeDefined();
        expect(bar instanceof Bar).toBe(true);
        expect(bar.prop).toBeDefined();
        expect(bar.prop instanceof Foo).toBe(true);
    });

    it('injects service when inherited', () => {
        @ioc.injectable()
        class Foo {}

        @ioc.injectable()
        class Bar {
            @ioc.inject() public prop: Foo;
        }

        @ioc.injectable()
        class Baz extends Bar {
            @ioc.inject() public foo: Foo;
        }

        let container = new ioc.Container();

        container.bind(Foo).toSelf();

        let baz = container.resolve(Baz);

        expect(baz instanceof Baz).toBe(true);

        expect(baz.prop).toBeDefined('should be injected into base');
        expect(baz.prop instanceof Foo).toBeTruthy();

        expect(baz.foo).toBeDefined('should be injected into derived type');
        expect(baz.foo instanceof Foo).toBeTruthy();
    });

    it('injects optional dependencies', () => {
        let symbol = Symbol('foo');

        @ioc.injectable()
        class Bar {
            @ioc.injectOptional(symbol) public foo: string;
        }

        let container = new ioc.Container();

        container.bind(symbol).toConstantValue('abc');

        let baz = container.resolve(Bar);

        expect(baz.foo).toBe('abc');
    });

    it('not injects unavailable optional dependencies', () => {
        let symbol = Symbol('foo');

        @ioc.injectable()
        class Bar {
            @ioc.injectOptional(symbol) public foo: string;
        }

        let container = new ioc.Container();

        let baz = container.resolve(Bar);

        expect(baz.foo).toBeUndefined();
    });
});
