import { Container } from 'inversify';
import Vue from 'vue';
declare module 'vue/types/vue' {
    interface Vue {
        readonly $container: Container;
    }
}
export declare function IocPlugin(vue: typeof Vue): void;
