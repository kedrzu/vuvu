import { Descriptor, DescriptorFor, ResolvableType, resolveTypes } from 'vuvu/typo';
import { clearAllDescriptors } from 'vuvu/typo/descriptors';

import Vue from 'vue';

describe('Typo resolver', () => {

    beforeEach(() => {
        clearAllDescriptors();
    });

    it('registers default type one to one', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        @ResolvableType({ for: FoobarDescriptor })
        class MyResolvableType {
            public foo = 123;
        }

        let types = resolveTypes({ for: 'foobar' });

        expect(types.length).toBe(1);
        expect(types[0]).toBe(MyResolvableType);
    });

    it('registers default type many to one', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        @ResolvableType({ for: FoobarDescriptor })
        class MyResolvableType1 {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor })
        class MyResolvableType2 {
            public foo = 123;
        }

        let types = resolveTypes({ for: 'foobar' });

        expect(types.length).toBe(2);
        expect(types[0]).toBe(MyResolvableType1);
        expect(types[1]).toBe(MyResolvableType2);
    });

    it('registers type many to one with order', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        @ResolvableType({ for: FoobarDescriptor })
        class MyResolvableType1 {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, order: 3 })
        class MyResolvableType2 {
            public foo = 123;
        }

        let types = resolveTypes({ for: 'foobar' });

        expect(types.length).toBe(2);
        expect(types[0]).toBe(MyResolvableType2);
        expect(types[1]).toBe(MyResolvableType1);
    });

    it('registers type many to one with base', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        class MyBase {

        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase })
        class MyResolvableType1 extends MyBase {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase })
        class MyResolvableType2 extends MyBase {
            public foo = 123;
        }

        let typesDefault = resolveTypes({ for: 'foobar' });
        let typesWithBase = resolveTypes({ for: 'foobar', as: MyBase });

        expect(typesDefault.length).toBe(0);
        expect(typesWithBase.length).toBe(2);
        expect(typesWithBase[0]).toBe(MyResolvableType1);
        expect(typesWithBase[1]).toBe(MyResolvableType2);
    });

    it('registers type many to one with base and order', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        class MyBase {

        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase })
        class MyResolvableType1 extends MyBase {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase, order: 3 })
        class MyResolvableType2 extends MyBase {
            public foo = 123;
        }

        let typesDefault = resolveTypes({ for: 'foobar' });
        let typesWithBase = resolveTypes({ for: 'foobar', as: MyBase });

        expect(typesDefault.length).toBe(0);
        expect(typesWithBase.length).toBe(2);
        expect(typesWithBase[0]).toBe(MyResolvableType2);
        expect(typesWithBase[1]).toBe(MyResolvableType1);
    });

    it('registers type many to one with role', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        class MyBase {

        }

        @ResolvableType({ for: FoobarDescriptor, role: 'form' })
        class MyResolvableType1 extends MyBase {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, role: 'form' })
        class MyResolvableType2 extends MyBase {
            public foo = 123;
        }

        let typesDefault = resolveTypes({ for: 'foobar' });
        let typesWithRole = resolveTypes({ for: 'foobar', role: 'form' });

        expect(typesDefault.length).toBe(0);
        expect(typesWithRole.length).toBe(2);
        expect(typesWithRole[0]).toBe(MyResolvableType1);
        expect(typesWithRole[1]).toBe(MyResolvableType2);
    });

    it('registers type many to one with role and order', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        class MyBase {

        }

        @ResolvableType({ for: FoobarDescriptor, role: 'form' })
        class MyResolvableType1 extends MyBase {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, role: 'form', order: 3 })
        class MyResolvableType2 extends MyBase {
            public foo = 123;
        }

        let typesDefault = resolveTypes({ for: 'foobar' });
        let typesWithRole = resolveTypes({ for: 'foobar', role: 'form' });

        expect(typesDefault.length).toBe(0);
        expect(typesWithRole.length).toBe(2);
        expect(typesWithRole[0]).toBe(MyResolvableType2);
        expect(typesWithRole[1]).toBe(MyResolvableType1);
    });

    it('registers type with base and role', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        class MyBase {

        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase, role: 'foo' })
        class MyResolvableType1 extends MyBase {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase, role: 'bar' })
        class MyResolvableType2 extends MyBase {
            public foo = 123;
        }

        let typesDefault = resolveTypes({ for: 'foobar' });
        let typesWithoutRole = resolveTypes({ for: 'foobar', as: MyBase });
        let typesWithFooRole = resolveTypes({ for: 'foobar', as: MyBase, role: 'foo' });
        let typesWithBarRole = resolveTypes({ for: 'foobar', as: MyBase, role: 'bar' });

        expect(typesDefault.length).toBe(0);
        expect(typesWithoutRole.length).toBe(0);

        expect(typesWithFooRole.length).toBe(1);
        expect(typesWithFooRole[0]).toBe(MyResolvableType1);

        expect(typesWithBarRole.length).toBe(1);
        expect(typesWithBarRole[0]).toBe(MyResolvableType2);
    });

    it('registers type with different bases and resolve by instance', () => {

        @DescriptorFor('foobar')
        class FoobarDescriptor extends Descriptor<any> {

        }

        class MyBase1 {

        }

        class MyBase2 {

        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase1 })
        class MyResolvableType1 extends MyBase1 {
            public foo = 123;
        }

        @ResolvableType({ for: FoobarDescriptor, as: MyBase2 })
        class MyResolvableType2 extends MyBase2 {
            public foo = 123;
        }

        let instance = { $type: 'foobar' };

        let typesDefault = resolveTypes({ for: instance });
        let typesWithBase1 = resolveTypes({ for: instance, as: MyBase1 });
        let typesWithBase2 = resolveTypes({ for: instance, as: MyBase2 });
        let typesWithBase2AndRole = resolveTypes({ for: instance, as: MyBase2, role: 'foo' });

        expect(typesDefault.length).toBe(0);
        expect(typesWithBase2AndRole.length).toBe(0);

        expect(typesWithBase1.length).toBe(1);
        expect(typesWithBase1[0]).toBe(MyResolvableType1);

        expect(typesWithBase2.length).toBe(1);
        expect(typesWithBase2[0]).toBe(MyResolvableType2);
    });

    it('resolves all types in descriptor hierarchy', () => {
        @DescriptorFor('foo')
        class FooDescriptor extends Descriptor<any> {

        }

        @DescriptorFor('bar')
        class BarDescriptor extends FooDescriptor {

        }

        @ResolvableType({ for: FooDescriptor })
        class MyResolvableType1 {
            public foo = 123;
        }

        @ResolvableType({ for: BarDescriptor })
        class MyResolvableType2 {
            public foo = 123;
        }

        let foo = { $type: 'foo' };
        let bar = { $type: 'bar' };

        let fooTypes = resolveTypes({ for: foo });
        let barTypes = resolveTypes({ for: bar });

        expect(fooTypes.length).toBe(1);
        expect(fooTypes[0]).toBe(MyResolvableType1);

        expect(barTypes.length).toBe(2);
        expect(barTypes[0]).toBe(MyResolvableType2);
        expect(barTypes[1]).toBe(MyResolvableType1);
    });

    it('resolves all types in descriptor hierarchy with base', () => {
        @DescriptorFor('foo')
        class FooDescriptor extends Descriptor<any> {

        }

        @DescriptorFor('bar')
        class BarDescriptor extends FooDescriptor {

        }

        class MyBase {

        }

        @ResolvableType({ for: FooDescriptor, as: MyBase })
        class MyResolvableType1 extends MyBase {
            public foo = 123;
        }

        @ResolvableType({ for: BarDescriptor, as: MyBase })
        class MyResolvableType2 extends MyBase {
            public foo = 123;
        }

        let foo = { $type: 'foo' };
        let bar = { $type: 'bar' };

        let fooTypes = resolveTypes({ for: foo, as: MyBase });
        let barTypes = resolveTypes({ for: bar, as: MyBase });

        expect(fooTypes.length).toBe(1);
        expect(fooTypes[0]).toBe(MyResolvableType1);

        expect(barTypes.length).toBe(2);
        expect(barTypes[0]).toBe(MyResolvableType2);
        expect(barTypes[1]).toBe(MyResolvableType1);
    });

    it('registers type for multiple descriptors', () => {

        @DescriptorFor('foo')
        class FooDescriptor extends Descriptor<any> {

        }

        @DescriptorFor('bar')
        class BarDescriptor extends Descriptor<any> {

        }

        @ResolvableType({ for: FooDescriptor })
        @ResolvableType({ for: BarDescriptor })
        class MyResolvableType {
            public foo = 123;
        }

        let fooTypes = resolveTypes({ for: 'foo' });
        let barTypes = resolveTypes({ for: 'bar' });

        expect(fooTypes.length).toBe(1);
        expect(fooTypes[0]).toBe(MyResolvableType);

        expect(barTypes.length).toBe(1);
        expect(barTypes[0]).toBe(MyResolvableType);
    });

});