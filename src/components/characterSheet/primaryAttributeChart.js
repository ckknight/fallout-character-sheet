import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import { RACE_STATS, PRIMARY_ATTRIBUTES } from '../../constants.json';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue),
        props$,
    });
}

function primaryAttribute(attribute, {DOM, value$, racePrimary$}) {
    const raceExtrema$ = racePrimary$
        .map(primary => primary[attribute] || [1, 10])
        .map(([min, max]) => ({
                min,
                max,
        }))
        .share();
    const input = makeInput(attribute, 'number', 5, DOM, value$, raceExtrema$);
    const extremaVTree$ = raceExtrema$
        .map(({min, max}) => h('span', [min, '/', max]));

    return {
        DOM: combineLatestObject({
            input: input.DOM,
            extrema: extremaVTree$,
        })
            .map(({input, extrema}) => h(`div.${attribute}-attribute`, [attribute, input, extrema])),
        value$: input.value$,
    };
}

export default function primaryAttributeChart({DOM, value$, race$}) {
    const racePrimary$ = race$
        .map(race => RACE_STATS[race || 'human'] || {})
        .map(raceStats => raceStats.primary || {})
        .share();

    const attributes = PRIMARY_ATTRIBUTES
        .map(attribute => primaryAttribute(attribute, {
                DOM,
                value$,
                racePrimary$,
            }));

    const sum$ = Rx.Observable.combineLatest(attributes.map(a => a.value$))
        .map(values => values.reduce((x, y) => x + y, 0));

    const primaryTotal$ = racePrimary$
        .map(primary => primary.total || 40);

    const summaryVTree$ = Rx.Observable.combineLatest(sum$, primaryTotal$, (sum, primaryTotal) => {
        return h('span', {
            className: sum === primaryTotal ? 'same-total' : '',
        }, [sum, '/', primaryTotal]);
    });

    return {
        DOM: Rx.Observable.combineLatest(attributes.map(a => a.DOM).concat([summaryVTree$]))
            .map(inputVTrees => h('div.primary', inputVTrees)),
        value$: combineLatestObject(PRIMARY_ATTRIBUTES.reduce((acc, attribute, i) => {
            acc[attribute] = attributes[i].value$;
            return acc;
        }, {})).share(),
    };
}
