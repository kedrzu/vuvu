import Vue from 'vue';
export declare type VueConstructor<T = Vue> = {
    new (): T;
} & typeof Vue;
export interface Constructor<T extends {} = any> {
    new (...args: any[]): T;
}
export interface Dictionary<T> {
    [id: string]: T;
}
