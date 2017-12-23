import Vue, { ComponentOptions } from 'vue';
declare module 'vue/types/vue' {
    interface VueConstructor<> {
        readonly util: any;
    }
}
export declare function setupComponent(component: any, options?: ComponentOptions<Vue>): any;
