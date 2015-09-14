import { Rx } from '@cycle/core';
import Immutable from 'immutable';

export default function calculateWhen(equation, calculations, calculateAlgorithm) {
    const otherwiseView = calculateAlgorithm(equation.otherwise, calculations);
    const possibilities = equation.conditions
        .toKeyedSeq()
        .map((value, condition) => {
            const operandView = calculateAlgorithm(value, calculations);
            return {
                condition$: calculations.get(condition),
                DOM: operandView.DOM,
                value$: operandView.value$,
                equation$: operandView.equation$,
            };
        })
        .toArray()
        .concat([{
            condition$: Rx.Observable.return(true),
            DOM: otherwiseView.DOM,
            value$: otherwiseView.value$,
            equation$: otherwiseView.equation$,
        }]);

    function calculate(key, defaultValue) {
        return possibilities
            .reduceRight((acc, possibility) => {
                return possibility.condition$
                    .flatMapLatest(condition => {
                        if (condition) {
                            return possibility[key];
                        }
                        return acc;
                    });
            }, defaultValue);
    }
    const vTree$ = calculate('DOM', Rx.Observable.return(null));
    const value$ = calculate('value$', Rx.Observable.never());
    const equation$ = calculate('equation$', Rx.Observable.never());
    return {
        // DOM: result.pluck('vTree'),
        DOM: vTree$,
        value$: value$
            .distinctUntilChanged()
            .shareReplay(1),
        equation$: equation$
            .distinctUntilChanged(undefined, Immutable.is)
            .shareReplay(1),
    };
}
