import * as typo from 'vuvu/typo';

describe('Typo model', () => {
    it('allows setting property validation errors', () => {
        let model = new typo.Model();

        model.$setErrors([
            {
                key: 'foo',
                message: 'foo message'
            },
            {
                key: 'bar',
                message: 'bar message'
            }
        ]);

        expect(model.$errors).not.toBeNull();
        expect(model.$getErrors('foo')).toEqual(['foo message']);
        expect(model.$getErrors('bar')).toEqual(['bar message']);
    });

    it('allows setting multiple errors for one property', () => {
        let model = new typo.Model();

        model.$setErrors([
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

        expect(model.$errors).not.toBeNull();
        expect(model.$getErrors('foo')).toEqual(['foo message']);
        expect(model.$getErrors('bar')).toEqual(['bar message 1', 'bar message 2']);
    });

    it('allows setting property errors for nested model', () => {
        class MyModel extends typo.Model {
            @typo.Property() public foo: typo.Model = new typo.Model();
        }

        let model = new MyModel();

        model.$setErrors([
            {
                key: 'foo.bar',
                message: 'foo message'
            }
        ]);

        expect(model.$errors).toBeNull();

        expect(model.foo.$errors).toBeDefined();
        expect(model.foo.$getErrors('bar')).toEqual(['foo message']);
    });

    it('allows setting unnamed errors for nested model', () => {
        class MyModel extends typo.Model {
            @typo.Property() public foo: typo.Model = new typo.Model();
        }

        let model = new MyModel();

        model.$setErrors([
            {
                key: 'foo',
                message: 'foo message'
            }
        ]);

        expect(model.$errors).toBeNull();

        expect(model.foo.$errors).toBeDefined();
        expect(model.foo.$getErrors('')).toEqual(['foo message']);
    });

    it('allows setting property errors for double nested model', () => {
        class MyModel extends typo.Model {
            @typo.Property() public bar: typo.Model = new typo.Model();
        }

        class SuperModel extends typo.Model {
            @typo.Property() public foo: MyModel = new MyModel();
        }

        let model = new SuperModel();

        model.$setErrors([
            {
                key: 'foo.kaaz',
                message: 'kaaz message'
            },
            {
                key: 'foo.bar.tzar',
                message: 'tzar message'
            }
        ]);

        expect(model.$errors).toBeNull();

        expect(model.foo.$errors).toBeDefined();
        expect(model.foo.$getErrors('kaaz')).toEqual(['kaaz message']);

        expect(model.foo.bar.$errors).toBeDefined();
        expect(model.foo.bar.$getErrors('tzar')).toEqual(['tzar message']);
    });

    it('allows setting dictionary errors for nested model', () => {
        class MyModel extends typo.Model {
            @typo.Property() public foo: typo.Model = new typo.Model();
        }

        let model = new MyModel();

        model.$setErrors([
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

        expect(model.$errors).toBeNull();

        expect(model.foo.$errors).toBeDefined();
        expect(model.foo.$getErrors('bar')).toEqual(['bar message']);
        expect(model.foo.$getErrors('kaz')).toEqual(['kaz message 1', 'kaz message 2']);
    });

    it('clears errors on setting new ones', () => {
        let model = new typo.Model();

        model.$setErrors([
            {
                key: 'foo',
                message: 'foo message'
            }
        ]);

        model.$setErrors([
            {
                key: 'baz',
                message: 'baz message'
            },
            {
                key: 'ban',
                message: 'ban message'
            }
        ]);

        expect(model.$errors).not.toBeNull();
        expect(model.$getErrors('foo').length).toBe(0);
        expect(model.$getErrors('baz')).toEqual(['baz message']);
        expect(model.$getErrors('ban')).toEqual(['ban message']);
    });

    it('clears errors on setting new ones when nested', () => {
        class MyModel extends typo.Model {
            @typo.Property() public foo: typo.Model = new typo.Model();
        }

        let model = new MyModel();

        model.$setErrors([
            {
                key: 'foo.bar',
                message: 'bar message'
            },
            {
                key: 'baz',
                message: 'baz message'
            }
        ]);

        model.$setErrors([
            {
                key: 'bak',
                message: 'bak message'
            },
            {
                key: 'ban',
                message: 'ban message'
            }
        ]);

        expect(model.$errors).not.toBeNull();
        expect(model.$getErrors('foo')).toEqual([]);
        expect(model.$getErrors('baz')).toEqual([]);
        expect(model.foo.$getErrors('bar')).toEqual([]);

        expect(model.$getErrors('bak')).toEqual(['bak message']);
        expect(model.$getErrors('ban')).toEqual(['ban message']);
    });
});
