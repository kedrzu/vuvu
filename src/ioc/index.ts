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

    interface ComponentOptions<V extends Vue, Data, Methods, Computed, PropsDef> {
        container?: Container;
        iocProvide?: { [prop: string]: interfaces.ServiceIdentifier<any> };
        iocInject?: { [prop: string]: interfaces.ServiceIdentifier<any> };
    }
}

export { injectable, Container } from 'inversify';
