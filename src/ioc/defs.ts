import { Container, interfaces } from 'inversify';
import Vue from 'vue';

declare module 'vue/types/vue' {
    // tslint:disable-next-line:no-shadowed-variable
    interface Vue {
        readonly $container: Container;
    }
}

declare module 'vue/types/options' {

    interface ComponentOptions<V extends Vue> {
        container?: Container;
        iocProvide?: { [prop: string]: interfaces.ServiceIdentifier<any> };
        iocInject?: { [prop: string]: interfaces.ServiceIdentifier<any> };
    }
}
