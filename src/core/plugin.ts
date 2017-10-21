import Vue, { PluginFunction } from 'vue';

// there is however a workaround, that uses implicit type inference of the internal VueConstructor type
// here I don't need to "know" the type of vue, because TS is infering it from PluginFunction
export let CorePlugin: PluginFunction<void> = (vue) => {
    Object.defineProperty(vue.prototype, '$vm', {
        get() {
            return this;
        },
    });
};
