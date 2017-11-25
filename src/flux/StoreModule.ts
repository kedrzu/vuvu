import * as vuex from 'vuex';

export class StoreModule<TState extends {}> {
    public state: TState;

    constructor(state: TState) {
        this.state = state;
    }
}
