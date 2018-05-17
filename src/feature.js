export class Feature {
    constructor(id, options = {}) {
        this.id = id;
        this.value = options.value || 0;
        this.min = options.min || 0;
        this.max = options.max || 10;
        this.step = options.step || 1;
    }
}
