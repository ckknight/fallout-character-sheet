import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import loadingIndicator from './loadingIndicator';
import errorHandler from './errorHandler';
import makeUid from '../utils/makeUid';
import addIdToProps from '../utils/addIdToProps';

export default function collapsableHeader(key, type, text, {DOM, value$: inputValue$, props$ = Rx.Observable.return(null)}) {
    const id = `${key}-${makeUid()}`;

    const value$ = DOM.select(`.${id}`)
        .events('click')
        .map(() => o => !o)
        .merge(inputValue$.map(x => () => !!x))
        .startWith(false)
        .scan((acc, modifier) => modifier(acc))
        .distinctUntilChanged()
        .debounce(5)
        .shareReplay(1);

    const vtree$ = Rx.Observable.combineLatest(value$, props$,
        (value, props) => h(`${type}.${key}`, addIdToProps(id, props), [text]));

    return {
        DOM: vtree$
            .startWith(loadingIndicator(key))
            .catch(errorHandler(key)),
        value$,
    };
}
