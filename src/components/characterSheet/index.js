import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import race from './race';
import cosmetic from './cosmetic';
import primaryStatisticChart from './primaryStatisticChart';
import secondaryStatisticChart from './secondaryStatisticChart';
import miscellaneousStatisticChart from './miscellaneousStatisticChart';
import skills from './skills';
import traits from './traits';
import perks from './perks';
import health from './health';
import combineLatestObject from '../../combineLatestObject';
import Condition from '../../models/Condition';
import Calculations from './Calculations';
import equationReplace from '../../models/Equation/replace';
import Immutable from 'immutable';
import Effect from '../../models/Effect';
import '../../sampleToRequestAnimationFrame';
// import future from '../../future';

function log(...args) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log(...args);
    }
    /* eslint-enable no-console */
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

export default function characterSheet({DOM, value$: deserializedSavedData$, route$}) {
    const t = timer();
    log('start', Date.now());
    const calculations = new Calculations();
    Condition.all()
        .forEach(condition => calculations.set(condition.key, Rx.Observable.return(false)));
    // Object.keys(MISCELLANEOUS)
    //     .forEach(key => calculations.set(key, Rx.Observable.return(0)));
    const characterSavedData$ = deserializedSavedData$
        .map(x => x.character || {});
    const uiSavedData$ = deserializedSavedData$
        .map(x => x.ui || {});

    const effects$ = Rx.Observable.combineLatest(
        calculations.get('traitEffects', true).startWith([]),
        calculations.get('healthEffects', true).startWith([]))
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

    log('alpha', t());
    const raceView = race({
        DOM,
        value$: characterSavedData$
            .map(x => x.race || ''),
        calculations,
    });
    log('race', t());
    const cosmeticView = cosmetic({
        DOM,
        value$: characterSavedData$
            .map(x => x.cosmetic || {}),
        uiState$: uiSavedData$.map(x => x.cosmetic || false),
        raceDOM: raceView.DOM,
        calculations,
    });
    log('cosmetic', t());
    const primaryStatisticView = primaryStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.primary || {}),
        uiState$: uiSavedData$.map(x => x.primary || false),
        calculations,
        effecter,
    });
    log('primary', t());
    const secondaryStatisticView = secondaryStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.secondary || {}),
        uiState$: uiSavedData$.map(x => x.secondary || false),
        calculations,
        effecter,
    });
    log('secondary', t());
    const miscellaneousStatisticView = miscellaneousStatisticChart({
        DOM,
        value$: characterSavedData$.map(x => x.miscellaneous || {}),
        uiState$: uiSavedData$.map(x => x.miscellaneous || false),
        calculations,
        effecter,
    });
    log('miscellaneous', t());
    const skillsView = skills({
        DOM,
        value$: characterSavedData$.map(x => x.skills || {}),
        uiState$: uiSavedData$.map(x => x.skills || false),
        calculations,
        effecter,
    });
    log('skills', t());
    const traitsView = traits({
        DOM,
        value$: characterSavedData$.map(x => x.traits || []),
        uiState$: uiSavedData$.map(x => x.traits || false),
        calculations,
    });
    log('traits', t());
    const perksView = perks({
        DOM,
        value$: characterSavedData$.map(x => x.perks || {}),
        uiState$: uiSavedData$.map(x => x.perks || false),
        calculations,
    });
    log('perks', t());
    const healthView = health({
        DOM,
        value$: characterSavedData$.map(x => x.health || {}),
        calculations,
    });
    log('health', t());

    const routeToDOM = {
        cosmetic: cosmeticView.DOM.shareReplay(1),
        primary: primaryStatisticView.DOM.shareReplay(1),
        secondary: secondaryStatisticView.DOM.shareReplay(1),
        miscellaneous: miscellaneousStatisticView.DOM.shareReplay(1),
        skills: skillsView.DOM.shareReplay(1),
        traits: traitsView.DOM.shareReplay(1),
        perks: perksView.DOM.shareReplay(1),
        health: healthView.DOM.shareReplay(1),
    };
    const result = {
        DOM: route$
            .flatMapLatest(route => routeToDOM[route] || routeToDOM.cosmetic)
            .map(vTree => h('section.character-sheet-body', [vTree]))
            .startWith(h('section.loading', `Loading, y'all.`))
            .sampleToRequestAnimationFrame(),
        value$: combineLatestObject({
            character: {
                race: raceView.value$,
                cosmetic: cosmeticView.value$,
                primary: primaryStatisticView.value$,
                secondary: secondaryStatisticView.value$,
                miscellaneous: miscellaneousStatisticView.value$,
                skills: skillsView.value$,
                traits: traitsView.value$,
                perks: perksView.value$,
                health: healthView.value$,
            },
            ui: {
                primary: primaryStatisticView.uiState$,
                cosmetic: cosmeticView.uiState$,
                secondary: secondaryStatisticView.uiState$,
                miscellaneous: miscellaneousStatisticView.uiState$,
                skills: skillsView.uiState$,
                traits: traitsView.uiState$,
                perks: perksView.uiState$,
            },
        }, null),
    };
    log('end', t(), Date.now());
    return result;
}
