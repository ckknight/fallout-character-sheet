import { Rx } from '@cycle/core';

function toObservable(value) {
    if (value instanceof Rx.Observable) {
        return value;
    } else if (value && value.constructor === Object) {
        return combineLatestObject(value);
    } else {
        return Rx.Observable.return(value);
    }
}

export default function combineLatestObject(object) {
    const keys = Object.keys(object);
    return Rx.Observable.combineLatest(
        keys.map(key => toObservable(object[key])))
        .map(values => keys.reduce((acc, key, i) => {
                acc[key] = values[i];
                return acc;
            }, {}));
}
