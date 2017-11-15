import Flux from './plugin';
import { getMutations } from './reflection';
export class Store {
    constructor(options) {
        this.root = options.store || Flux.store;
        if (!this.root) {
            throw new Error('Flux plugin is not initialized. Call Vue.use(Flux) before creating store or provide your own store.');
        }
        this.name = options.name;
        this.id = getUniqueName(options.name);
        let mutations = getMutations(Object.getPrototypeOf(this));
        let opts = {
            mutations: {},
            namespaced: true,
            state: options.state
        };
        for (let key of Object.keys(mutations)) {
            let mutation = mutations[key];
            opts.mutations[key] = (state, payload) => {
                mutation.call(this, payload);
            };
        }
        this.root.registerModule(this.id, opts);
        modules[this.id] = this;
    }
    get state() {
        return this.root.state[this.id];
    }
    set state(value) {
        this.root.state[this.id] = value;
    }
    dispose() {
        this.root.unregisterModule(this.id);
        delete modules[this.id];
    }
}
const modules = {};
function getUniqueName(name) {
    if (!modules[name]) {
        return name;
    }
    for (let i = 1; modules[name]; i++) {
        let newName = `${name}-${i}`;
        if (!modules[newName]) {
            return newName;
        }
    }
}
//# sourceMappingURL=store.js.map