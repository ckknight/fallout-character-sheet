import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import input from '../input';
import selectRange from '../selectRange';
import selectRangeOrInput from '../selectRangeOrInput';
import combineLatestObject from '../../combineLatestObject';
import PrimaryStatistic from '../../models/PrimaryStatistic';
// import equationReplace from '../../models/Equation/replace';
import algorithm from '../algorithm';
import renderNumber from '../algorithm/number/render';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import collapsableBox from '../collapsableBox';
// import future from '../../future';

function makeInputView(useSelect, key, DOM, superValue$, raceExtrema$) {
    return selectRangeOrInput(key, {
        DOM,
        value$: superValue$.map(value => value[key] || 5).startWith(5),
        min$: raceExtrema$.pluck('min'),
        max$: raceExtrema$.pluck('max'),
        props$: Rx.Observable.return({
            className: 'stat-select',
        }),
    });
}

function primaryStatisticEntry(stat, {DOM, value$, calculations, effecter}) {
    const raceExtrema$ = calculations.get('race')
        .pluck(stat.key);
    const inputView = makeInputView(true, stat.key, DOM, value$, raceExtrema$);
    const extremaVTree$ = raceExtrema$
        .startWith(loadingIndicator('extrema'))
        .map(({min, max}) => h('span.stat-extrema', {
                key: 'extrema',
            }, [renderNumber(min, 'value'), '/', renderNumber(max, 'value')]))
        .catch(errorHandler('extrema'));

    const inputValue$ = inputView.value$
        // .filter(x => x != null)
        .shareReplay(1);

    const effectedValue$ = Rx.Observable.combineLatest(
        algorithm({
            equation$: effecter(inputValue$, stat.key),
            calculations,
        }).value$,
        raceExtrema$,
        (value, {min, max}) => Math.min(max, Math.max(min, value)))
        .distinctUntilChanged()
        .shareReplay(1);
    return {
        DOM: Rx.Observable.combineLatest(
            inputView.DOM,
            extremaVTree$,
            inputValue$,
            effectedValue$.startWith(null),
            (inputVTree, extremaVTree, inputValue, effectedValue) => {
                return h(`div.primary-statistic.primary-statistic-${stat.key}`, {
                    key: stat.key,
                }, h(`.primary-statistic-body`, [
                    h('span.stat-name', [stat.name]),
                    inputVTree,
                    extremaVTree,
                    effectedValue != null ? renderNumber(effectedValue - inputValue, 'diff', {
                        className: 'stat-effect',
                    }) : null,
                    effectedValue != null ? renderNumber(effectedValue, 'value', {
                        className: 'stat-total',
                    }) : null,
                    h('p.stat-desc', [stat.description]),
                ]));
            })
            .startWith(loadingIndicator(stat.key))
            .catch(errorHandler(stat.key)),
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
        value$: inputValue$,
        effectedValue$,
    };
}

export default function primaryStatisticChart({DOM, value$, uiState$, calculations, effecter}) {
    const statistics = PrimaryStatistic.all()
        .toArray();
    const statisticEntries = statistics
        .map(stat => {
            const entry = primaryStatisticEntry(stat, {
                DOM,
                value$,
                calculations,
                effecter,
            });
            calculations.set(stat.key, entry.effectedValue$);
            return entry;
        });

    const sum$ = Rx.Observable.combineLatest(statisticEntries.map(a => a.value$))
        .map(values => values.reduce((x, y) => x + y, 0))
        .startWith(0);

    const primaryTotal$ = algorithm({
        equation$: effecter(calculations.get('race')
            .pluck('primaryTotal')
            .startWith(40), 'primaryTotal'),
        calculations,
    }).value$;

    const summaryVTree$ = Rx.Observable.combineLatest(sum$, primaryTotal$, (sum, primaryTotal) => {
        return h('div', {
            className: 'primary-total ' + (sum === primaryTotal ? 'primary-total--same' : ''),
            key: 'primaryTotal',
        }, [sum, '/', primaryTotal]);
    }).catch(errorHandler('primary-total'));

    const uncollapsedBody$ = Rx.Observable.combineLatest([].concat(
        statisticEntries
            .map(a => a.DOM),
        [summaryVTree$]));

    const collapsedBody$ = Rx.Observable.combineLatest(
        statisticEntries
            .map(a => a.smallDOM));

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

// export default future.wrap(primaryStatisticChart, 'DOM', 'value$', 'uiState$');
