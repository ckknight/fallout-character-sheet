import { Rx } from '@cycle/core';

Rx.Observable.prototype.sampleToRequestAnimationFrame = function sampleToRequestAnimationFrame() {
    return Rx.Observable.create(subscriber => {
        let unsubscribed = false;
        let timer = false;
        let nextValue;
        function onTimer() {
            if (!unsubscribed && timer) {
                timer = false;
                subscriber.onNext(nextValue);
                nextValue = undefined;
            }
        }
        function clearTimer() {
            timer = false;
        }
        function onNext(value) {
            if (unsubscribed) {
                return;
            }
            nextValue = value;
            if (!timer) {
                timer = true;
                requestAnimationFrame(onTimer);
            }
        }
        function onError(error) {
            if (unsubscribed) {
                return;
            }
            clearTimer();
            subscriber.onError(error);
        }
        function onDone() {
            if (unsubscribed) {
                return;
            }
            onTimer();
            subscriber.onDone();
        }
        const subscription = this.subscribe(onNext, onError, onDone);
        return () => {
            unsubscribed = true;
            clearTimer();
            subscription.dispose();
        };
    });
};
