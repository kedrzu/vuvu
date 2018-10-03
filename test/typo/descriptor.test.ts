import { Descriptor, DescriptorFor, getDescriptorFor } from 'vuvu/typo';
import { clearAllDescriptors, WithType } from 'vuvu/typo/descriptors';

describe('Typo descriptor', () => {

    beforeEach(() => {
        clearAllDescriptors();
    });

    it('is registered for type with specific id', () => {
        @DescriptorFor('myType')
        class MyType extends Descriptor<any> {
            public foo = 123;
        }

        let descriptor = getDescriptorFor('myType');

        expect(descriptor).not.toBeNull();
        expect(Object.getPrototypeOf(descriptor)).toBe(MyType.prototype);
        expect(Object.isFrozen(descriptor)).toBeTruthy();
    });

    it('is resolved using object instance', () => {
        @DescriptorFor('myType')
        class MyType extends Descriptor<any> {
            public foo = 123;
        }

        let instance = { $type: 'myType' };
        let descriptor = getDescriptorFor(instance);

        expect(descriptor).not.toBeNull();
        expect(Object.getPrototypeOf(descriptor)).toBe(MyType.prototype);
        expect(Object.isFrozen(descriptor)).toBeTruthy();
    });

    it('is resolved as null for not found descriptor by type id', () => {
        @DescriptorFor('myType')
        class MyType extends Descriptor<any> {
            public foo = 123;
        }

        let descriptor = getDescriptorFor('myzasd');

        expect(descriptor).toBeNull();
    });

    it('is resolved as for not found descriptor by instance', () => {
        @DescriptorFor('myType')
        class MyType extends Descriptor<any> {
            public foo = 123;
        }

        let instance = { $type: 'asdasdasd' };
        let descriptor = getDescriptorFor(instance);

        expect(descriptor).toBeNull();
    });

    it('is resolved as for instance without type', () => {
        @DescriptorFor('myType')
        class MyType extends Descriptor<any> {
            public foo = 123;
        }

        let instance = { foo: 'bar' };
        let descriptor = getDescriptorFor(instance as any);

        expect(descriptor).toBeNull();
    });

    it('allows creating an instance of type', () => {
        interface Foo extends WithType<'foo' | 'bar'> {
            foo: string;
        }

        @DescriptorFor('foo')
        class MyType extends Descriptor<Foo> {

        }

        @DescriptorFor('bar')
        class MyDerivedType extends Descriptor<Foo> {
            public /* override */ fill(obj: Foo) {
                obj.foo = '123';
            }
        }

        let descriptorBase = new MyType();
        let instanceBase = descriptorBase.make({ foo: 'asdf' });

        let descriptorDerived = new MyDerivedType();
        let instanceDerived = descriptorDerived.make();

        expect(instanceBase.$type).toBe('foo');
        expect(instanceBase.foo).toBe('asdf');
        expect(instanceDerived.$type).toBe('bar');
        expect(instanceDerived.foo).toBe('123');
    });
});
