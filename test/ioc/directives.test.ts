import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

import Component from './components/ParentComponentWithDirective';
import './components/ParentComponentWithDirective.vue';

Vue.use(ioc.IocPlugin);

describe('IoC directives', () => {
    it('using ioc-directive allows to override container', () => {
        let container = new ioc.Container();
        let component = new Component({
            container: container
        });

        component.$mount();

        expect(component.$children.length).toBe(1);
        expect(component.$children[0].$container).not.toBeNull();
        expect(component.$children[0].$container).not.toBe(container);
        expect(component.$children[0].$container).toBe(component.container);
    });
});
