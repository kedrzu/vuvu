import Vue from 'vue';
import * as vuvu from 'vuvu';

describe('Component lifecycle hooks decorators', () => {
    it('is run once', () => {
        let runs = 0;

        @vuvu.Component()
        class Component extends Vue {
            @vuvu.Created
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

        @vuvu.Component()
        class Base extends Vue {
            @vuvu.Created
            public foo() {
                runs++;
            }
        }

        @vuvu.Component()
        class Inherited extends Base {}

        let cmp = new Inherited();

        expect(runs).toBe(1);
    });
});
