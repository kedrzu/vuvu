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
        let value = JSON.parse(json);

        expect(value.foo).toBe(123);
        expect(value.bar).toBeUndefined();
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
        let resolved = typo.resolve(plain);

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
});
