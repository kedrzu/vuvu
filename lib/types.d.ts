import Vue from 'vue';
export declare type VueConstructor<T = Vue> = {
    new (): T;
} & typeof Vue;
export interface Constructor<T> {
    new (): T;
}
export interface Dictionary<T> {
    [id: string]: T;
}
