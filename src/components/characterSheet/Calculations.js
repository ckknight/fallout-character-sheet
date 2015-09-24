const owns = Object.prototype.hasOwnProperty;
import InjectableObservable from 'rx-injectable-observable';

const BLACKLISTED_KEYS = {};

export default class Calculations {
    constructor(observables = {}) {
        this.observables = observables;
    }

    set(key, observable) {
        if (key in BLACKLISTED_KEYS) {
            throw new Error(`Cannot set '${key}'`);
        }
        if (owns.call(this.observables, key)) {
            const existing = this.observables[key];
            if (!(existing instanceof InjectableObservable)) {
                throw new Error(`Key already set: ${key}`);
            }
            existing.inject(observable);
        }
        return (this.observables[key] = observable);
    }

    get(key, future) {
        if (key in BLACKLISTED_KEYS) {
            throw new Error(`Cannot refer to '${key}'`);
        }
        if (!(key in this.observables)) {
            if (false && !future) {
                throw new Error(`Unknown key: ${key}`);
            }
            this.observables[key] = new InjectableObservable();
        }
        return this.observables[key];
    }

    with(object) {
        return new Calculations(Object.assign(Object.create(this.observables), object));
    }
}
