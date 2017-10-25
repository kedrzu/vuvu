import { ComponentOptions } from 'vue';
export declare type LifecycleHook = () => void;
export declare type DecoratorCallback = (options: ComponentOptions<any>) => void;
export declare function addDecorator(target: any, callback: DecoratorCallback): void;
export declare function getDecorators(target: any): DecoratorCallback[];
export declare function addLifecycleHook(target: any, hook: string, callback: LifecycleHook): void;
