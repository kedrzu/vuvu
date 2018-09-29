import { AbstractConstructor, Constructor } from '../types';
export interface ResolvableOptions {
    for: AbstractConstructor;
    role?: string | symbol;
    order?: number;
}
export declare function Resolvable(options: ResolvableOptions): <T>(constructor: Constructor<T>) => void;
export interface ResolveOptions {
    for: AbstractConstructor | object;
    role?: string;
}
export declare function resolveTypes(options: ResolveOptions): Constructor[];
