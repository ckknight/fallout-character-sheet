import { Rx } from '@cycle/core';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import render from './render';
import '../../rx-pausable-buffered1';

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
    integer: x => Math.floor(x) || 0,
};

function identity(x) {
    return x;
}

function maybeDebounce(time, scheduler) {
    if (!time) {
        return identity;
    }
    return event$ => event$.debounce(time, scheduler);
}

function getValueByType(type) {
    if (type === 'checkbox') {
        return ev => ev.target.checked;
    }
    return ev => ev.target.value;
}

function eventsByType(DOM, type, scheduler) {
    const events = typeToEvents[type];
    return Rx.Observable.from(Object.keys(events))
        .flatMap(event => DOM.events(event)
                .let(maybeDebounce(events[event] || 5, scheduler)))
        .map(getValueByType(type));
}

export default function input(key, type, {DOM, value$: inputValue$, props$ = Rx.Observable.return(null), serialize = identity, deserialize = identity, scheduler}) {
    const elements = DOM.select(`.${key}`);
    const newValue$ = eventsByType(elements, type, scheduler)
        .let(o => typeToConverter[type] ? o.map(typeToConverter[type]) : o);

    const focus$ = elements.events('focus');
    const blur$ = elements.events('blur');

    const canChangeDOM$ = Rx.Observable.merge(
        focus$
            .map(() => false),
        blur$
            .map(() => true))
        .debounce(1, scheduler)
        .startWith(true)
        .distinctUntilChanged();

    const value$ = inputValue$
        .flatMapLatest(value => {
            const serialized = serialize(value);
            if (Rx.Observable.isObservable(serialized)) {
                return serialized;
            }
            return Rx.Observable.return(serialized);
        })
        .merge(newValue$);

    const sharedProps$ = props$.shareReplay(1);
    const boundValue$ = Rx.Observable.combineLatest(value$, sharedProps$,
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

    const vtree$ = Rx.Observable.combineLatest(boundValue$, sharedProps$,
        (value, props) => ({
                value,
                props,
        }))
        .distinctUntilChanged()
        .pausableBuffered1(canChangeDOM$)
        .map(({value, props}) => render(key, type, value, props));

    return {
        DOM: vtree$
            // .startWith(loadingIndicator(key))
            .catch(errorHandler(key)),
        value$: boundValue$
            .flatMapLatest(value => {
                const deserialized = deserialize(value);
                if (Rx.Observable.isObservable(deserialized)) {
                    return deserialized;
                }
                return Rx.Observable.return(deserialized);
            })
            .distinctUntilChanged()
            .shareReplay(1),
    };
}
