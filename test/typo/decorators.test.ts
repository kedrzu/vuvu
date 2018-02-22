import * as typo from 'vuvu/typo';

import Vue from 'vue';

describe('Typo decorator', () => {
    it('registers type with specific name', () => {
        @typo.Type('myType')
        class MyType {
            public foo = 123;
        }

        let type = typo.getDescriptor('myType');

        expect(type.type).toBe(MyType);
    });

    it('registers type without name', () => {
        @typo.Type()
        class TypodType {
            public foo = 123;
        }

        class NoTypodType {
            public foo = 123;
        }

        expect(typo.isTypo(TypodType)).toBe(true);
        expect(typo.isTypo(NoTypodType)).toBe(false);
    });

    it('defines properties for object', () => {
        @typo.Type()
        class MyType {
            @typo.Property() public foo;

            @typo.Property() public bar = 123;
        }

        let obj = new MyType();

        expect(obj.foo).toBe(null);
        expect(obj.bar).toBe(123);
    });

    it('defines properties for object when inherited', () => {
        @typo.Type()
        class MyBaseType {
            @typo.Property() public foo;

            @typo.Property() public bar = 123;
        }

        @typo.Type()
        class MyFirstDerivedType extends MyBaseType {
            @typo.Property() public foor;

            @typo.Property() public baar = 123;
        }

        // we test with second derived type, to check if props are not leaking
        // between these two derived types
        // this could happen if there are no properly checked own properties inside
        // and properties can leak through prototypical inheritance between classes
        @typo.Type()
        class MySecondDerivedType extends MyBaseType {
            @typo.Property() public fooz;

            @typo.Property() public baaz = 123;
        }

        let base = new MyBaseType();
        let first = new MyFirstDerivedType();
        let second = new MySecondDerivedType();

        expect(typo.isTypo(MyBaseType)).toBe(true);
        expect(typo.isTypo(MyFirstDerivedType)).toBe(true);
        expect(typo.isTypo(MySecondDerivedType)).toBe(true);

        expect(base.foo).toBe(null);
        expect(base.bar).toBe(123);
        expect((base as MyFirstDerivedType).foor).toBeUndefined();
        expect((base as MyFirstDerivedType).baar).toBeUndefined();
        expect((base as MySecondDerivedType).fooz).toBeUndefined();
        expect((base as MySecondDerivedType).baaz).toBeUndefined();

        expect(first.foo).toBe(null);
        expect(first.bar).toBe(123);
        expect(first.foor).toBe(null);
        expect(first.baar).toBe(123);
        expect((first as any).fooz).toBeUndefined();
        expect((first as any).baaz).toBeUndefined();

        expect(first.foo).toBe(null);
        expect(first.bar).toBe(123);
        expect(second.fooz).toBe(null);
        expect(second.baaz).toBe(123);
        expect((second as any).foor).toBeUndefined();
        expect((second as any).baar).toBeUndefined();
    });

    it('includes type property within JSON object', () => {
        @typo.Type('myType')
        class MyType {
            public foo = 123;
        }

        let obj = new MyType();
        let json = JSON.stringify(obj);
        let value = JSON.parse(json);

        expect(value.type).toBe('myType');
    });

    it('includes type property within JSON object when inherited', () => {
        @typo.Type('myBaseType')
        class MyBaseType {
            public foo = 123;
        }

        @typo.Type('myInheritedType')
        class MyInheritedType extends MyBaseType {
            public bar = 123;
        }

        let baseObj = new MyBaseType();
        let baseJson = JSON.stringify(baseObj);
        let baseValue = JSON.parse(baseJson);

        let inheritedObj = new MyInheritedType();
        let inheritedJson = JSON.stringify(inheritedObj);
        let inheritedValue = JSON.parse(inheritedJson);

        expect(inheritedValue.type).toBe('myInheritedType');
        expect(baseValue.type).toBe('myBaseType');
    });

    it('allows ignoring attributes when turning into JSON', () => {
        @typo.Type()
        class MyType {
            public foo = 123;

            @typo.Property({ json: false })
            public bar = 234;
        }

        let obj = new MyType();
        let json = JSON.stringify(obj);
        let value = JSON.parse(json) as MyType;

        expect(value.foo).toBe(123);
        expect(value.bar).toBeUndefined();
    });

    it('allows ignoring attributes for inherited when turning into JSON', () => {
        @typo.Type()
        class MyBaseType {
            public foo = 123;

            @typo.Property({ json: false })
            public bar = 234;
        }

        @typo.Type()
        class MyDerivedType extends MyBaseType {
            public fooz = 123;

            @typo.Property({ json: false })
            public baaz = 234;
        }

        let baseDescriptor = typo.getDescriptor(MyBaseType);
        let derivedDescriptor = typo.getDescriptor(MyDerivedType);

        let obj = new MyDerivedType();
        let json = JSON.stringify(obj);
        let value = JSON.parse(json) as MyDerivedType;

        expect(value.foo).toBe(123);
        expect(value.bar).toBeUndefined();
        expect(value.fooz).toBe(123);
        expect(value.baaz).toBeUndefined();
    });

    it('allows resolving concrete type from JSON', () => {
        @typo.Type('Baaz')
        class Baaz {
            public foo: number;
            public bar: number;
        }

        let obj = new Baaz();

        obj.foo = 123;
        obj.bar = 234;

        let json = JSON.stringify(obj);
        let plain = JSON.parse(json);
        let resolved = typo.resolve<Baaz>(plain);

        expect(resolved).toBeDefined();
        expect(resolved instanceof Baaz).toBe(true, 'not a proper type');
        expect(resolved.foo).toBe(123, 'property value is wrong');
        expect(resolved.bar).toBe(234, 'property value is wrong');
    });

    it('allows resolving concrete type from JSON when nested', () => {
        @typo.Type('Bar')
        class Bar {
            @typo.Property() public foo: number;
            @typo.Property() public bar: number;
        }

        @typo.Type('Foo')
        class Foo {
            @typo.Property() public foo: number;
            @typo.Property() public bar: Bar;
        }

        let obj = new Foo();

        obj.foo = 3;
        obj.bar = new Bar();
        obj.bar.foo = 123;
        obj.bar.bar = 234;

        let json = JSON.stringify(obj);
        let plain = JSON.parse(json);
        let resolved = typo.resolve(plain) as Foo;

        expect(resolved).toBeDefined();
        expect(resolved instanceof Foo).toBe(true, 'not a proper type');
        expect(resolved.foo).toBe(3, 'property value is wrong');
        expect(resolved.bar).toBeDefined('child object not defined');
        expect(resolved.bar instanceof Bar).toBe(true, 'child object wrong type');
        expect(resolved.bar.foo).toBe(123, 'property value is wrong');
        expect(resolved.bar.bar).toBe(234, 'property value is wrong');
    });

    it('makes properties reactive', () => {
        @typo.Type('Baaz')
        class Baaz {
            @typo.Property() public foo: number;
            @typo.Property() public bar: number;

            public get moo() {
                return this.foo;
            }
            public set moo(val) {
                this.foo = val;
            }
        }

        let obj = new Baaz();
        let vue = new Vue({
            data: {
                baaz: null
            },
            computed: {
                foo() {
                    return this.baaz && this.baaz.foo;
                },
                bar() {
                    return this.baaz && this.baaz.bar;
                }
            }
        });

        vue.baaz = obj;

        expect(vue.foo).toBeNull();
        expect(vue.bar).toBeNull();

        obj.foo = 123;
        obj.bar = 234;

        expect(vue.foo).toBe(123);
        expect(vue.bar).toBe(234);
    });

    it('throws error on unresolvable type - unknown type in object literal', () => {
        expect(() => {
            typo.resolve({ foo: 123, type: 'foo' });
        }).toThrowError('Could not resolve type foo');
    });

    it('throws error on unresolvable type - missing type in object literal', () => {
        expect(() => {
            typo.resolve({ foo: 123 });
        }).toThrowError('Could not resolve type --unknown--');
    });

    it('throws error on unresolvable type - unknown type given by string', () => {
        expect(() => {
            typo.resolve({ foo: 123 }, 'foo');
        }).toThrowError('Could not resolve type foo');
    });

    it('throws error on unresolvable type - unknown type given by constructor', () => {
        class Foo {
            public foo: number;
        }

        expect(() => {
            typo.resolve({ foo: 123 }, Foo);
        }).toThrowError('Could not resolve type Foo');
    });
});
