import Vue from 'vue';

export declare type VueConstructor<T = Vue> = { new (): T } & typeof Vue;

export declare interface Constructor<T extends {} = any> {
    new (...args: any[]): T;
}

export declare interface Dictionary<T> {
    [id: string]: T;
}
