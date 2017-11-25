import * as types from 'vuvu/types';

import { Container } from './container';

export interface Module {
    register?(container: Container);
    run?(container: Container);
}

export class Bootstrapper {
    public container: Container;
    private modules: Module[] = [];

    constructor(container?: Container) {
        this.container = container || new Container();
    }

    public addModule(module: Module): Bootstrapper {
        let ctor = Object.getPrototypeOf(module).constructor;
        if (ctor) {
            this.container.bind(ctor).toConstantValue(module);
        }
        this.modules.push(module);
        return this;
    }

    public hasModule(module: Module | types.Constructor<Module>) {
        return this.modules.some(m => {
            if (module === m) {
                return true;
            }

            let ctor = Object.getPrototypeOf(m).constructor;
            return module === ctor;
        });
    }

    public run() {
        this.modules.forEach(m => m.register && m.register(this.container));
        this.modules.forEach(m => m.run && m.run(this.container));
    }
}
