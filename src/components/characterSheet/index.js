import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import cosmetic from './cosmetic';
import primaryAttributeChart from './primaryAttributeChart';
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
    return {
        DOM: combineLatestObject({
            cosmetic: cosmeticView.DOM,
            primary: primaryAttributeView.DOM,
        })
            .map(({cosmetic, primary}) => h('section', [cosmetic, primary])),
        localStorageSink: combineLatestObject({
            cosmetic: cosmeticView.value$,
            primary: primaryAttributeView.value$,
        })
            .throttle(1000)
            .map(JSON.stringify.bind(JSON)),
    };
}
