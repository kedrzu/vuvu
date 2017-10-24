import Vue from 'vue';
import * as vuvu from 'vuvu';

@vuvu.component()
export default class SimpleComponent extends Vue {

    @vuvu.prop()
    public foobar: string;
}
