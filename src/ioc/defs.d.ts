import { Container, interfaces } from 'inversify';
import Vue from "vue";


declare module "vue/types/vue" {
    interface Vue {
       readonly $container : Container;
    }
}

// declare module "inversify/dts/interfaces/interfaces" {
//     namespace interfaces {
//         interface Container {
//             populate();
//         }
//     }
// }