import { Rx } from '@cycle/core';

function noop() {
}
function fromProducer(producer) {
    let observable = null;
    return Rx.Observable.create(subscriber => {
        if (!observable) {
            try {
                observable = producer();
            } catch (e) {
                subscriber.onError(e);
                return noop;
            }
            producer = null;
        }
        return observable.subscribe(subscriber);
    });
}

export default function future(callback) {
    const observable = fromProducer(callback);
    return Rx.Observable.create(subscriber => {
        let unsubscribed = false;
        let subscription;
        function unsubscribe() {
            if (unsubscribed) {
                return;
            }
            unsubscribed = true;
            if (subscription) {
                subscription();
            }
        }
        setTimeout(() => {
            if (unsubscribed) {
                return;
            }
            subscription = observable.subscribe(subscriber);
        }, 0);
        return unsubscribe;
    });
}
