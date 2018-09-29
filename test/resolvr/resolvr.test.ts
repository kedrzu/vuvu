import * as resolvr from 'vuvu/resolvr';

import Vue from 'vue';

describe('Resolvr', () => {
    it('registers type one to one', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType {
            public foo = 123;
        }

        let types = resolvr.resolveTypes({ for: Model });

        expect(types.length).toBe(1);
        expect(types[0]).toBe(ResolvableType);
    });

    it('registers type many to one', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType1 {
            public foo = 123;
        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType2 {
            public foo = 123;
        }

        let types = resolvr.resolveTypes({ for: Model });

        expect(types.length).toBe(2);
        expect(types[0]).toBe(ResolvableType1);
        expect(types[1]).toBe(ResolvableType2);
    });

    it('registers type many to one with order', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType1 {
        }

        @resolvr.Resolvable({ for: Model, order: 3 })
        class ResolvableType2 {
        }

        let types = resolvr.resolveTypes({ for: Model });

        expect(types.length).toBe(2);
        expect(types[0]).toBe(ResolvableType2);
        expect(types[1]).toBe(ResolvableType1);
    });

    it('registers type one to one with role', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model, role: 'edit' })
        class ResolvableType {
        }

        let typesDefault = resolvr.resolveTypes({ for: Model });
        let typesForEdit = resolvr.resolveTypes({ for: Model, role: 'edit' });

        expect(typesDefault.length).toBe(0);
        expect(typesForEdit.length).toBe(1);
        expect(typesForEdit[0]).toBe(ResolvableType);
    });

    it('registers type many to one with roles', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType1 {
        }

        @resolvr.Resolvable({ for: Model, role: 'edit' })
        class ResolvableType2 {
        }

        @resolvr.Resolvable({ for: Model, role: 'edit' })
        class ResolvableType3 {
        }

        @resolvr.Resolvable({ for: Model, role: 'display' })
        class ResolvableType4 {
        }

        let typesDefault = resolvr.resolveTypes({ for: Model });
        let typesForEdit = resolvr.resolveTypes({ for: Model, role: 'edit' });
        let typesForDisplay = resolvr.resolveTypes({ for: Model, role: 'display' });

        expect(typesDefault.length).toBe(1);
        expect(typesDefault[0]).toBe(ResolvableType1);

        expect(typesForEdit.length).toBe(2);
        expect(typesForEdit[0]).toBe(ResolvableType2);
        expect(typesForEdit[1]).toBe(ResolvableType3);

        expect(typesForDisplay.length).toBe(1);
        expect(typesForDisplay[0]).toBe(ResolvableType4);
    });

    it('registers type many to one with roles and order', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model, role: 'edit', order: 1 })
        class ResolvableType1 {
        }

        @resolvr.Resolvable({ for: Model, role: 'edit' })
        class ResolvableType2 {
        }

        @resolvr.Resolvable({ for: Model, role: 'edit', order: 3 })
        class ResolvableType3 {
        }

        let typesForEdit = resolvr.resolveTypes({ for: Model, role: 'edit' });

        expect(typesForEdit.length).toBe(3);
        expect(typesForEdit[0]).toBe(ResolvableType1);
        expect(typesForEdit[1]).toBe(ResolvableType3);
        expect(typesForEdit[2]).toBe(ResolvableType2);
    });

    it('resolves by instance', () => {

        class Model {

        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType1 {
            public foo = 123;
        }

        @resolvr.Resolvable({ for: Model })
        class ResolvableType2 {
            public foo = 123;
        }

        let instance = new Model();
        let types = resolvr.resolveTypes({ for: instance });

        expect(types.length).toBe(2);
        expect(types[0]).toBe(ResolvableType1);
        expect(types[1]).toBe(ResolvableType2);
    });

    it('resolves for whole inheritance tree', () => {

        class Base {

        }

        class Sub extends Base {

        }

        @resolvr.Resolvable({ for: Base })
        class ResolvableForBase {
        }

        @resolvr.Resolvable({ for: Sub })
        class ResolvableForSub {
        }

        let baseTypes = resolvr.resolveTypes({ for: new Base() });
        let subTypes = resolvr.resolveTypes({ for: new Sub() });

        expect(baseTypes.length).toBe(1);
        expect(baseTypes[0]).toBe(ResolvableForBase);

        expect(subTypes.length).toBe(2);
        expect(subTypes[0]).toBe(ResolvableForSub);
        expect(subTypes[1]).toBe(ResolvableForBase);
    });
});