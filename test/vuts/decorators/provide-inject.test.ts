import Vue from 'vue';
import * as vuvu from 'vuvu';

describe('Component provide/inject decorators', () => {
    it('passes data from parent to child', () => {
        @vuvu.component()
        class Parent extends Vue {
            @vuvu.provide() public foo: string = 'abc';
        }

        @vuvu.component()
        class Child extends Vue {
            @vuvu.inject() public foo: string;
        }

        let parent = new Parent();
        let child = new Child({
            parent: parent
        });

        expect(parent.foo).toBe('abc');
        expect(child.foo).toBe('abc');
    });
});
