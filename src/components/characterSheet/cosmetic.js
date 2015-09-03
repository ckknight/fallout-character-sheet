import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import select from '../select';
import combineLatestObject from '../../combineLatestObject';
import { RACE_STATS } from '../../constants.json';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue),
        props$: props$ || Rx.Observable.return({
                placeholder: key,
            }),
    });
}

function makeBox(selector, object, extra) {
    return Object.assign({
        DOM: Rx.Observable.combineLatest(Object.keys(object)
            .map(key => object[key].DOM))
            .map(vTrees => h(selector, vTrees)),
        value$: combineLatestObject(Object.keys(object)
            .reduce((acc, key) => {
                acc[key] = object[key].value$;
                return acc;
            }, {})),
    }, extra || {});
}

export default function cosmetic({DOM, value$}) {
    const raceSelect = select('race', {
        DOM,
        value$: value$.map(value => value.race || ''),
        options$: Rx.Observable.return(Object.keys(RACE_STATS).map(race => ({
                value: race,
                text: race,
        }))),
        props$: Rx.Observable.return({
            fallback: '\u2014 Race \u2014',
        }),
    });
    const race$ = raceSelect.value$;

    return makeBox('div.cosmetic', {
        name: makeInput('name', 'text', '', DOM, value$),
        age: makeInput('age', 'number', 20, DOM, value$, Rx.Observable.return({
            min: 0,
            placeholder: 'Age',
        })),
        sex: makeInput('sex', 'text', '', DOM, value$),
        race: raceSelect,
        weight: makeInput('weight', 'number', 150, DOM, value$, race$
            .map(race => RACE_STATS[race || 'human'] || {})
            .map(raceStats => raceStats.weight || [100, 400])
            .map(([min, max]) => ({
                    min,
                    max,
                    placeholder: 'Weight',
            }))),
        height: makeInput('height', 'number', 1.8, DOM, value$, race$
            .map(race => RACE_STATS[race || 'human'] || {})
            .map(raceStats => raceStats.height || [1, 3])
            .map(([min, max]) => ({
                    min,
                    max,
                    step: 0.01,
                    placeholder: 'Height',
            }))),
        eyes: makeInput('eyes', 'text', '', DOM, value$),
        hair: makeInput('hair', 'text', '', DOM, value$),
        appearance: makeInput('appearance', 'text', '', DOM, value$),
    }, {
        race$,
    });
}
