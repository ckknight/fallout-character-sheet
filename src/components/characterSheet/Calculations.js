import { Rx } from '@cycle/core';
const owns = Object.prototype.hasOwnProperty;
import InjectableObservable from 'rx-injectable-observable';

const BLACKLISTED_KEYS = {};

export default class Calculations {
    constructor(values = {}) {
        this.values = values;
    }

    set(key, value) {
        if (key in BLACKLISTED_KEYS) {
            throw new Error(`Cannot set '${key}'`);
        }
        if (owns.call(this.values, key)) {
            const observable = this.values[key];
            if (!(observable instanceof InjectableObservable)) {
                throw new Error(`Key already set: ${key}`);
            }
        }
        return (this.values[key] = value);
    }

    get(key, future) {
        if (key in BLACKLISTED_KEYS) {
            throw new Error(`Cannot refer to '${key}'`);
        }
        if (!(key in this.values)) {
            if (!future) {
                throw new Error(`Unknown key: ${key}`);
            }
            return Rx.Observable.create(subscriber => {
                const values = this.values;
                let unsubscribed = false;
                let unsubscribe;
                function tick() {
                    setTimeout(check, 17);
                }
                function check() {
                    if (unsubscribed) {
                        return;
                    }
                    if (!owns.call(values, key)) {
                        tick(); // eslint-disable-line no-use-before-define
                        return;
                    }
                    unsubscribe = values[key].subscribe(subscriber);
                }
                tick();
                return () => {
                    unsubscribed = true;
                    if (unsubscribe) {
                        unsubscribe();
                    }
                };
            });
        }
        return this.values[key];
    }

    with(object) {
        return new Calculations(Object.assign(Object.create(this.values), object));
    }
}
