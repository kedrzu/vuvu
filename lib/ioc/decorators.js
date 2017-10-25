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
                let injectOptions = options.iocInject || (options.iocInject = {});
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
            let provideOptions = options.iocProvide || (options.iocProvide = {});
            provideOptions[propertyKey] = identifier;
        });
    };
}
exports.provide = provide;
//# sourceMappingURL=decorators.js.map