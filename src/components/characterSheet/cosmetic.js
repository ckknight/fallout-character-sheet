import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import select from '../select';
import combineLatestObject from '../../combineLatestObject';
import { RACE_STATS } from '../../constants.json';
import * as localize from '../../localize';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue).startWith(defaultValue),
        props$: props$ || Rx.Observable.return({
                placeholder: key,
            }),
    });
}

function makeBox(selector, object, calculations) {
    Object.entries(object)
        .filter(([key, value]) => value.value$)
        .forEach(([key, value]) => calculations.set(key, value.value$));
    return {
        DOM: Rx.Observable.combineLatest(Object.keys(object)
            .map(key => object[key].DOM.startWith(null)
                    .filter(x => x)
                    .map(vTree => h(`label.${key}-label`, {
                            key,
                        }, [localize.name(key), ' ', vTree]))))
            .map(vTrees => h(selector, vTrees)),
        value$: combineLatestObject(Object.keys(object)
            .reduce((acc, key) => {
                const value$ = object[key].value$;
                if (value$) {
                    acc[key] = value$;
                }
                return acc;
            }, {}))
            .share(),
    };
}

export default function cosmetic({DOM, value$, raceDOM, calculations}) {
    return makeBox('section.cosmetic', {
        name: makeInput('name', 'text', '', DOM, value$),
        age: makeInput('age', 'number', 20, DOM, value$, Rx.Observable.return({
            min: 0,
            placeholder: 'Age',
        })),
        sex: makeInput('sex', 'text', '', DOM, value$),
        race: {
            DOM: raceDOM,
        },
        weight: makeInput('weight', 'number', 150, DOM, value$, calculations.get('race')
            .pluck('weight')
            .map(({min, max}) => ({
                    min,
                    max,
                    placeholder: 'Weight',
            }))),
        height: makeInput('height', 'number', 1.8, DOM, value$, calculations.get('race')
            .pluck('height')
            .map(({min, max}) => ({
                    min,
                    max,
                    step: 0.01,
                    placeholder: 'Height',
            }))),
        eyes: makeInput('eyes', 'text', '', DOM, value$),
        hair: makeInput('hair', 'text', '', DOM, value$),
        appearance: makeInput('appearance', 'textarea', '', DOM, value$),
    }, calculations);
}
