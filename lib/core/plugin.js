"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CorePlugin(vue) {
    Object.defineProperty(vue.prototype, '$vm', {
        get() {
            return this;
        },
    });
}
exports.CorePlugin = CorePlugin;
//# sourceMappingURL=plugin.js.map