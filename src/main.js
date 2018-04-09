import { Store } from './store.js';
import { Feature } from './feature.js';

((root) => {
    function createStore(initialState = {}) {
        const reducers = {
            counter(state = initialState, action) {
                if (!action || !action.type) {
                    return state;
                }

                const id = action && action.payload.id;
                const { step, spend } = state;
                const features = cloneFeatures(state.features);
                const feature = features.get(id);

                switch (action.type) {
                    case 'increment':
                        feature.value += step;
                        features.set(id, feature);
                        return {
                            ...state,
                            features,
                            spend: spend + step
                        };
                    case 'decrement':
                        feature.value -= step;
                        features.set(id, feature);
                        return {
                            ...state,
                            features,
                            spend: spend - step
                        };
                    default:
                        console.warn(`The action ${action.type} is not defined`);
                        return state;
                }
            }
        };

        return new Store(reducers, initialState);
    }

    function createFeature(id, options = {}) {
        return new Feature(id, {
            max: options.max,
            step: options.step
        });
    }

    function cloneFeatures(features) {
        const cloned = new Map();

        features.forEach((feature) => {
            cloned.set(feature.id, Object.assign({}, feature));
        });

        return cloned;
    }

    class MrRange {
        constructor(featureNames, options = {}) {
            this.features = new Map();

            featureNames.forEach((name) => {
                this.features.set(name, createFeature(name));
            });

            this.store = createStore({
                counter: {
                    features: this.features,
                    step: options.step || 1,
                    total: options.total || 10,
                    spend: options.spend || 0
                }
            });
        }

        increment(id) {
            this.store.dispatch({
                type: 'increment',
                payload: { id }
            });
        }

        decrement(id) {
            this.store.dispatch({
                type: 'decrement',
                payload: { id }
            });
        }

        onChange(fn) {
            this.store.subscribe((state) => fn(state));
        }
    }

    // Expose lib
    root.MrRange = MrRange;
})(window);
