import Vue from 'vue';

export function IocPlugin(vue: typeof Vue) {
    Object.defineProperty(vue.prototype, '$container', {
        get() {
            return this.$options.container;
        },
    });

    // vue.mixin({
    //     created(this: Vue) {
    //         if(this.$options.container) {
    //             this.$container = this.$options.container;
    //         }
    //     }
    // })
}
