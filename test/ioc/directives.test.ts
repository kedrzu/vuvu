import Vue from 'vue';

import * as ioc from 'vuvu/ioc';

import Component from './components/ParentComponentWithDirective.vue';

Vue.use(ioc.IocPlugin);

describe('IoC directives', () => {
    it('using ioc-directive allows to override container', async () => {
        let container = new ioc.Container();
        let component = new Component({
            container: container
        });

        component.$mount();

        expect(component.$children.length).toBe(3);
        expect(component.$children[0].$container).toBe(component.container);
        expect(component.$children[1].$container).toBe(component.$container);
        expect(component.$children[2].$container).toBe(component.$container);
    });
});
