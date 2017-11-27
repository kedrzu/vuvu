import * as vuex from 'vuex';
import * as ioc from 'vuvu/ioc';
export declare class FluxModule implements ioc.Module {
    store: vuex.Store<any>;
    register(container: ioc.Container): void;
    run(container: ioc.Container): void;
}
