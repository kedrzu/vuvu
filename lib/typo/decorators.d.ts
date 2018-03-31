import { Constructor, Dictionary } from 'vuvu/types';
export interface TypoDescriptor {
    name: string;
    type: Constructor;
    props: Dictionary<TypoPropertyDescriptor>;
}
export interface TypoPropertyDescriptor {
    json: boolean;
    type: Constructor;
}
export interface TypoPropertyOptions {
    json?: boolean;
}
export declare function Type(name?: string): <T extends new (...args: any[]) => {}>(constructor: T) => T;
export declare function Property(options?: TypoPropertyOptions): <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) => void;
export declare function getDescriptor(type: string | Constructor): TypoDescriptor;
export declare function isTypo(constructor: Constructor): boolean;
export declare function resolve<T extends {} = {}>(obj: Partial<T>, type?: string | Constructor<T>): T;
