import { Rx } from '@cycle/core';

function noop() {
}
function fromProducer(producer) {
    let observable = null;
    let fn = producer;
    return Rx.Observable.create(subscriber => {
        if (!observable) {
            try {
                observable = fn();
                if (!observable || typeof observable.subscribe !== 'function') {
                    throw new TypeError(`Expected producer to return an observable, got ${observable}`);
                }
            } catch (e) {
                subscriber.onError(e);
                return noop;
            }
            fn = null;
        }
        return observable.subscribe(subscriber);
    });
}

function withValidation(producer, keys) {
    if (typeof producer !== 'function') {
        throw new TypeError(`Expected ${producer} to be a function`);
    }
    return () => {
        const result = producer();
        if (Object(result) !== result) {
            throw new TypeError(`Expected producer to return an object, got ${result}`);
        }
        for (let i = 0; i < keys.length; ++i) {
            const observable = result[keys[i]];
            if (!observable || typeof observable.subscribe !== 'function') {
                throw new TypeError(`Expected producer to return an object with ${keys[i]} as an observable, got ${observable}`);
            }
        }
        return result;
    };
}

function fromComplexProducer(producer, keys) {
    let box = null;
    let fn = withValidation(producer, keys);
    return keys.reduce((acc, key) => {
        acc[key] = Rx.Observable.create(subscriber => {
            if (!box) {
                try {
                    box = fn();
                } catch (e) {
                    subscriber.onError(e);
                    return noop;
                }
                fn = null;
            }
            return box[key].subscribe(subscriber);
        });
        return acc;
    }, {});
}

function makeFuture(observable, scheduler) {
    return Rx.Observable.create(subscriber => {
        const disposable = new Rx.CompositeDisposable();
        disposable.add(scheduler.scheduleWithRelative(1, () => {
            if (!disposable.isDisposed) {
                disposable.add(observable.subscribe(subscriber));
            }
        }));
        return disposable;
    });
}

function simpleFuture(callback, scheduler) {
    const observable = fromProducer(callback);
    return makeFuture(observable, scheduler);
}

function complexFuture(callback, scheduler, keys) {
    const object = fromComplexProducer(callback, keys);
    return keys.reduce((acc, key) => {
        acc[key] = makeFuture(object[key], scheduler);
        return acc;
    }, {});
}

export default function future(callback, scheduler, ...keys) {
    if (!keys.length) {
        return simpleFuture(callback, scheduler || Rx.Scheduler.default);
    }
    return complexFuture(callback, scheduler || Rx.Scheduler.default, keys);
}

future.wrap = function wrap(fn, ...keys) {
    return function wrapped(...args) {
        let scheduler = null;
        if (args.length && args[0] != null && args[0].scheduler != null) {
            scheduler = args[0].scheduler;
        }
        return future(() => fn.apply(this, args), scheduler, ...keys);
    };
};
