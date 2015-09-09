import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import SecondaryStatistic from '../../models/SecondaryStatistic';
import algorithm from './algorithm';
import renderRef from './renderRef';
import { replace as equationReplace } from '../../models/Equation';
import Effect from '../../models/Effect';
import renderLoading from './renderLoading';
import renderError from './renderError';

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
        DOM: Rx.Observable.combineLatest(valueView.DOM, valueView.value$.startWith(null),
            (vTree, value) => h(`div.secondary-statistic.secondary-statistic-${stat.key}` + (stat.percent ? '.secondary-statistic-percent' : ''), {
                    key: stat.key,
                }, [
                    renderRef(stat.key, 'stat-label'),
                    value != null ? h(`span.stat-value`, [value]) : null,
                    vTree,
                ]))
            .startWith(renderLoading(stat.key))
            .catch(renderError.handler(stat.key)),
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
            .startWith([renderLoading('secondary')])
            .map(inputVTrees => h('section.secondary', {
                    key: 'secondary',
                }, [
                    h('h2.secondary-title', ['Secondary Statistics']),
                ].concat(inputVTrees)))
            .catch(renderError.handler('secondary')),
        value$: combineLatestObject(statistics.reduce((acc, stat, i) => {
            acc[stat.key] = statisticEntries[i].value$;
            return acc;
        }, {}))
            .shareReplay(1),
    };
}
