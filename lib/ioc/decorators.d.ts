import { interfaces } from 'inversify';
import 'reflect-metadata';
export declare function inject(identifier?: interfaces.ServiceIdentifier<any>): <T>(target: any, propertyKey: string) => void;
export declare function provide(identifier?: interfaces.ServiceIdentifier<any>): <T>(target: any, propertyKey: string) => void;
