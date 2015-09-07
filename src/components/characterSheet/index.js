import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import race from './race';
import cosmetic from './cosmetic';
import primaryStatisticChart from './primaryStatisticChart';
import secondaryStatisticChart from './secondaryStatisticChart';
import skills from './skills';
import traits from './traits';
import combineLatestObject from '../../combineLatestObject';
import Condition from '../../models/Condition';
import Calculations from './Calculations';
import requestAnimationFrameScheduler from '../../requestAnimationFrameScheduler';
import { MISCELLANEOUS } from '../../constants.json';

function safeParseJSON(value) {
    try {
        return JSON.parse(value) || {};
    } catch (e) {
        return {};
    }
}

function coerceEmptyObject(obj) {
    for (let key in obj) {
        return obj;
    }
    return null;
}

function removeEmptyValues(obj) {
    if (Array.isArray(obj)) {
        return obj.length ? obj.map(removeEmptyValues) : null;
    } else if (obj && obj.constructor === Object) {
        return coerceEmptyObject(Object.keys(obj)
            .reduce((acc, key) => {
                const value = removeEmptyValues(obj[key]);
                if (value) {
                    acc[key] = value;
                }
                return acc;
            }, {}));
    } else {
        return obj || null;
    }
}

export default function characterSheet({DOM, localStorageSource}) {
    const calculations = new Calculations();
    Condition.all()
        .forEach(condition => calculations.set(condition.key, Rx.Observable.return(false)));
    Object.keys(MISCELLANEOUS)
        .forEach(key => calculations.set(key, Rx.Observable.return(0)));
    const deserializedSavedData$ = localStorageSource
        .map(safeParseJSON)
        .shareReplay(1);
    const raceView = race({
        DOM,
        value$: deserializedSavedData$
            .map(x => x.race || ''),
        calculations,
    });
    const cosmeticView = cosmetic({
        DOM,
        value$: deserializedSavedData$
            .map(x => x.cosmetic || {}),
        raceDOM: raceView.DOM,
        calculations,
    });
    const primaryStatisticView = primaryStatisticChart({
        DOM,
        value$: deserializedSavedData$.map(x => x.primary || {}),
        calculations,
    });
    const secondaryStatisticView = secondaryStatisticChart({
        DOM,
        value$: deserializedSavedData$.map(x => x.secondary || {}),
        calculations,
    });
    const skillsView = skills({
        DOM,
        value$: deserializedSavedData$.map(x => x.skills || {}),
        calculations,
    });
    const traitsView = traits({
        DOM,
        value$: deserializedSavedData$.map(x => x.traits || []),
        calculations,
    });
    calculations.set('effects', traitsView.effects$);
    return {
        DOM: combineLatestObject({
            cosmetic: cosmeticView.DOM.catch(Rx.Observable.return('-Error-')).startWith('-Cosmetic-'),
            primary: primaryStatisticView.DOM.catch(Rx.Observable.return('-Error-')).startWith('-Primary-'),
            secondary: secondaryStatisticView.DOM.catch(Rx.Observable.return('-Error-')).startWith('-Secondary-'),
            skills: skillsView.DOM.catch(Rx.Observable.return('-Error-')).startWith('-Skills-'),
            traits: traitsView.DOM.catch(Rx.Observable.return('-Error-')).startWith('-Traits-'),
        })
            .do(console.log.bind(console))
            .map(({cosmetic, primary, secondary, skills, traits}) => h('section.character-sheet-body', [cosmetic, primary, secondary, skills, traits]))
            .sample(0, requestAnimationFrameScheduler),
        localStorageSink: localStorageSource.first()
            .concat(combineLatestObject({
                race: raceView.value$,
                cosmetic: cosmeticView.value$.startWith({}),
                primary: primaryStatisticView.value$.startWith({}),
                secondary: secondaryStatisticView.value$.startWith({}),
                skills: skillsView.value$,
                traits: traitsView.value$,
            })
                .throttle(200)
                .map(removeEmptyValues)
                .map(JSON.stringify.bind(JSON)))
            .distinctUntilChanged()
            .skip(1),
    };
}
