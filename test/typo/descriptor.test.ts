import Vue from 'vue';

import { Descriptable, Descriptor, DescriptorFor, getDescriptorFor, Typed, TypoPlugin } from 'vuvu/typo';
import { clearAllDescriptors } from 'vuvu/typo/descriptorHelpers';

Vue.use(TypoPlugin);

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

        let instance: Typed = { $type: 'myType' };
        let descriptor = getDescriptorFor(instance);

        expect(descriptor).not.toBeNull();
        expect(Object.getPrototypeOf(descriptor)).toBe(MyType.prototype);
        expect(instance.$descriptor).toBe(descriptor);
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

        let instance: Typed = { $type: 'asdasdasd' };
        let descriptor = getDescriptorFor(instance);

        expect(descriptor).toBeNull();
        expect(instance.$descriptor).toBeNull();
    });

    it('is resolved as for instance without type', () => {
        @DescriptorFor('myType')
        class MyType extends Descriptor<any> {
            public foo = 123;
        }

        let instance = { foo: 'bar' } as any;
        let descriptor = getDescriptorFor(instance);

        expect(descriptor).toBeUndefined();
        expect((instance as Typed).$descriptor).toBeUndefined();
    });

    it('allows creating an instance of type', () => {
        interface Foo extends Descriptable<MyType> {
            foo: string;
        }

        @DescriptorFor('foo')
        class MyType extends Descriptor<Foo> {

        }

        @DescriptorFor('bar')
        class MyDerivedType extends MyType {
            public /* override */ fill(obj: Foo) {
                obj.foo = '123';
            }
        }

        let descriptorBase = new MyType();
        let instanceBase = descriptorBase.make({ foo: 'asdf' });
        let instanceBaseDescriptor = instanceBase.$descriptor;

        let descriptorDerived = new MyDerivedType();
        let instanceDerived = descriptorDerived.make();
        let instanceDerivedDescriptor = instanceDerived.$descriptor;

        expect(instanceBase.$type).toBe('foo');
        expect(Object.getPrototypeOf(instanceBaseDescriptor)).toBe(MyType.prototype);
        expect(instanceBase.foo).toBe('asdf');
        expect(instanceDerived.$type).toBe('bar');
        expect(Object.getPrototypeOf(instanceDerivedDescriptor)).toBe(MyDerivedType.prototype);
        expect(instanceDerived.foo).toBe('123');
    });
});
