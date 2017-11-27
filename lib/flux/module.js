export class FluxModule {
    register(container) {
        return;
    }
    run(container) {
        let options = {
            modules: {},
            strict: true
        };
        // iterate stores to get all configs
        // this.stores.forEach(store => {
        //     if (!store.name) {
        //         store.name = Object.getPrototypeOf(store).constructor.name;
        //     }
        //     options.modules[store.name] = {
        //         mutations: getMutationsForStore(store),
        //         namespaced: true,
        //         state: store.state
        //     };
        // });
        // this.store = new vuex.Store(options);
        // // iterate stores to initialize them with a state
        // this.stores.forEach(store => {
        //     Object.defineProperty(store, 'state', {
        //         get: () => this.store.state[store.name],
        //         set: value => (this.store.state[store.name] = value)
        //     });
        // });
        // container.bind(vuex.Store).toConstantValue(this.store);
    }
}
//# sourceMappingURL=module.js.map