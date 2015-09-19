import { Rx } from '@cycle/core';

function toObservable(value, fill) {
    if (value instanceof Rx.Observable) {
        if (fill !== undefined) {
            return value.startWith(fill);
        }
        return value;
    }
    if (value && value.constructor === Object) {
        return combineLatestObject(value, fill); // eslint-disable-line no-use-before-define
    }
    if (Array.isArray(value)) {
        return Rx.Observable.combineLatest(value
            .map(element => toObservable(element, fill)));
    }
    return Rx.Observable.return(value);
}

export default function combineLatestObject(object, fill) {
    const keys = Object.keys(object);
    return Rx.Observable.combineLatest(
        keys.map(key => toObservable(object[key], fill)))
        .map(values => keys.reduce((acc, key, i) => {
                acc[key] = values[i];
                return acc;
            }, {}));
}
