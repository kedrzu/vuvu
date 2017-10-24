import { Container } from 'inversify';
import 'reflect-metadata';

interface PropertyInjectMetadata {
    [prop: string]: any;
}

const metadataKey = 'vuvu:inject';

export function foo(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    const key = Reflect.getMetadata('design:type', target, propertyKey);

    let injectMeta = Reflect.getMetadata(metadataKey, target) as PropertyInjectMetadata;
    if (!injectMeta) {
        injectMeta = {};
        Reflect.defineMetadata(metadataKey, injectMeta, target);
    }

    injectMeta[propertyKey] = key;
}

export function inject(identifier?: symbol | string) {
    return <T>(target: any, propertyKey: string) => {
        const key = identifier || Reflect.getMetadata('design:type', target, propertyKey);

        let injectMeta = Reflect.getMetadata(metadataKey, target) as PropertyInjectMetadata;
        if (!injectMeta) {
            injectMeta = {};
            Reflect.defineMetadata(metadataKey, injectMeta, target);
            Reflect.defineMetadata(metadataKey, injectMeta, target.constructor);
            target['qwe'] = injectMeta;
            target.constructor['asd'] = injectMeta;
        }

        injectMeta[propertyKey] = key;
    };
}

export function populate(object: object, container: Container) {
    const metadata = Reflect.getMetadata(metadataKey, object) as PropertyInjectMetadata;
    if (metadata) {
        for (const prop of Object.keys(metadata)) {
            object[prop] = container.get(metadata[prop]);
        }
    }
}
