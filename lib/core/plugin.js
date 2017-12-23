export function CorePlugin(vue) {
    Object.defineProperty(vue.prototype, '$vm', {
        get() {
            return this;
        },
    });
}
//# sourceMappingURL=plugin.js.map