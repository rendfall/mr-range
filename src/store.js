export class Store {
    constructor(reducers = {}, initialState = {}) {
        this.subscribers = [];
        this.reducers = reducers;
        this.state = this.reduce(initialState, {});
    }

    get value() {
        return this.state;
    }

    subscribe(fn) {
        this.subscribers = [...this.subscribers, fn];
        fn(this.value);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn);
        };
    }

    dispatch(action) {
        this.state = this.reduce(this.state, action);
        this.subscribers.forEach(fn => fn(this.value));
    }

    reduce(state, action) {
        const newState = {};
        for (const prop in this.reducers) {
            if (this.reducers.hasOwnProperty(prop)) {
                newState[prop] = this.reducers[prop](state[prop], action);
            }
        }
        return newState;
    }
}
