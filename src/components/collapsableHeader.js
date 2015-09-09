import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import renderLoading from './characterSheet/renderLoading';
import renderError from './characterSheet/renderError';

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
    integer: {
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
                .let(maybeDebounce(events[event] || 5)));
}

const typeToCalculateProps = {
    checkbox(key, value, props) {
        return Object.assign({
            key,
            type: 'checkbox',
            value: key,
            checked: value,
        }, props);
    },
    textarea(key, value, props) {
        return Object.assign({
            key,
            value,
        }, props);
    },
    integer(key, value, props) {
        return Object.assign({
            key,
            type: 'number',
            value,
            pattern: '[0-9]*',
            inputmode: 'numeric',
        }, props);
    },
    number(key, value, props) {
        return Object.assign({
            key,
            type: 'number',
            value,
            pattern: '[0-9]*(?:\.[0-9]*)?',
            inputmode: 'numeric',
        }, props);
    },
    text(key, value, props, type) {
        return Object.assign({
            key,
            type,
            value,
        }, props);
    },
};

function calculateProps(key, type, value, props) {
    return (typeToCalculateProps[type] || typeToCalculateProps.text)(key, value, props || {}, type);
}

function getValueByType(type) {
    if (type === 'checkbox') {
        return ev => ev.target.checked;
    } else {
        return ev => ev.target.value;
    }
}

export default function input(key, type, text, {DOM, value$: inputValue$, props$ = Rx.Observable.return(null)}) {
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
            .startWith(renderLoading(key))
            .catch(renderError.handler(key)),
        value$,
    };
}
