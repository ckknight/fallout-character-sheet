import { Rx } from '@cycle/core';
import button from '../button';
import InjectableObservable from 'rx-injectable-observable';

export default function plusMinusButtons(key, {DOM, value$: inputValue$, min$, max$, plus$, minus$, plusProps$, minusProps$}) {
    const state$ = new InjectableObservable();

    const plusView = button(`${key}-plus`, {
        DOM,
        vTree$: plus$,
        props$: state$.combineLatest(plusProps$ || Rx.Observable.return({}),
            ({value, max}, props) => ({
                    disabled: value >= max,
                    ...props,
            }))
            .distinctUntilChanged(),
    });

    const minusView = button(`${key}-minus`, {
        DOM,
        vTree$: minus$,
        props$: state$.combineLatest(minusProps$ || Rx.Observable.return({}),
            ({value, min}, props) => ({
                    disabled: value <= min,
                    ...props
            }))
            .distinctUntilChanged(),
    });

    state$.inject(Rx.Observable.merge(
        inputValue$
            .map(value => ({min, max}) => ({
                        min,
                        max,
                        value,
                })),
        plusView.value$
            .map(() => ({min, max, value}) => ({
                        min,
                        max,
                        value: value + 1,
                })),
        minusView.value$
            .map(() => ({min, max, value}) => ({
                        min,
                        max,
                        value: value - 1,
                })),
        min$
            .map(min => ({max, value}) => ({
                        min,
                        max,
                        value,
                })),
        max$
            .map(max => ({min, value}) => ({
                        min,
                        max,
                        value,
                })))
        .map(modifier => acc => {
                const {min, max, value} = modifier(acc);
                return {
                    min,
                    max,
                    value: min != null && max != null && value != null ? Math.min(max, Math.max(min, value)) : value,
                };
        })
        .scan((acc, modifier) => modifier(acc), {
            min: null,
            max: null,
            value: null,
        })
        .filter(({min, max, value}) => min != null && max != null && value != null)
        .distinctUntilChanged()
        .shareReplay(1));

    return {
        plusDOM: plusView.DOM,
        minusDOM: minusView.DOM,
        value$: state$
            .pluck('value')
            .distinctUntilChanged(),
    };
}
