import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import SecondaryStatistic from '../../models/SecondaryStatistic';
import algorithm from './algorithm';
import renderRef from './renderRef';
import { replace as equationReplace } from '../../models/Equation';
import Effect from '../../models/Effect';

function makeInput(key, type, defaultValue, DOM, value$, props$) {
    return input(key, type, {
        DOM,
        value$: value$.map(value => value[key] || defaultValue).startWith(defaultValue),
        props$,
    });
}

function toExtrema(range) {
    return {
        min: range.min,
        max: range.max,
    };
}

function applyEffects(equation, effects$) {
    return effects$
        .startWith(null)
        .map(effects => {
            return equation;
        });
}

function secondaryStatisticEntry(stat, {DOM, value$, calculations}) {
    const valueView = algorithm({
        equation$: calculations.get('effect')
            .startWith(new Effect())
            .map(x => x[stat.key])
            .map(x => equationReplace(x, 'value', stat.value)),
        calculations,
    });
    calculations.set(stat.key, valueView.value$.startWith(0));

    return {
        DOM: Rx.Observable.combineLatest(valueView.DOM, valueView.value$.startWith('poo'),
            (vTree, value) => h(`div.secondary-statistic.secondary-statistic-${stat.key}` + (stat.percent ? '.secondary-statistic-percent' : ''), {
                    key: stat.key,
                }, [
                    renderRef(stat.key, 'stat-label'),
                    h(`span.stat-value`, [value]),
                    vTree,
                ])),
        value$: valueView.value$,
    };
}

export default function secondaryStatisticChart({DOM, value$, calculations}) {
    const statistics = SecondaryStatistic.all()
        .toArray();
    const statisticEntries = statistics
        .map(stat => secondaryStatisticEntry(stat, {
                DOM,
                value$,
                calculations,
            }));

    return {
        DOM: Rx.Observable.combineLatest(statisticEntries.map(a => a.DOM))
            .map(inputVTrees => h('section.secondary', {
                    key: 'secondary',
                }, inputVTrees)),
        value$: combineLatestObject(statistics.reduce((acc, stat, i) => {
            acc[stat.key] = statisticEntries[i].value$;
            return acc;
        }, {})).share(),
    };
}
