import { Rx } from '@cycle/core';
import { PRIMARY_ATTRIBUTES } from './constants';

function manyEvents(dom, ...eventTypes) {
    return Rx.Observable.from(eventTypes)
        .flatMap(eventType => dom.events(eventType));
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

export default function intent(DOM) {
    function inputValues(selector, debounceTime = 300) {
        return manyEvents(DOM.select(selector), 'change', 'keyup')
            .pluck('target')
            .pluck('value')
            .distinctUntilChanged()
            .debounce(debounceTime);
    }

    function click(selector, value) {
        return DOM.select(selector)
            .events('click')
            .map(() => value);
    }

    return {
        changeName$: inputValues('.name'),
        changeSex$: inputValues('.sex'),
        changeWeight$: inputValues('.weight'),
        changeAge$: inputValues('.age'),
        changeRace$: inputValues('.race', 0),

        primary: PRIMARY_ATTRIBUTES
            .reduce((acc, attribute) => {
                acc[`inc${capitalize(attribute)}$`] = click(`.${attribute} .inc`, 1);
                acc[`dec${capitalize(attribute)}$`] = click(`.${attribute} .dec`, -1);
                return acc;
            }, {}),
    };
}
