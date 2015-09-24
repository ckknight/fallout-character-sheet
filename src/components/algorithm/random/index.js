import { Rx } from '@cycle/core';
import Immutable from 'immutable';
import renderRandom from './render';

export default function calculateRandom(range, calculations, calculateAlgorithm) {
    const minView = calculateAlgorithm(range.min, calculations);
    const maxView = calculateAlgorithm(range.max, calculations);
    const equation$ = Rx.Observable.merge(
        minView.equation$
            .map(eq => acc => acc.set('min', eq)),
        maxView.equation$
            .map(eq => acc => acc.set('max', eq)))
        .startWith(range)
        .scan((equation, modifier) => modifier(equation))
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);
    return {
        DOM: minView.DOM.combineLatest(maxView.DOM, equation$,
            (min, max, equation) => renderRandom(min, max, equation)),
        value$: Rx.Observable.return(NaN),
        equation$,
        calculate() {
            return minView.value$.combineLatest(maxView.value$,
                (min, max) => Math.floor(Math.random() * (max - min)) + min)
                .first();
        },
    };
}
