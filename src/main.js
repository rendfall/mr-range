import { Store } from './store.js';
import { Feature } from './feature.js';

((root) => {
    function createStore(initialState = {}) {
        const reducers = {
            counter(state = initialState, action) {
                if (!action || !action.type) {
                    return state;
                }

                const { step, spend } = state;
                const payload = action && action.payload || {};
                const features = cloneFeatures(state.features);
                const feature = features.get(payload.id);

                const isPointsDistributed = spend >= feature.max;
                const pointsLeft = (feature.max - spend);

                switch (action.type) {
                    case 'increment':
                        if (isPointsDistributed) {
                            return { ...state };
                        }

                        feature.value += step;
                        features.set(payload.id, feature);

                        return {
                            ...state,
                            features,
                            spend: spend + step
                        };
                    case 'decrement':
                        if (spend === 0) {
                            return { ...state };
                        }

                        feature.value -= step;
                        features.set(payload.id, feature);

                        return {
                            ...state,
                            features,
                            spend: spend - step
                        };
                    case 'setValue':
                        if (pointsLeft < payload.value) {
                            return { ...state };
                        }

                        feature.value = payload.value;
                        features.set(payload.id, feature);

                        return {
                            ...state,
                            features,
                            spend: spend + payload.value
                        };
                    default:
                        console.warn(`The action ${action.type} is not defined`);
                        return { ...state };
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

        setValue(id, value) {
            value = Number(value);

            if (Number.isNaN(value)) {
                console.error('Value must be a number');
                return;
            }

            this.store.dispatch({
                type: 'setValue',
                payload: { id, value }
            });
        }

        onChange(fn) {
            this.store.subscribe((state) => fn(state));
        }
    }

    // Expose lib
    root.MrRange = MrRange;
})(window);
