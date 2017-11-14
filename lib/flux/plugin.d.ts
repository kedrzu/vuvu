import { PluginObject } from 'vue';
import { Store } from 'vuex';
export interface FluxOptions {
    storeFactory: () => Store<any>;
}
export interface FluxPlugin extends PluginObject<FluxOptions> {
    store: Store<any>;
}
declare const Flux: FluxPlugin;
export default Flux;
