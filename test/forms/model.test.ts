import * as formz from 'vuvu/formz';

describe('Formz model', () => {
    it('allows setting property validation errors', () => {
        let model = {
            foo: 'bar'
        };

        formz.setErrors(model, [
            {
                key: 'foo',
                message: 'foo message'
            },
            {
                key: 'bar',
                message: 'bar message'
            }
        ]);

        expect(formz.hasErrors(model)).toBeTruthy();
        expect(formz.getErrorsForProp(model, 'foo')).toEqual(['foo message']);
        expect(formz.getErrorsForProp(model, 'bar')).toEqual(['bar message']);
    });

    it('allows setting multiple errors for one property', () => {
        let model = {
            foo: 'bar'
        };

        formz.setErrors(model, [
            {
                key: 'foo',
                message: 'foo message'
            },
            {
                key: 'bar',
                message: 'bar message 1'
            },
            {
                key: 'bar',
                message: 'bar message 2'
            }
        ]);

        expect(formz.hasErrors(model)).toBeTruthy();
        expect(formz.getErrorsForProp(model, 'foo')).toEqual(['foo message']);
        expect(formz.getErrorsForProp(model, 'bar')).toEqual(['bar message 1', 'bar message 2']);
    });

    it('allows setting property errors for nested model', () => {

        let model = {
            foo: {}
        };

        formz.setErrors(model, [
            {
                key: 'foo.bar',
                message: 'foo message'
            }
        ]);

        expect(formz.hasErrors(model)).toBeFalsy();
        expect(formz.hasErrors(model.foo)).toBeTruthy();
        expect(formz.getErrorsForProp(model.foo, 'bar')).toEqual(['foo message']);
    });

    it('creates nested properties when they dont exist', () => {

        let model = {
            foo: undefined
        };

        formz.setErrors(model, [
            {
                key: 'foo.bar',
                message: 'foo message'
            }
        ]);

        expect(model.foo).not.toBeNull();
        expect(formz.hasErrors(model)).toBeFalsy();
        expect(formz.hasErrors(model.foo)).toBeTruthy();
        expect(formz.getErrorsForProp(model.foo, 'bar')).toEqual(['foo message']);
    });

    it('allows setting unnamed errors for nested model', () => {
        let model = {
            foo: {}
        };

        formz.setErrors(model, [
            {
                key: 'foo',
                message: 'foo message'
            }
        ]);

        expect(formz.hasErrors(model)).toBeFalsy();
        expect(formz.hasErrors(model.foo)).toBeTruthy();
        expect(formz.getErrorsForProp(model.foo, '')).toEqual(['foo message']);
    });

    it('allows setting property errors for double nested model', () => {
        let model = {
            foo: {
                bar: {

                }
            }
        };

        formz.setErrors(model, [
            {
                key: 'foo.kaaz',
                message: 'kaaz message'
            },
            {
                key: 'foo.bar.tzar',
                message: 'tzar message'
            }
        ]);

        expect(formz.hasErrors(model)).toBeFalsy();

        expect(formz.hasErrors(model.foo)).toBeTruthy();
        expect(formz.getErrorsForProp(model.foo, 'kaaz')).toEqual(['kaaz message']);

        expect(formz.hasErrors(model.foo.bar)).toBeTruthy();
        expect(formz.getErrorsForProp(model.foo.bar, 'tzar')).toEqual(['tzar message']);
    });

    it('allows setting dictionary errors for nested model', () => {
        let model = {
            foo: {
            }
        };

        formz.setErrors(model, [
            {
                key: 'foo["bar"]',
                message: 'bar message'
            },
            {
                key: 'foo["kaz"]',
                message: 'kaz message 1'
            },
            {
                key: 'foo["kaz"]',
                message: 'kaz message 2'
            }
        ]);

        expect(formz.hasErrors(model)).toBeFalsy();
        expect(formz.hasErrors(model.foo)).toBeTruthy();

        expect(formz.getErrorsForProp(model.foo, 'bar')).toEqual(['bar message']);
        expect(formz.getErrorsForProp(model.foo, 'kaz')).toEqual(['kaz message 1', 'kaz message 2']);
    });

    it('clears errors on setting new ones', () => {
        let model = {};

        formz.setErrors(model, [
            {
                key: 'foo',
                message: 'foo message'
            }
        ]);

        formz.setErrors(model, [
            {
                key: 'baz',
                message: 'baz message'
            },
            {
                key: 'ban',
                message: 'ban message'
            }
        ]);

        expect(formz.hasErrors(model)).toBeTruthy();
        expect(formz.getErrorsForProp(model, 'foo').length).toBe(0);
        expect(formz.getErrorsForProp(model, 'baz')).toEqual(['baz message']);
        expect(formz.getErrorsForProp(model, 'ban')).toEqual(['ban message']);
    });

    it('clears errors on setting new ones when nested', () => {
        let model = {
            foo: {}
        };

        formz.setErrors(model, [
            {
                key: 'foo.bar',
                message: 'bar message'
            },
            {
                key: 'baz',
                message: 'baz message'
            }
        ]);

        formz.setErrors(model, [
            {
                key: 'bak',
                message: 'bak message'
            },
            {
                key: 'ban',
                message: 'ban message'
            }
        ]);

        expect(formz.hasErrors(model)).toBeTruthy();
        expect(formz.getErrorsForProp(model, 'foo')).toEqual([]);
        expect(formz.getErrorsForProp(model, 'baz')).toEqual([]);
        expect(formz.getErrorsForProp(model.foo, 'bar')).toEqual([]);

        expect(formz.getErrorsForProp(model, 'bak')).toEqual(['bak message']);
        expect(formz.getErrorsForProp(model, 'ban')).toEqual(['ban message']);
    });
});
