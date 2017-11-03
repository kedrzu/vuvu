import Vue from 'vue';
import * as vuvu from 'vuvu';

describe('Component lifecycle hooks decorators', () => {
    it('is run once', () => {
        let runs = 0;

        @vuvu.component()
        class Component extends Vue {
            @vuvu.created
            public foo() {
                runs++;
            }
        }

        let cmp1 = new Component();

        expect(runs).toBe(1);

        let cmp2 = new Component();

        expect(runs).toBe(2);
    });

    it('is run once when inherited', () => {
        let runs = 0;

        @vuvu.component()
        class Base extends Vue {
            @vuvu.created
            public foo() {
                runs++;
            }
        }

        @vuvu.component()
        class Inherited extends Base {}

        let cmp = new Inherited();

        expect(runs).toBe(1);
    });
});
