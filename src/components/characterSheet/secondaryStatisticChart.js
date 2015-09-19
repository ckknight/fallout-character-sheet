import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import SecondaryStatistic from '../../models/SecondaryStatistic';
import algorithm from '../algorithm';
import renderRef from './renderRef';
import { replace as equationReplace } from '../../models/Equation';
import Effect from '../../models/Effect';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import collapsableBox from '../collapsableBox';
import future from '../../future';

function secondaryStatisticEntry(stat, {DOM, value$, calculations, effecter}) {
    const valueView = algorithm({
        equation$: effecter(Rx.Observable.return(stat.value), stat.key),
        calculations,
    });
    calculations.set(stat.key, valueView.value$.startWith(0));

    return {
        DOM: Rx.Observable.combineLatest(valueView.DOM, valueView.value$.startWith(null),
            (vTree, value) => h(`div.secondary-statistic.secondary-statistic-${stat.key}` + (stat.percent ? '.secondary-statistic-percent' : ''), {
                    key: stat.key,
                }, [
                    renderRef(stat.key, 'stat-label'),
                    value != null ? h(`span.stat-value`, ['' + value]) : null,
                    vTree,
                ]))
            .startWith(loadingIndicator(stat.key))
            .catch(errorHandler(stat.key)),
        smallDOM: valueView.value$.startWith(null)
            .map(value => h(`div.secondary-statistic.secondary-statistic-${stat.key}` + (stat.percent ? '.secondary-statistic-percent' : ''), {
                    key: stat.key,
                }, [
                    renderRef(stat.key, 'stat-label'),
                    value != null ? h(`span.stat-value`, [value]) : null,
                ]))
            .startWith(loadingIndicator(stat.key))
            .catch(errorHandler(stat.key)),
        value$: valueView.value$,
    };
}

function secondaryStatisticChart({DOM, value$, uiState$, calculations, effecter}) {
    const statistics = SecondaryStatistic.all()
        .toArray();
    const statisticEntries = statistics
        .map(stat => secondaryStatisticEntry(stat, {
                DOM,
                value$,
                calculations,
                effecter,
            }));

    const uncollapsedBody$ = Rx.Observable.combineLatest(
        statisticEntries.map(a => a.DOM));

    const collapsedBody$ = Rx.Observable.combineLatest(
        statisticEntries.map(a => a.smallDOM));

    const boxView = collapsableBox('secondary', 'Secondary Statistics', {
        DOM,
        value$: uiState$,
        collapsedBody$,
        uncollapsedBody$,
    });

    return {
        DOM: boxView.DOM,
        value$: combineLatestObject(statistics.reduce((acc, stat, i) => {
            acc[stat.key] = statisticEntries[i].value$;
            return acc;
        }, {}))
            .shareReplay(1),
        uiState$: boxView.value$,
    };
}

export default future.wrap(secondaryStatisticChart, 'DOM', 'value$', 'uiState$');
