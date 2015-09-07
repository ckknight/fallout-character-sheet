import { Rx } from '@cycle/core';

Rx.Observable.prototype.sampleToRequestAnimationFrame = function () {
    return Rx.Observable.create(subscriber => {
        let unsubscribed = false;
        let timer = null;
        let nextValue;
        function onTimer() {
            timer = null;
            subscriber.onNext(nextValue);
            nextValue = undefined;
        }
        function clearTimer() {
            if (timer) {
                clearAnimationFrame(timer);
                timer = null;
            }
        }
        function onNext(value) {
            nextValue = value;
            if (!timer) {
                timer = requestAnimationFrame(onTimer);
            }
        }
        function onError(error) {
            clearTimer();
            subscriber.onError(error);
        }
        function onDone() {
            if (timer) {
                clearAnimationFrame(timer);
                onTimer();
            }
            subscriber.onDone();
        }
        const unsubscribe = this.subscribe(onNext, onError, onDone);
        return () => {
            unsubscribed = true;
            clearTimer();
            return unsubscribe();
        };
    });
};
