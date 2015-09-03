import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import select from '../select';
import combineLatestObject from '../../combineLatestObject';
import { RACE_STATS } from '../../constants';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue),
        props$: props$ || Rx.Observable.return({
                placeholder: key,
            }),
    });
}

export default function cosmetic({DOM, value$}) {
    const nameInput = makeInput('name', 'text', '', DOM, value$);
    const ageInput = makeInput('age', 'number', 20, DOM, value$, Rx.Observable.return({
        min: 0,
        placeholder: 'Age',
    }));
    const sexInput = makeInput('sex', 'text', '', DOM, value$);
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
    const weightInput = makeInput('weight', 'number', 150, DOM, value$, race$
        .map(race => RACE_STATS[race || 'human'] || {})
        .map(raceStats => raceStats.weight || [100, 400])
        .map(([min, max]) => ({
                min,
                max,
                placeholder: 'Weight',
        })));
    const heightInput = makeInput('height', 'number', 1.8, DOM, value$, race$
        .map(race => RACE_STATS[race || 'human'] || {})
        .map(raceStats => raceStats.height || [1, 3])
        .map(([min, max]) => ({
                min,
                max,
                step: 0.01,
                placeholder: 'Height',
        })));
    const eyesInput = makeInput('eyes', 'text', '', DOM, value$);
    const hairInput = makeInput('hair', 'text', '', DOM, value$);
    const appearanceInput = makeInput('appearance', 'text', '', DOM, value$);

    return {
        DOM: Rx.Observable.combineLatest([
            nameInput.DOM,
            ageInput.DOM,
            sexInput.DOM,
            raceSelect.DOM,
            weightInput.DOM,
            heightInput.DOM,
            eyesInput.DOM,
            hairInput.DOM,
            appearanceInput.DOM,
        ])
            .map((vTrees) => h('div.cosmetic', vTrees)),
        value$: combineLatestObject({
            name: nameInput.value$,
            age: ageInput.value$,
            sex: sexInput.value$,
            race: race$,
            weight: weightInput.value$,
            height: heightInput.value$,
            eyes: eyesInput.value$,
            hair: hairInput.value$,
            appearance: appearanceInput.value$,
        })
            .share(),
        race$: raceSelect.value$,
    };
}
