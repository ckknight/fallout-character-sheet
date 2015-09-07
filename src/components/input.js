import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';

const typeToEvents = {
    text: {
        keyup: 0,
        input: 0,
        change: 0,
    },
    textarea: {
        keyup: 0,
        input: 0,
        change: 0,
    },
    number: {
        keyup: 0,
        input: 0,
        change: 0,
    },
    checkbox: {
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
    if (!time) {
        return identity;
    }
    return event$ => event$.debounce(time);
}

function eventsByType(DOM, type) {
    const events = typeToEvents[type];
    return Rx.Observable.from(Object.keys(events))
        .flatMap(event => DOM.events(event)
                .let(maybeDebounce(events[event])));
}

function calculateProps(key, type, value, props) {
    switch (type) {
        case 'checkbox':
            return Object.assign({
                key,
                type,
                value: key,
                checked: value,
            }, props || {});
        case 'textarea':
            return Object.assign({
                key,
                value,
            }, props || {});
        default:
            return Object.assign({
                key,
                type,
                value,
            }, props || {});
    }
}

function getValueByType(type) {
    if (type === 'checkbox') {
        return ev => ev.target.checked;
    } else {
        return ev => ev.target.value;
    }
}

export default function input(key, type, {DOM, value$: inputValue$, props$ = Rx.Observable.return(null)}) {
    const tag = type === 'textarea' ? type : 'input';
    const selector = `${tag}.${key}`;

    const newValue$ = eventsByType(DOM.select(selector), type)
        .map(getValueByType(type))
        .map(typeToConverter[type] || identity);

    const value$ = inputValue$
        .merge(newValue$);

    props$ = props$.shareReplay(1);
    const boundValue$ = Rx.Observable.combineLatest(value$, props$,
        (value, props) => {
            if (!props) {
                return value;
            }
            if ('min' in props && value < props.min) {
                return props.min;
            }
            if ('max' in props && value > props.max) {
                return props.max;
            }
            return value;
        })
        .distinctUntilChanged()
        .shareReplay(1);

    const vtree$ = Rx.Observable.combineLatest(boundValue$, props$,
        (value, props) => h(
                selector,
                calculateProps(key, type, value, props)));

    return {
        DOM: vtree$,
        value$: boundValue$,
    };
}
