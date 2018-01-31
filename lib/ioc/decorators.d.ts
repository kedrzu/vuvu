import { interfaces } from 'inversify';
import 'reflect-metadata';
export interface InjectConfig {
    optional?: boolean;
}
export declare function Inject(config?: InjectConfig): any;
export declare function Inject<T>(identifier: interfaces.ServiceIdentifier<T>, config?: InjectConfig): any;
export declare function Provide(identifier?: interfaces.ServiceIdentifier<any>): <T>(target: any, propertyKey: string, descriptor?: PropertyDescriptor) => void;
