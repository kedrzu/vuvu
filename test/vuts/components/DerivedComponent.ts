import Vue from 'vue';
import * as vuvu from 'vuvu';

import SimpleComponent from './SimpleComponent';

@vuvu.Component()
export default class DerivedComponent extends SimpleComponent {
    @vuvu.Prop() public baz: string;
}
