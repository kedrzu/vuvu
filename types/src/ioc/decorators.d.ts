import { Container } from 'inversify';
import 'reflect-metadata';
export declare function foo(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): void;
export declare function inject(identifier?: symbol | string): <T>(target: any, propertyKey: string) => void;
export declare function populate(object: object, container: Container): void;
