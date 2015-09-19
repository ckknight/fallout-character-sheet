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
import { MISCELLANEOUS } from '../../constants.json';
import { replace as equationReplace } from '../../models/Equation';
import Immutable from 'immutable';
import Effect from '../../models/Effect';
import '../../sampleToRequestAnimationFrame';
import future from '../../future';

function safeParseJSON(value) {
    try {
        return JSON.parse(value) || {};
    } catch (e) {
        return {};
    }
}

const owns = Object.prototype.hasOwnProperty;
function coerceEmptyObject(obj) {
    for (const key in obj) {
        if (owns.call(obj, key)) {
            return obj;
        }
    }
    return null;
}

function coerceEmptyArray(array) {
    for (let i = array.length; --i >= 0;) {
        if (array[i]) {
            return array.slice(0, i + 1);
        }
    }
    return null;
}

function removeEmptyValues(obj) {
    if (Array.isArray(obj)) {
        return coerceEmptyArray(obj.map(removeEmptyValues));
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

function timer() {
    let lastTime = Date.now();
    return () => {
        const now = Date.now();
        const before = lastTime;
        lastTime = now;
        return now - before;
    };
}

export default function characterSheet({DOM, localStorageSource}) {
    const t = timer();
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
    const uiSavedData$ = deserializedSavedData$
        .map(x => x.ui || {});

    const effects$ = Rx.Observable.combineLatest(
        calculations.get('traitEffects', true),
        calculations.get('healthEffects', true))
        .map(effectLists => [].concat.apply([], effectLists));

    const effect$ = effects$
        .map(effects => effects
                .reduce((left, right) => left.mergeEffects(right), new Effect()))
        .startWith(new Effect())
        .distinctUntilChanged(undefined, Immutable.is)
        .shareReplay(1);

    const effecter = (equation$, key) => equation$.combineLatest(
            effect$
                .map(effect => effect[key] || 'value')
                .distinctUntilChanged(),
            (equation, replacement) => equationReplace(replacement, 'value', equation));

    console.log('alpha', t());
    const raceView = race({
        DOM,
        value$: characterSavedData$
            .map(x => x.race || ''),
        calculations,
    });
    console.log('race', t());
    const cosmeticView = cosmetic({
        DOM,
        value$: characterSavedData$
            .map(x => x.cosmetic || {}),
        uiState$: uiSavedData$.map(x => x.cosmetic || false),
        raceDOM: raceView.DOM,
        calculations,
    });
    console.log('cosmetic', t());
    const primaryStatisticView = primaryStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.primary || {}),
        uiState$: uiSavedData$.map(x => x.primary || false),
        calculations,
        effecter,
    });
    console.log('primary', t());
    const secondaryStatisticView = secondaryStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.secondary || {}),
        uiState$: uiSavedData$.map(x => x.secondary || false),
        calculations,
        effecter,
    });
    console.log('secondary', t());
    const skillsView = skills({
        DOM,
        value$: characterSavedData$.map(x => x.skills || {}),
        uiState$: uiSavedData$.map(x => x.skills || false),
        calculations,
        effecter,
    });
    console.log('skills', t());
    const traitsView = traits({
        DOM,
        value$: characterSavedData$.map(x => x.traits || []),
        uiState$: uiSavedData$.map(x => x.traits || false),
        calculations,
    });
    console.log('traits', t());
    const perksView = perks({
        DOM,
        value$: characterSavedData$.map(x => x.perks || {}),
        uiState$: uiSavedData$.map(x => x.perks || false),
        calculations,
    });
    console.log('perks', t());
    const healthView = health({
        DOM,
        value$: characterSavedData$.map(x => x.health || {}),
        calculations,
    });
    console.log('health', t());
    const result = {
        DOM: Rx.Observable.combineLatest([
            cosmeticView.DOM.startWith(null),
            primaryStatisticView.DOM.startWith(null),
            secondaryStatisticView.DOM.startWith(null),
            skillsView.DOM.startWith(null),
            traitsView.DOM.startWith(null),
            perksView.DOM.startWith(null),
            healthView.DOM.startWith(null),
        ])
            .map(vTrees => h('section.character-sheet-body', vTrees))
            .startWith(h('section.loading', `Loading, y'all.`))
            .sampleToRequestAnimationFrame(),
        localStorageSink: localStorageSource.first()
            .concat(combineLatestObject({
                character: {
                    race: raceView.value$,
                    cosmetic: cosmeticView.value$,
                    primary: primaryStatisticView.value$,
                    secondary: secondaryStatisticView.value$,
                    skills: skillsView.value$,
                    traits: traitsView.value$,
                    perks: perksView.value$,
                    health: healthView.value$,
                },
                ui: {
                    primary: primaryStatisticView.uiState$,
                    cosmetic: cosmeticView.uiState$,
                    secondary: secondaryStatisticView.uiState$,
                    skills: skillsView.uiState$,
                    traits: traitsView.uiState$,
                    perks: perksView.uiState$,
                },
            }, null)
                .throttle(200)
                .map(removeEmptyValues)
                .map(JSON.stringify.bind(JSON)))
            .distinctUntilChanged()
            .skip(1),
    };
    console.log('end', t(), Date.now());
    return result;
}
