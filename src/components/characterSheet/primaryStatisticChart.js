import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import combineLatestObject from '../../combineLatestObject';
import PrimaryStatistic from '../../models/PrimaryStatistic';

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
        .map(({min, max}) => h('span.stat-extrema', [min, '/', max]));
    calculations.set(stat.key, inputView.value$);

    return {
        DOM: combineLatestObject({
            input: inputView.DOM,
            extrema: extremaVTree$,
        })
            .map(({input, extrema}) => h(`div.primary-statistic.primary-statistic-${stat.key}`, [
                    h(`abbr.stat-label`, {
                        title: stat.name,
                    }, [stat.abbr]),
                    input,
                    extrema,
                ])),
        value$: inputView.value$,
    };
}

export default function primaryStatisticChart({DOM, value$, calculations}) {
    const statistics = PrimaryStatistic.all()
        .toArray();
    const statisticEntries = statistics
        .map(stat => primaryStatisticEntry(stat, {
                DOM,
                value$,
                calculations,
            }));

    const sum$ = Rx.Observable.combineLatest(statisticEntries.map(a => a.value$))
        .map(values => values.reduce((x, y) => x + y, 0));

    const primaryTotal$ = calculations.get('race')
        .pluck('primaryTotal');

    const summaryVTree$ = Rx.Observable.combineLatest(sum$, primaryTotal$, (sum, primaryTotal) => {
        return h('div', {
            className: 'primary-total ' + (sum === primaryTotal ? 'primary-total--same' : ''),
        }, [sum, '/', primaryTotal]);
    });

    return {
        DOM: Rx.Observable.combineLatest(statisticEntries.map(a => a.DOM).concat([summaryVTree$]))
            .map(inputVTrees => h('section.primary', inputVTrees)),
        value$: combineLatestObject(statistics.reduce((acc, stat, i) => {
            acc[stat.key] = statisticEntries[i].value$;
            return acc;
        }, {})).share(),
    };
}
