"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const vue_1 = require("vue");
const decorators = require("../vuts/decorators");
const reflection = require("../vuts/reflection");
function inject(identifier) {
    return (target, propertyKey) => {
        identifier = identifier || Reflect.getMetadata('design:type', target, propertyKey);
        if (target instanceof vue_1.default) {
            // setup ioc configuration for this component
            reflection.addDecorator(target, options => {
                let iocOptions = options.ioc || (options.ioc = {});
                let injectOptions = iocOptions.inject || (iocOptions.inject = {});
                injectOptions[propertyKey] = identifier;
            });
            // also add this property to be reactive
            decorators.data()(target, propertyKey);
        }
        else {
            inversify_1.inject(identifier)(target, propertyKey);
        }
    };
}
exports.inject = inject;
function provide(identifier) {
    return (target, propertyKey) => {
        identifier = identifier
            || Reflect.getMetadata('design:returntype', target, propertyKey)
            || Reflect.getMetadata('design:type', target, propertyKey);
        // setup ioc provide configuration for this component
        reflection.addDecorator(target, options => {
            let iocOptions = options.ioc || (options.ioc = {});
            let provideOptions = iocOptions.provide || (iocOptions.provide = {});
            provideOptions[propertyKey] = identifier;
        });
    };
}
exports.provide = provide;
//# sourceMappingURL=decorators.js.map