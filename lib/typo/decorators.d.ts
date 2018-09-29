import { Constructor, Dictionary } from 'vuvu/types';
export interface TypoConfig {
    id?: string;
    name?: string;
}
export interface TypoDescriptor extends TypoConfig {
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
export declare function AbstractType(): <T>(constructor: T) => T;
export declare function Type(config?: TypoConfig): any;
export declare function Type(id: string): any;
export declare function Property(options?: TypoPropertyOptions): <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) => void;
export declare function getDescriptor(type: string | Constructor): TypoDescriptor;
export declare function isTypo(constructor: Constructor): boolean;
export declare function resolve<T extends {} = {}>(obj: Partial<T>, type?: string | Constructor<T>): T;
