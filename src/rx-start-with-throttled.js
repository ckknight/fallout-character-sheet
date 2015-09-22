import { Rx } from '@cycle/core';

Rx.Observable.prototype.startWithThrottled = function startWithThrottled(action, scheduler = Rx.Scheduler.default) {
    return Rx.Observable.create(subscriber => {
        const disposable = new Rx.CompositeDisposable();
        let first = true;
        function onNext(value) {
            first = false;
            subscriber.onNext(value);
        }
        function onError(error) {
            first = false;
            subscriber.onError(error);
        }
        function onCompleted() {
            first = false;
            subscriber.onCompleted();
        }
        disposable.add(scheduler.scheduleWithRelative(1, () => {
            if (first) {
                first = false;
                let result;
                try {
                    result = action();
                } catch (e) {
                    subscriber.onError(e);
                    disposable.dispose();
                    return;
                }
                subscriber.onNext(result);
            }
        }));
        disposable.add(this.subscribe(onNext, onError, onCompleted));
        return disposable;
    });
};
