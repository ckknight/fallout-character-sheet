import { Rx } from '@cycle/core';
import select from '../select';
import Race from '../../models/Race';

export default function raceDialogue({DOM, value$, calculations}) {
    const raceSelect = select('race', {
        DOM,
        value$,
        options$: Rx.Observable.return(Race.all()
            .filter(race => race.playable)
            .map(race => ({
                    value: race.key,
                    text: race.name,
            }))),
        props$: Rx.Observable.return({
            fallback: '\u2014 Race \u2014',
            className: 'pure-u-23-24',
        }),
    });
    const race$ = raceSelect.value$;
    const model$ = race$
        .map(race => Race.getOrDefault(race))
        .startWith(new Race())
        .distinctUntilChanged()
        .shareReplay(1);

    calculations.set('race', model$);
    Race.all().forEach(race => calculations.set(race.key, Rx.Observable.return(race)));

    return {
        DOM: raceSelect.DOM,
        value$: race$,
    };
}
