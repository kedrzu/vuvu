import { ComponentOptions } from './defs';
declare module 'vue/types/vue' {
    interface VueConstructor<> {
        readonly util: any;
    }
}
export declare function setupComponent(component: any, options?: ComponentOptions): any;
