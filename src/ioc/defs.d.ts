import { Container, interfaces } from 'inversify';
import Vue from "vue";


declare module "vue/types/vue" {
    interface Vue {
        readonly $container: Container;
    }
}

declare module "vue/types/options" {


    interface ComponentOptions<
        V extends Vue,
        Data=DefaultData<V>,
        Methods=DefaultMethods<V>,
        Computed=DefaultComputed,
        PropsDef=PropsDefinition<DefaultProps>> {
        container?: Container;
    }
}

// declare module "inversify/dts/interfaces/interfaces" {
//     namespace interfaces {
//         interface Container {
//             populate();
//         }
//     }
// }