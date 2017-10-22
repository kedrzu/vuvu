import { Container} from 'inversify';
import Vue from "vue";


declare module "vue/types/vue" {
    interface Vue {
       readonly $container : Container;
    }
}