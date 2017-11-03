import Vue from 'vue';
import * as vuvu from 'vuvu';

describe('Component data decorator', () => {
    it('data is different accross components', () => {
        @vuvu.component()
        class Component extends Vue {
            @vuvu.data() public foo: string;
        }

        let cmp1 = new Component();
        let cmp2 = new Component();

        cmp1.foo = '123';
        cmp2.foo = '567';

        expect(cmp1.foo).toBe('123');
        expect(cmp2.foo).toBe('567');
    });

    it('allows setting default value with argument', () => {
        @vuvu.component()
        class Component extends Vue {
            @vuvu.data(() => 'abc')
            public foo: string;
        }

        let cmp = new Component();

        expect(cmp.foo).toBe('abc');
    });
});
