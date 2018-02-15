import * as typo from 'vuvu/typo';

describe('Typo decorator', () => {
    it('registers type with specific name', () => {
        @typo.Type('myType')
        class MyType {
            public foo = 123;
        }

        let type = typo.getType('myType');

        expect(type.constructor).toBe(MyType);
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

            @typo.JsonIgnore public bar = 234;
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
});
