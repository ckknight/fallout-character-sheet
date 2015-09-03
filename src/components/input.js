import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';

const typeToEvents = {
    text: {
        keyup: 0,
        input: 0,
        change: 0,
    },
    number: {
        keyup: 0,
        input: 0,
        change: 0,
    },
};

const typeToConverter = {
    number: Number,
};

function identity(x) {
    return x;
}

function maybeDebounce(time) {
    if (time) {
        return event$ => event$.debounce(time);
    } else {
        return event$ => event$;
    }
}

function eventsByType(DOM, type) {
    const events = typeToEvents[type];
    return Rx.Observable.from(Object.keys(events))
        .flatMap(event => DOM.events(event)
                .let(maybeDebounce(events[event])));
}

export default function input(key, type, {DOM, value$: inputValue$, props$ = Rx.Observable.return(null)}) {
    const selector = `input.${key}`;

    const newValue$ = eventsByType(DOM.select(selector), type)
        .map(ev => ev.target.value)
        .map(typeToConverter[type] || identity);

    const value$ = inputValue$
        .merge(newValue$)
        .distinctUntilChanged()
        .shareReplay(1);

    const vtree$ = Rx.Observable.combineLatest(value$, props$,
        (value, props) => h(
                selector,
                Object.assign({
                    key,
                    type,
                    value,
                }, props || {})));

    return {
        DOM: vtree$,
        value$,
    };
}
