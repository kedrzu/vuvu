import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

Vue.use(ioc.IocPlugin);

describe('IoC inject decorator', () => {
    it('throws when no symbol given', async () => {
        expect(() => {
            class Foo {
                @ioc.Inject() public foo;
            }
        }).toThrowError(/Identifier of injected.*/);
    });

    it('throws when primitive symbol given', async () => {
        expect(() => {
            class Foo {
                @ioc.Inject() public foo: number;
            }
        }).toThrowError(/Identifier of injected.*/);
    });

    it('throws when interface symbol given', async () => {
        interface Bar {
            asd: number;
        }
        expect(() => {
            class Foo {
                @ioc.Inject() public foo: Bar;
            }
        }).toThrowError(/Identifier of injected.*/);
    });

    it('throws when plain object symbol given', async () => {
        let fooz = {
            a: 123
        };

        expect(() => {
            class Foo {
                @ioc.Inject(fooz as any)
                public foo;
            }
        }).toThrowError(/Identifier of injected.*/);
    });
});
