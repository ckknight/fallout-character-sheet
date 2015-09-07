import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';

const FALLBACK_KEY = 'SELECT_FALLBACK';

function renderOptions(options, value, fallback) {
    let hasSelected = false;
    const optionsVTree = Array.from(options).map(({value: optionValue, text}) => {
        const selected = value === optionValue;
        hasSelected = hasSelected || selected;
        return h('option', {
            key: optionValue,
            value: optionValue,
            selected,
        }, [text]);
    });
    if (fallback && !hasSelected) {
        optionsVTree.unshift(h('option', {
            key: FALLBACK_KEY,
            selected: true,
        }, [fallback]));
    }
    return optionsVTree;
}

export default function select(key, {DOM, value$: inputValue$, options$, props$ = Rx.Observable.return(null)}) {
    inputValue$ = inputValue$.shareReplay(1);
    const selector = `select.${key}`;

    const newValue$ = DOM.select(selector)
        .events('change')
        .map(ev => ev.target.value);

    const value$ = inputValue$.first()
        .concat(inputValue$.skip(1).merge(newValue$))
        .distinctUntilChanged()
        .shareReplay(1);

    const vtree$ = Rx.Observable.combineLatest(options$, value$, props$,
        (options, value, props) => {
            return h(
                selector,
                Object.assign({
                    key,
                }, props, {
                    fallback: undefined,
                }),
                renderOptions(options, value, props.fallback));
        });

    return {
        DOM: vtree$,
        value$,
    };
}
