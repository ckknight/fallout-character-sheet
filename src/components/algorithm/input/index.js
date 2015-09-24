import { Rx } from '@cycle/core';
import Immutable from 'immutable';
import Range from '../Range';
import input from '../../input';

export default function calculateInput(spec, calculations, calculateAlgorithm) {
    throw new Error('Cannot create an input');
    const initial$ = calculateAlgorithm(spec.initial, calculations).value$;
    const min$ = calculateAlgorithm(spec.min, calculations).value$;
    const max$ = calculateAlgorithm(spec.max, calculations).value$;
    const step$ = calculateAlgorithm(spec.step, calculations).value$;
    const inputView = input(Math.random().toString(36).slice(2), 'number', {

    });
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
