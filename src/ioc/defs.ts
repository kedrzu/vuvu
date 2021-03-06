import { Container, interfaces } from 'inversify';
import Vue from 'vue';

import * as types from 'vuvu/types';

declare module 'vue/types/vue' {
    // tslint:disable-next-line:no-shadowed-variable
    interface Vue {
        readonly $container: Container;
    }
}

export interface InjectConfig {
    identifier: interfaces.ServiceIdentifier<any>;
    optional?: boolean;
}

export interface ProvideConfig {
    identifier: interfaces.ServiceIdentifier<any>;
    resolve?: types.Constructor;
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        container?: Container;
        iocProvide?: { [prop: string]: ProvideConfig };
        iocInject?: { [prop: string]: InjectConfig };
    }
}
