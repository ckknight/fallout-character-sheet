import { Rx } from '@cycle/core';
import Immutable from 'immutable';
import renderRandom from './render';
import Range from '../Range';

export default function calculateRandom(range, calculations, calculateAlgorithm) {
    const minView = calculateAlgorithm(range.min, calculations);
    const maxView = calculateAlgorithm(range.max, calculations);
    const value$ = Rx.Observable.merge(
        minView.value$
            .map(min => o => o.set('min', min)),
        maxView.value$
            .map(max => o => o.set('max', max)))
        .startWith(new Range())
        .scan((acc, modifier) => modifier(acc))
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);
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
        value$,
        equation$,
    };
}
