import { interfaces } from 'inversify';
import 'reflect-metadata';
import * as types from '../types';
export interface InjectConfig<T> {
    optional?: boolean;
    type?: interfaces.ServiceIdentifier<T>;
}
export interface ProvideConfig<T> {
    resolve?: boolean | types.Constructor<T>;
    type?: interfaces.ServiceIdentifier<T>;
}
export declare function Inject<T>(config?: InjectConfig<T>): any;
export declare function Inject<T>(type: interfaces.ServiceIdentifier<T>): any;
export declare function Provide<T>(config?: ProvideConfig<T>): any;
export declare function Provide<T>(type: interfaces.ServiceIdentifier<T>): any;
