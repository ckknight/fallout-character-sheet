import { Rx } from '@cycle/core';
import select from '../select';

function range(min, max, step) {
    if (step <= 0) {
        throw new RangeError(`Expected step to be greater than 0, got ${step}`);
    }

    const array = [];
    for (let value = min; value <= max; value += step) {
        array.push(value);
    }
    return array;
}

export default function selectRange(key, {DOM, value$, min$, max$, step$ = Rx.Observable.return(1), props$}) {
    const result = select(key, {
        DOM,
        value$: value$
            .map(value => value == null ? value : '' + value),
        options$: Rx.Observable.combineLatest(min$, max$, step$, range)
            .map(values => values.map(value => ({
                value: '' + value,
                text: '' + value,
            }))),
        props$,
    });
    return {
        DOM: result.DOM,
        value$: result.value$.map(Number),
    };
}
