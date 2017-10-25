import { Container, interfaces } from 'inversify';
import Vue from 'vue';

export * from './decorators';
export * from './plugin';

declare module 'vue/types/vue' {
    // tslint:disable-next-line:no-shadowed-variable
    interface Vue {
        readonly $container: Container;
    }
}

declare module 'vue/types/options' {

    interface ComponentIocOptions {
        provide?: { [prop: string]: interfaces.ServiceIdentifier<any> };
        inject?: { [prop: string]: interfaces.ServiceIdentifier<any> };
    }

    interface ComponentOptions<V extends Vue, Data, Methods, Computed, PropsDef> {
        container?: Container;
        ioc?: ComponentIocOptions;
    }
}

export { injectable, Container } from 'inversify';
