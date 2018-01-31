import { PropOptions, WatchOptions } from 'vue';
import * as defs from './defs';
export declare function Component(): any;
export declare function Component(options: defs.ComponentOptions): any;
export declare function Component(id: string, options?: defs.ComponentOptions): any;
export declare function Ref(refName?: string): (target: any, propertyKey: string) => void;
export declare function Prop(options?: PropOptions): (target: any, propertyKey: string) => void;
export declare function Data(defaultValue?: () => any): (target: any, propertyKey: string) => void;
export declare function Provide(name?: string): (target: any, propertyKey: string) => void;
export declare function Inject(name?: string): (target: any, propertyKey: string) => void;
export declare function Watch<T = any>(propName: keyof T, watchOptions?: WatchOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function BeforeCreate(target: any, propertyKey: string): void;
export declare function Created(target: any, propertyKey: string): void;
export declare function BeforeMount(target: any, propertyKey: string): void;
export declare function Mounted(target: any, propertyKey: string): void;
export declare function BeforeUpdate(target: any, propertyKey: string): void;
export declare function Updated(target: any, propertyKey: string): void;
export declare function BeforeDestroy(target: any, propertyKey: string): void;
export declare function Destroyed(target: any, propertyKey: string): void;
