import Vue from 'vue';
import * as vuvu from 'vuvu';

@vuvu.Component()
export default class SimpleComponent extends Vue {
    @vuvu.Prop() public foobar: string;
}
