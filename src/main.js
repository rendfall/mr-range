((root) => {
    const DEFAULTS = {
        featureMax: 0,
        featureStep: 1
    };

    class Feature {
        constructor(name) {
            this.name = name;
            this.max = null;
            this.step = null;
        }

        setMax(value) {
            this.max = value;
        }

        setStep(value) {
            this.step = value;
        }
    }

    class PointsPool {
        constructor(max) {
            this.max = 0;
            this.pointsLeft = this.max;
        }

        setMax(value) {
            this.max = value;
        }
    }

    class MrRange {
        constructor(pointsMax) {
            this.points = new PointsPool(pointsMax);
            this.features = new Map();
        }

        createFeature(name, options = {}) {
            const feature = new Feature(name);

            feature.setMax = options.max || DEFAULTS.featureMax;
            feature.setStep = options.step || DEFAULTS.featureStep;

            this.features.set(name, feature);
        }

        setPoints(n) {
            this.points = n;
        }
    }

    root.MrRange = MrRange;
})(window);
