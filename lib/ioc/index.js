"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./decorators"));
__export(require("./plugin"));
var inversify_1 = require("inversify");
exports.injectable = inversify_1.injectable;
exports.Container = inversify_1.Container;
//# sourceMappingURL=index.js.map