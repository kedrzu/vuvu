import Vue from 'vue';

import SimpleComponent from './components/SimpleComponent';
import './components/SimpleComponent.vue';

import DerivedComponent from './components/DerivedComponent';
import './components/DerivedComponent.vue';

describe('Vue component decorator', () => {

        it('allows to use ES6 classes as Vue components', () => {
                let component = new SimpleComponent();

                component.$mount();

                expect(component.$el).toBeDefined();
                expect(component.$el.classList.contains('simple')).toBe(true);
        });

        it('works with props', () => {
                let component = new SimpleComponent({
                        propsData: {
                                foobar: 'foo',
                                kaz: 'far'
                        }
                });

                component.$mount();

                expect(component.foobar).toEqual('foo');
                expect((component as any).kaz).toBeUndefined();
        });

        it('works with derived components', () => {
                let component = new DerivedComponent({
                        propsData: {
                                baz: 'bar',
                                foobar: 'foo',
                                kaz: 'far'
                        }
                });

                component.$mount();

                expect(component.foobar).toEqual('foo');
                expect(component.baz).toEqual('bar');
                expect((component as any).kaz).toBeUndefined();
        });
});
