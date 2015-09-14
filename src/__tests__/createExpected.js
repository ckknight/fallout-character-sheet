import { Rx } from '@cycle/core';
const {onNext} = Rx.ReactiveTest;

function identity(x) {
    return x;
}
export default function createExpected(object, callback = identity) {
    return Object.keys(object)
        .map(x => +x)
        .sort()
        .map(time => onNext(time, callback(object[time])));
}
