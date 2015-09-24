import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import combineLatestObject from '../../combineLatestObject';
import MiscellaneousStatistic from '../../models/MiscellaneousStatistic';
import algorithm from '../algorithm';
import renderRef from './renderRef';
import loadingIndicator from '../loadingIndicator';
import errorHandler from '../errorHandler';
import collapsableBox from '../collapsableBox';
import { Input } from '../../models/Equation/operations';
import input from '../input';
import button from '../button';
import InjectableObservable from 'rx-injectable-observable';
// import future from '../../future';

function miscellaneousStatisticEntry(stat, {DOM, value$: inputValue$, calculations, effecter}) {
    let vTree$;
    let value$;
    let equation$;
    let calculate;
    let savedValue = false;
    if (stat.value instanceof Input) {
        savedValue = true;
        const spec = stat.value;
        const min$ = algorithm({
            equation$: Rx.Observable.return(spec.min),
            calculations,
        }).value$;
        const max$ = algorithm({
            equation$: Rx.Observable.return(spec.max),
            calculations,
        }).value$;
        const step$ = algorithm({
            equation$: Rx.Observable.return(spec.step),
            calculations,
        }).value$;
        const initial$ = algorithm({
            equation$: Rx.Observable.return(spec.initial),
            calculations,
        }).value$;
        const inputView = input(stat.key, 'number', {
            DOM,
            value$: inputValue$
                .map(x => x[stat.key])
                .first()
                .flatMap(loadedValue => {
                    if (typeof loadedValue !== 'number') {
                        return initial$.first();
                    }
                    return Rx.Observable.return(loadedValue);
                }),
            props$: Rx.Observable.combineLatest(
                min$,
                max$,
                step$,
                (min, max, step) => ({
                    min,
                    max,
                    step,
                })),
        });
        calculations.set(stat.key, inputView.value$.startWith(0));
        value$ = inputView.value$;
        vTree$ = inputView.DOM;
    } else {
        let equation;
        if (stat.key === 'levelsPerPerk' || stat.key === 'primaryTotal') {
            equation = calculations.get('race')
                .map(race => race[stat.key]);
        } else {
            equation = Rx.Observable.return(stat.value || 0);
        }
        const valueView = algorithm({
            equation$: effecter(equation, stat.key),
            calculations,
        });
        calculations.set(stat.key, valueView.value$.startWith(0));
        value$ = valueView.value$;
        vTree$ = valueView.DOM;
        equation$ = valueView.equation$;
        calculate = valueView.calculate;
    }

    let calculateButtonVTree$ = Rx.Observable.return(null);
    if (calculate) {
        const calculateClick$ = new InjectableObservable();
        const calculateButtonView = button(`${stat.key}-calculate`, {
            DOM,
            vTree$: calculateClick$
                .flatMapLatest(calculate)
                .map(value => `Roll! ${value}`)
                .startWith('Roll!'),
            props$: Rx.Observable.return({}),
        });
        calculateClick$.inject(calculateButtonView.value$);
        calculateButtonVTree$ = calculateButtonView.DOM;
    }

    return {
        DOM: Rx.Observable.combineLatest(vTree$, calculateButtonVTree$, value$.startWith(null), equation$ || Rx.Observable.return(null),
            (vTree, calculateButton, value, equation) => h(`div.miscellaneous-statistic.miscellaneous-statistic-${stat.key}` + (stat.percent ? '.miscellaneous-statistic-percent' : ''), {
                    key: stat.key,
                }, [
                    h(`span.stat-label.ref-${stat.key}`, [stat.name]),
                    value != null && !Number.isNaN(value) && !savedValue ? h(`span.stat-value`, ['' + value]) : null,
                    typeof equation !== 'number' ? vTree : null,
                    Number.isNaN(value) ? calculateButton : null,
                ]))
            .startWith(loadingIndicator(stat.key))
            .catch(errorHandler(stat.key)),
        smallDOM: value$.startWith(null)
            .map(value => h(`div.miscellaneous-statistic.miscellaneous-statistic-${stat.key}` + (stat.percent ? '.miscellaneous-statistic-percent' : ''), {
                    key: stat.key,
                }, [
                    renderRef(stat.key, 'stat-label'),
                    value != null ? h(`span.stat-value`, [value]) : null,
                ]))
            .startWith(loadingIndicator(stat.key))
            .catch(errorHandler(stat.key)),
        value$: savedValue ? value$ : null,
    };
}

function cmp(x, y) {
    if (x === y) {
        return 0;
    }
    if (x < y) {
        return -1;
    }
    return 1;
}

export default function miscellaneousStatisticChart({DOM, value$, uiState$, calculations, effecter}) {
    const statistics = MiscellaneousStatistic.all()
        .toArray()
        .sort((x, y) => cmp(x.order, y.order) || cmp(x.name, y.name));
    const statisticEntries = statistics
        .map(stat => miscellaneousStatisticEntry(stat, {
                DOM,
                value$,
                calculations,
                effecter,
            }));

    const uncollapsedBody$ = Rx.Observable.combineLatest(
        statisticEntries.map(a => a.DOM));

    // const collapsedBody$ = Rx.Observable.combineLatest(
    //     statisticEntries.map(a => a.smallDOM));

    const boxView = collapsableBox('miscellaneous', 'Miscellaneous Statistics', {
        DOM,
        value$: uiState$,
        collapsedBody$: uncollapsedBody$,
        uncollapsedBody$,
    });

    return {
        DOM: boxView.DOM,
        value$: combineLatestObject(statistics.reduce((acc, stat, i) => {
            const statValue$ = statisticEntries[i].value$;
            if (statValue$) {
                acc[stat.key] = statValue$;
            }
            return acc;
        }, {}), null)
            .shareReplay(1),
        uiState$: boxView.value$,
    };
}

// export default future.wrap(miscellaneousStatisticChart, 'DOM', 'value$', 'uiState$');
