import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import cosmetic from './cosmetic';
import primaryAttributeChart from './primaryAttributeChart';
import skills from './skills';
import combineLatestObject from '../../combineLatestObject';

function safeParseJSON(value) {
    try {
        return JSON.parse(value) || {};
    } catch (e) {
        return {};
    }
}

export default function characterSheet({DOM, localStorageSource}) {
    const deserializedSavedData$ = localStorageSource
        .map(safeParseJSON);
    const cosmeticView = cosmetic({
        DOM,
        value$: deserializedSavedData$.map(x => x.cosmetic || {}),
    });
    const primaryAttributeView = primaryAttributeChart({
        DOM,
        value$: deserializedSavedData$.map(x => x.primary || {}),
        race$: cosmeticView.race$,
    });
    const skillsView = skills({
        DOM,
        value$: deserializedSavedData$.map(x => x.primary || {}),
        attributes$: primaryAttributeView.value$,
    });
    return {
        DOM: combineLatestObject({
            cosmetic: cosmeticView.DOM,
            primary: primaryAttributeView.DOM,
            skills: skillsView.DOM,
        })
            .map(({cosmetic, primary, skills}) => h('section', [cosmetic, primary, skills])),
        localStorageSink: combineLatestObject({
            cosmetic: cosmeticView.value$,
            primary: primaryAttributeView.value$,
        })
            .throttle(1000)
            .map(JSON.stringify.bind(JSON)),
    };
}
