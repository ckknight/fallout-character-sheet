import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import PrimaryStatistic from '../../models/PrimaryStatistic';
import { replace as equationReplace } from '../../models/Equation';
import algorithm from './algorithm';
import renderNumber from './renderNumber';
import renderLoading from './renderLoading';
import renderError from './renderError';
import collapsableBox from '../collapsableBox';
import remember from './remember';

function toExtrema(range) {
    return {
        min: range.min,
        max: range.max,
    };
}

function primaryStatisticEntry(stat, {DOM, value$, calculations}) {
    const raceExtrema$ = calculations.get('race')
        .pluck(stat.key);
    const inputView = input(stat.key, 'number', {
        DOM,
        value$: value$.map(value => value[stat.key] || 5).startWith(5),
        props$: raceExtrema$
            .map(({min, max}) => ({
                    min,
                    max,
                    className: 'stat-input',
            })),
    });
    const extremaVTree$ = raceExtrema$
        .startWith(renderLoading('extrema'))
        .map(({min, max}) => h('span.stat-extrema', {
                key: 'extrema',
            }, [renderNumber(min, 'value'), '/', renderNumber(max, 'value')]))
        .catch(renderError.handler('extrema'));
    const statEffect$ = calculations.get('effect')
        .map(e => e[stat.key] || 'value');
    const effectedValue$ = raceExtrema$.combineLatest(algorithm({
        equation$: inputView.value$.combineLatest(statEffect$,
            (value, effect) => equationReplace(effect, 'value', value)),
        calculations,
    }).value$,
        ({min, max} , value) => Math.min(max, Math.min(max, value)))
        .distinctUntilChanged()
        .shareReplay(1);
    return {
        DOM: combineLatestObject({
            input: inputView.DOM,
            extrema: extremaVTree$,
            inputValue: inputView.value$,
            effectedValue: effectedValue$.startWith(null),
        })
            .map(({input, extrema, inputValue, effectedValue}) => {
                return h(`div.primary-statistic.primary-statistic-${stat.key}`, {
                    key: stat.key,
                }, [
                    h(`abbr.stat-label`, {
                        title: stat.name,
                    }, [stat.abbr]),
                    input,
                    extrema,
                    effectedValue != null ? renderNumber(effectedValue - inputValue, 'diff', {
                        className: 'stat-effect',
                    }) : null,
                    effectedValue != null ? renderNumber(effectedValue, 'value', {
                        className: 'stat-total',
                    }) : null,
                ]);
            })
            .startWith(renderLoading(stat.key))
            .catch(renderError.handler(stat.key)),
        smallDOM: effectedValue$.startWith(null)
            .map(effectedValue => h(`div.primary-statistic-summary.primary-statistic-summary-${stat.key}`, {
                    key: stat.key,
                    title: stat.name + ' = ' + effectedValue,
                }, [
                    h(`abbr.stat-label`, [stat.abbr.charAt(0)]),
                    effectedValue != null ? renderNumber(effectedValue, 'value', {
                        className: 'stat-total',
                    }) : null,
                ])),
        value$: inputView.value$,
        effectedValue$,
    };
}

export default function primaryStatisticChart({DOM, value$, uiState$, calculations}) {
    const statistics = PrimaryStatistic.all()
        .toArray();
    const statisticEntries = statistics
        .map(stat => {
            const entry = primaryStatisticEntry(stat, {
                DOM,
                value$,
                calculations,
            });
            calculations.set(stat.key, entry.effectedValue$);
            return entry;
        });

    const sum$ = Rx.Observable.combineLatest(statisticEntries.map(a => a.value$))
        .map(values => values.reduce((x, y) => x + y, 0))
        .startWith(0);

    const primaryTotal$ = calculations.get('race')
        .pluck('primaryTotal')
        .startWith(40);

    const summaryVTree$ = Rx.Observable.combineLatest(sum$, primaryTotal$, (sum, primaryTotal) => {
        return h('div', {
            className: 'primary-total ' + (sum === primaryTotal ? 'primary-total--same' : ''),
            key: 'primaryTotal',
        }, [sum, '/', primaryTotal]);
    }).catch(renderError.handler('primary-total'));

    const uncollapsedBody$ = Rx.Observable.combineLatest(statisticEntries.map(a => a.DOM).concat([summaryVTree$]));

    const collapsedBody$ = Rx.Observable.combineLatest(statisticEntries.map(a => a.smallDOM));

    const boxView = collapsableBox('primary', 'Primary Statistics', {
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
