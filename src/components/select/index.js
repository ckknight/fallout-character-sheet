import { Rx } from '@cycle/core';
import renderSelect from './render';
import errorHandler from '../errorHandler';
import '../../rx-merge-after-first';

export default function select(key, {DOM, value$: inputValue$, options$, props$ = Rx.Observable.return(null)}) {
    const newValue$ = DOM.select(`.${key}`)
        .events('change')
        .map(ev => ev.target.value);

    const sharedOptions$ = options$
        .map(options => Array.from(options))
        .shareReplay(1);
    const value$ = inputValue$
        .mergeAfterFirst(newValue$)
        .distinctUntilChanged()
        .shareReplay(1);

    const vtree$ = Rx.Observable.combineLatest(sharedOptions$, value$, props$,
        (options, value, props) => renderSelect(key, options, value, props));

    return {
        DOM: vtree$
            .catch(errorHandler(key)),
        value$: value$.combineLatest(sharedOptions$,
            (value, options) => {
                if (value == null) {
                    return null;
                }
                if (options.findIndex(o => o.value === value) !== -1) {
                    return value;
                }
                return null;
            })
            .distinctUntilChanged()
            .shareReplay(1),
    };
}
