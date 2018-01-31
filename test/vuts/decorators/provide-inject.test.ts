import Vue from 'vue';
import * as vuvu from 'vuvu';

describe('Component provide/inject decorators', () => {
    it('passes data from parent to child', () => {
        @vuvu.Component()
        class Parent extends Vue {
            @vuvu.Provide() public foo: string = 'abc';
        }

        @vuvu.Component()
        class Child extends Vue {
            @vuvu.Inject() public foo: string;
        }

        let parent = new Parent();
        let child = new Child({
            parent: parent
        });

        expect(parent.foo).toBe('abc');
        expect(child.foo).toBe('abc');
    });
});
