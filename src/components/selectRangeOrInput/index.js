import { Rx } from '@cycle/core';
import selectRange from '../selectRange';
import input from '../input';

export default function selectRangeOrInput(key, {DOM, value$, min$, max$, step$ = Rx.Observable.return(1), props$ = Rx.Observable.return(null)}) {
    if (typeof window.orientation === 'undefined') {
        // assume desktop
        return input(key, 'number', {
            DOM,
            value$,
            props$: Rx.Observable.combineLatest(min$, max$, step$, props$,
                (min, max, step, props) => Object.assign({
                    min,
                    max,
                    step,
                }, props || {})),
        });
    }
    return selectRange(key, {
        DOM,
        value$,
        min$,
        max$,
        step$,
        props$,
    });
}
