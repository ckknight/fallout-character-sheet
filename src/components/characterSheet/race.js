import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import select from '../select';
import Race from '../../models/Race';

export default function race({DOM, value$, calculations}) {
    const raceSelect = select('race', {
        DOM,
        value$,
        options$: Rx.Observable.return(Race.all().map(race => ({
                value: race.key,
                text: race.name,
        }))),
        props$: Rx.Observable.return({
            fallback: '\u2014 Race \u2014',
        }),
    });
    const race$ = raceSelect.value$;
    const model$ = race$
        .map(race => Race.getOrDefault(race))
        .distinctUntilChanged()
        .share();

    calculations.set('race', model$);
    Race.all().forEach(race => calculations.set(race.key, Rx.Observable.return(race)));

    return {
        DOM: raceSelect.DOM,
        value$: race$,
    };
}
