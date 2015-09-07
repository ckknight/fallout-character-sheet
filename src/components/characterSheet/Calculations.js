import { Rx } from '@cycle/core';
const owns = Object.prototype.hasOwnProperty;
import InjectableObservable from 'rx-injectable-observable';

export default class Calculations {
    constructor(values = {}) {
        this.values = values;
    }

    set(key, value) {
        if (owns.call(this.values, key)) {
            const observable = this.values[key];
            if (!(observable instanceof InjectableObservable)) {
                throw new Error(`Key already set: ${key}`);
            }
        // this.values[key] = value = value.share();
        // observable.inject(value);
        }
        return this.values[key] = value;
    }

    get(key, future) {
        if (!owns.call(this.values, key)) {
            if (!future) {
                throw new Error(`Unknown key: ${key}`);
            }
            return Rx.Observable.create(subscriber => {
                const values = this.values;
                let unsubscribed = false;
                let unsubscribe;
                function check() {
                    if (unsubscribed) {
                        return;
                    }
                    if (!owns.call(values, key)) {
                        return tick();
                    }
                    unsubscribe = values[key].subscribe(subscriber);
                }
                function tick() {
                    setTimeout(check, 17);
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
