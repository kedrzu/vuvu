import Vuex, { Store } from 'vuex';
const Flux = {
    install(vue, options) {
        vue.use(Vuex);
        if (options && options.storeFactory) {
            this.store = options.storeFactory();
        }
        else {
            this.store = new Store({ strict: true });
        }
    },
    store: null
};
export default Flux;
//# sourceMappingURL=plugin.js.map