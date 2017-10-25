import { PropOptions, WatchOptions } from 'vue';
import * as defs from './defs';
export declare function component(id?: string, options?: defs.ComponentOptions): <T>(constructor: T) => any;
export declare function ref(refName?: string): (target: any, propertyKey: string) => void;
export declare function prop(options?: PropOptions): (target: any, propertyKey: string) => void;
export declare function data(): (target: any, propertyKey: string) => void;
export declare function watch<T = any>(propName: keyof T, watchOptions?: WatchOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function beforeCreate(target: any, propertyKey: string): void;
export declare function created(target: any, propertyKey: string): void;
export declare function beforeMount(target: any, propertyKey: string): void;
export declare function mounted(target: any, propertyKey: string): void;
export declare function beforeUpdate(target: any, propertyKey: string): void;
export declare function updated(target: any, propertyKey: string): void;
export declare function beforeDestroy(target: any, propertyKey: string): void;
export declare function destroyed(target: any, propertyKey: string): void;