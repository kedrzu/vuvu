import Vue from 'vue';
import * as vuvu from 'vuvu';

import SimpleComponent from './SimpleComponent';

@vuvu.component()
export default class DerivedComponent extends SimpleComponent {

    @vuvu.prop()
    public baz: string;
}
