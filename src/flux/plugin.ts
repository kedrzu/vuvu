import Vue, { PluginObject } from 'vue';
import Vuex, { Store } from 'vuex';

export interface FluxOptions {
    storeFactory: () => Store<any>;
}

export interface FluxPlugin extends PluginObject<FluxOptions> {
    store: Store<any>;
}

const Flux: FluxPlugin = {
    install(vue, options) {
        vue.use(Vuex);

        if (options && options.storeFactory) {
            this.store = options.storeFactory();
        } else {
            this.store = new Store({ strict: true });
        }
    },
    store: null
};

export default Flux;
