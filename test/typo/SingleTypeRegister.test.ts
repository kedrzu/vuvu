import { Descriptor, DescriptorFor, SingleTypeRegister } from 'vuvu/typo';
import { clearAllDescriptors } from 'vuvu/typo/descriptorHelpers';

describe('SingleTypeRegister', () => {

    beforeEach(() => {
        clearAllDescriptors();
    });

    it('registers instance per type', () => {

        @DescriptorFor('foo')
        class FooDescriptor extends Descriptor<any> {

        }

        @DescriptorFor('bar')
        class BarDescriptor extends Descriptor<any> {

        }

        let foo = {
            a: 123
        };

        let bar = {
            b: 1234
        };

        let register = new SingleTypeRegister<object>({
            types: [
                {
                    from: FooDescriptor,
                    to: foo
                },
                {
                    from: 'bar',
                    to: bar
                }
            ]
        });

        let foo1 = register.get(FooDescriptor);
        let foo2 = register.get(new FooDescriptor());
        let foo3 = register.get('foo');

        expect(foo1).toBe(foo);
        expect(foo2).toBe(foo);
        expect(foo3).toBe(foo);

        expect(register.get('bar')).toBe(bar);
    });
});