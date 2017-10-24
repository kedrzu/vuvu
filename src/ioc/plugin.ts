import Vue from 'vue';

import { container } from './container';

export function IocPlugin(vue: typeof Vue) {
    Object.defineProperty(vue.prototype, '$container', {
        get() {
            return container;
        },
    });

    vue.mixin({
        beforeCreate() {
            //debugger;
        },
        created() {
            //debugger;
        }
    })
}
