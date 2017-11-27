import { Container } from './container';
export class Bootstrapper {
    constructor(container) {
        this.modules = [];
        this.container = container || new Container();
    }
    addModule(module) {
        let ctor = Object.getPrototypeOf(module).constructor;
        if (ctor) {
            this.container.bind(ctor).toConstantValue(module);
        }
        this.modules.push(module);
        return this;
    }
    hasModule(module) {
        return this.modules.some(m => {
            if (module === m) {
                return true;
            }
            let ctor = Object.getPrototypeOf(m).constructor;
            return module === ctor;
        });
    }
    run() {
        this.modules.forEach(m => m.register && m.register(this.container));
        this.modules.forEach(m => m.run && m.run(this.container));
    }
}
//# sourceMappingURL=modularity.js.map