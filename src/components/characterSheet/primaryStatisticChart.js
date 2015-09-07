import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import PrimaryStatistic from '../../models/PrimaryStatistic';
import { replace as equationReplace } from '../../models/Equation';
import algorithm from './algorithm';
import renderNumber from './renderNumber';

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
        .map(({min, max}) => h('span.stat-extrema', {
                key: 'extrema',
            }, [renderNumber(min, 'value'), '/', renderNumber(max, 'value')]));
    const statEffect$ = calculations.get('effect')
        .pluck(stat.key);
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
            effectedValue: effectedValue$,
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
                    renderNumber(effectedValue - inputValue, 'diff', {
                        className: 'stat-effect',
                    }),
                    renderNumber(effectedValue, 'value', {
                        className: 'stat-total',
                    }),
                ]);
            }),
        value$: inputView.value$,
        effectedValue$,
    };
}

export default function primaryStatisticChart({DOM, value$, calculations}) {
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
        .map(values => values.reduce((x, y) => x + y, 0));

    const primaryTotal$ = calculations.get('race')
        .pluck('primaryTotal');

    const summaryVTree$ = Rx.Observable.combineLatest(sum$, primaryTotal$, (sum, primaryTotal) => {
        return h('div', {
            className: 'primary-total ' + (sum === primaryTotal ? 'primary-total--same' : ''),
            key: 'primaryTotal',
        }, [sum, '/', primaryTotal]);
    });

    return {
        DOM: Rx.Observable.combineLatest(statisticEntries.map(a => a.DOM).concat([summaryVTree$]))
            .map(inputVTrees => h('section.primary', {
                    key: 'primary',
                }, inputVTrees)),
        value$: combineLatestObject(statistics.reduce((acc, stat, i) => {
            acc[stat.key] = statisticEntries[i].value$;
            return acc;
        }, {})).share(),
    };
}
