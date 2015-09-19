import { Rx } from '@cycle/core';

function mergeAfterFirstSubscription(subscriber, source, other) {
    let disposable = new Rx.CompositeDisposable();
    function unsubscribe() {
        if (disposable) {
            disposable.dispose();
            disposable = null;
        }
    }
    // this variable exists in order to hold a reference to other that will later be cleared
    let otherObservable = other;
    function buildOtherSubscription() {
        disposable.add(otherObservable.subscribe(onNext, onOtherError, onOtherCompleted)); // eslint-disable-line no-use-before-define
        otherObservable = null;
    }
    let sourceCompleted = false;
    let otherCompleted = false;
    function onNext(value) {
        subscriber.onNext(value);
        if (otherObservable) {
            buildOtherSubscription();
        }
    }
    function onError(error) {
        subscriber.onError(error);
        unsubscribe();
    }
    function onCompleted() {
        sourceCompleted = true;
        if (otherCompleted) {
            subscriber.onCompleted();
        } else if (otherObservable) {
            buildOtherSubscription();
        }
    }
    disposable.add(source.subscribe(onNext, onError, onCompleted));
    function onOtherError(error) {
        subscriber.onError(error);
        unsubscribe();
    }
    function onOtherCompleted() {
        otherCompleted = true;
        if (sourceCompleted) {
            subscriber.onCompleted();
        }
    }
    return unsubscribe;
}

Rx.Observable.prototype.mergeAfterFirst = function mergeAfterFirst(other) {
    if (!other || typeof other.subscribe !== 'function') {
        throw new TypeError(`Expected ${other} to be an observable`);
    }
    return Rx.Observable.create(subscriber => mergeAfterFirstSubscription(subscriber, this, other));
};
