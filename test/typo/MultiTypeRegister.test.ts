import { Descriptor, DescriptorFor, MultiTypeRegister } from 'vuvu/typo';
import { clearAllDescriptors } from 'vuvu/typo/descriptorHelpers';

describe('MultiTypeRegister', () => {

    beforeEach(() => {
        clearAllDescriptors();
    });

    it('resolves instances for type', () => {

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

        let register = new MultiTypeRegister<object>({
            types: [
                {
                    from: FooDescriptor,
                    to: foo
                },
                {
                    from: FooDescriptor,
                    to: bar
                },
                {
                    from: 'bar',
                    to: bar
                }
            ]
        });

        let foos1 = register.get(FooDescriptor);
        let foos2 = register.get(new FooDescriptor());
        let foos3 = register.get('foo');
        let bars = register.get('bar');

        expect(foos1.length).toBe(2);
        expect(foos1[0]).toBe(foo);
        expect(foos1[1]).toBe(bar);
        expect(foos2.length).toBe(2);
        expect(foos2[0]).toBe(foo);
        expect(foos2[1]).toBe(bar);
        expect(foos3.length).toBe(2);
        expect(foos3[0]).toBe(foo);
        expect(foos3[1]).toBe(bar);

        expect(bars.length).toBe(1);
        expect(bars[0]).toBe(bar);
    });

    it('resolves insances for type with inheritance', () => {

        @DescriptorFor('foo')
        class FooDescriptor extends Descriptor<any> {

        }

        @DescriptorFor('bar')
        class BarDescriptor extends FooDescriptor {

        }

        @DescriptorFor('baz')
        class BazDescriptor extends BarDescriptor {

        }

        let foo = {
            a: 123
        };

        let bar = {
            b: 1234
        };

        let baz = {
            b: 1234
        };

        let register = new MultiTypeRegister<object>({
            types: [
                {
                    from: FooDescriptor,
                    to: foo
                },
                {
                    from: new BarDescriptor(),
                    to: bar
                },
                {
                    from: 'baz',
                    to: baz
                }
            ]
        });

        let foos1 = register.get(FooDescriptor);
        let foos2 = register.get(new FooDescriptor());
        let foos3 = register.get('foo');
        let bars1 = register.get('bar');
        let bars2 = register.get(BarDescriptor);
        let bars3 = register.get(new BarDescriptor());

        let bazs = register.get('baz');

        expect(foos1.length).toBe(1);
        expect(foos1[0]).toBe(foo);
        expect(foos2.length).toBe(1);
        expect(foos2[0]).toBe(foo);
        expect(foos3.length).toBe(1);
        expect(foos3[0]).toBe(foo);

        expect(bars1.length).toBe(2);
        expect(bars1[0]).toBe(foo);
        expect(bars1[1]).toBe(bar);
        expect(bars2.length).toBe(2);
        expect(bars2[0]).toBe(foo);
        expect(bars2[1]).toBe(bar);
        expect(bars3.length).toBe(2);
        expect(bars3[0]).toBe(foo);
        expect(bars3[1]).toBe(bar);

        expect(bazs.length).toBe(3);
        expect(bazs[0]).toBe(foo);
        expect(bazs[1]).toBe(bar);
        expect(bazs[2]).toBe(baz);
    });
});