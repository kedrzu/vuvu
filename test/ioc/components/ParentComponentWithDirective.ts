import Vue from 'vue';
import * as vuvu from 'vuvu';
import * as ioc from 'vuvu/ioc';

import ChildComponent from './ChildComponent';
import './ChildComponent.vue';

@vuvu.component({
    components: {
        ChildComponent
    }
})
export default class ParentComponent extends Vue {
    public container = new ioc.Container();
}
