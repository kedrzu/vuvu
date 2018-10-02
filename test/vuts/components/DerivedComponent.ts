import Vue from 'vue';
import * as vuvu from 'vuvu';

@vuvu.Component()
class BaseComponent extends Vue {
    @vuvu.Prop() public foobar: string;
}

@vuvu.Component()
export default class DerivedComponent extends BaseComponent {
    @vuvu.Prop() public baz: string;
}
