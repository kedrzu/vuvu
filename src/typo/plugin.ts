import Vue from 'vue';

import { Descriptor, Typed } from './descriptor';
import { descriptors } from './descriptorRegister';

export function TypoPlugin(vue: typeof Vue) {
    Object.defineProperty(Object.prototype, '$descriptor', {
        get(this: Typed) {
            // if there is not type descriptor is undefined
            // it there is type, but not registered, descriptor is null
            let type = this.$type;
            if (!type) {
                return undefined;
            }

            return descriptors[type] || null;
        },
        configurable: true,
        enumerable: false
    });
}
