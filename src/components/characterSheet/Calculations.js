const owns = Object.prototype.hasOwnProperty;

export default class Calculations {
    constructor(values = {}) {
        this.values = values;
    }

    set(key, value) {
        if (owns.call(this.values, key)) {
            throw new Error(`Key already set: ${key}`);
        }
        return this.values[key] = value;
    }

    get(key) {
        if (!owns.call(this.values, key)) {
            throw new Error(`Unknown key: ${key}`);
        }
        return this.values[key];
    }
}
