import { Rx } from '@cycle/core';
const owns = Object.prototype.hasOwnProperty;

class FutureObservable extends Rx.Observable {
    constructor() {
        super(subscriber => {
            const subscribers = this._subscribers;
            const subscriptions = this._subscriptions;
            const index = subscribers.length;
            subscribers[index] = subscriber;
            subscriptions[index] = null;
            return () => {
                subscribers[index] = null;
                const subscription = subscriptions[index];
                subscriptions[index] = null;
                if (subscription) {
                    subscription();
                }
            };
        });
        this._subscribers = [];
        this._subscriptions = [];
    }

    setRealObservable(observable) {
        const subscribers = this._subscribers;
        const subscriptions = this._subscriptions;
        for (let i = 0; i < subscribers.length; ++i) {
            const subscriber = subscribers[i];
            if (subscriber) {
                subscribers[i] = null;
                subscriptions[i] = observable.subscribe(subscriber);
            }
        }
    }
}

export default class Calculations {
    constructor(values = {}) {
        this.values = values;
    }

    set(key, value) {
        if (owns.call(this.values, key)) {
            const observable = this.values[key];
            if (!(observable instanceof FutureObservable)) {
                throw new Error(`Key already set: ${key}`);
            }
            this.values[key] = value;
            observable.setRealObservable(value);
        }
        return this.values[key] = value;
    }

    get(key, future) {
        if (!owns.call(this.values, key)) {
            if (!future) {
                throw new Error(`Unknown key: ${key}`);
            }
            this.values[key] = new FutureObservable();
        }
        return this.values[key];
    }

    with(object) {
        return new Calculations(Object.assign(Object.create(this.values), object));
    }
}
