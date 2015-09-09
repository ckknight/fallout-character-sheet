import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import race from './race';
import cosmetic from './cosmetic';
import primaryStatisticChart from './primaryStatisticChart';
import secondaryStatisticChart from './secondaryStatisticChart';
import skills from './skills';
import traits from './traits';
import perks from './perks';
import health from './health';
import combineLatestObject from '../../combineLatestObject';
import Condition from '../../models/Condition';
import Calculations from './Calculations';
import requestAnimationFrameScheduler from '../../requestAnimationFrameScheduler';
import { MISCELLANEOUS } from '../../constants.json';
import { replace as equationReplace } from '../../models/Equation';
import Immutable from 'immutable';
import Effect from '../../models/Effect';
import '../../sampleToRequestAnimationFrame';

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
            .sort()
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
    console.log('start', Date.now());
    const calculations = new Calculations();
    Condition.all()
        .forEach(condition => calculations.set(condition.key, Rx.Observable.return(false)));
    Object.keys(MISCELLANEOUS)
        .forEach(key => calculations.set(key, Rx.Observable.return(0)));
    const deserializedSavedData$ = localStorageSource
        .map(safeParseJSON)
        .shareReplay(1);
    const characterSavedData$ = deserializedSavedData$
        .map(x => x.character || {});

    calculations.set('effect', calculations.get('effects', true)
        .map(effects => effects
                .reduce((left, right) => left.mergeEffects(right), new Effect()))
        .startWith(new Effect())
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1));

    const raceView = race({
        DOM,
        value$: characterSavedData$
            .map(x => x.race || ''),
        calculations,
    });
    const cosmeticView = cosmetic({
        DOM,
        value$: characterSavedData$
            .map(x => x.cosmetic || {}),
        raceDOM: raceView.DOM,
        calculations,
    });
    const primaryStatisticView = primaryStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.primary || {}),
        uiState$: Rx.Observable.return(false),
        calculations,
    });
    const secondaryStatisticView = secondaryStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.secondary || {}),
        calculations,
    });
    const skillsView = skills({
        DOM,
        value$: characterSavedData$.map(x => x.skills || {}),
        calculations,
    });
    const traitsView = traits({
        DOM,
        value$: characterSavedData$.map(x => x.traits || []),
        calculations,
    });
    const perksView = perks({
        DOM,
        value$: characterSavedData$.map(x => x.perks || {}),
        calculations,
    });
    const healthView = health({
        DOM,
        value$: characterSavedData$.map(x => x.health || {}),
        calculations,
    });
    const result = {
        DOM: combineLatestObject({
            cosmetic: cosmeticView.DOM.throttle(17),
            primary: primaryStatisticView.DOM.throttle(17),
            secondary: secondaryStatisticView.DOM.throttle(17),
            skills: skillsView.DOM.throttle(17),
            traits: traitsView.DOM.throttle(17),
            perks: perksView.DOM.throttle(17),
            health: healthView.DOM.throttle(17),
        })
            .map(({cosmetic, primary, secondary, skills, traits, perks, health}) => h('section.character-sheet-body', [cosmetic, primary, secondary, skills, traits, perks, health]))
            .startWith(h('section.loading', `Loading, y'all.`))
            .sampleToRequestAnimationFrame(),
        localStorageSink: localStorageSource.first()
            .concat(combineLatestObject({
                character: {
                    race: raceView.value$.startWith(''),
                    cosmetic: cosmeticView.value$.startWith({}),
                    primary: primaryStatisticView.value$.startWith({}),
                    secondary: secondaryStatisticView.value$.startWith({}),
                    skills: skillsView.value$.startWith({}),
                    traits: traitsView.value$.startWith([]),
                    perks: perksView.value$.startWith({}),
                    health: healthView.value$.startWith({}),
                },
            })
                .throttle(200)
                .map(removeEmptyValues)
                .map(JSON.stringify.bind(JSON)))
            .distinctUntilChanged()
            .skip(1),
    };
    console.log('end', Date.now());
    return result;
}
