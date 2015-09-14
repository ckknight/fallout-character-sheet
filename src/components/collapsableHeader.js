import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import loadingIndicator from './loadingIndicator';
import errorHandler from './errorHandler';

export default function collapsableHeader(key, type, text, {DOM, value$: inputValue$, props$ = Rx.Observable.return(null)}) {
    const selector = `${type}.${key}`;

    const elements = DOM.select(selector);
    const value$ = elements
        .events('click')
        .map(() => o => !o)
        .merge(inputValue$.map(x => () => !!x))
        .startWith(false)
        .scan((acc, modifier) => modifier(acc))
        .distinctUntilChanged()
        .debounce(5)
        .shareReplay(1);

    const vtree$ = Rx.Observable.combineLatest(value$, props$,
        (value, props) => h(selector, props || {}, [text]));

    return {
        DOM: vtree$
            .startWith(loadingIndicator(key))
            .catch(errorHandler(key)),
        value$,
    };
}
