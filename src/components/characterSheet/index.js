import { Rx } from '@cycle/core';
import { h } from '@cycle/dom';
import cosmetic from './cosmetic';
import primaryAttributeChart from './primaryAttributeChart';
import skills from './skills';
import traits from './traits';
import combineLatestObject from '../../combineLatestObject';

function safeParseJSON(value) {
    try {
        return JSON.parse(value) || {};
    } catch (e) {
        return {};
    }
}

function coerceEmptyObject(obj) {
    for (const key in obj) {
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
        value$: deserializedSavedData$.map(x => x.skills || {}),
        attributes$: primaryAttributeView.value$,
    });
    const traitsView = traits({
        DOM,
        value$: deserializedSavedData$.map(x => x.traits || {}),
        race$: cosmeticView.race$,
    });
    return {
        DOM: combineLatestObject({
            cosmetic: cosmeticView.DOM,
            primary: primaryAttributeView.DOM,
            skills: skillsView.DOM,
            traits: traitsView.DOM,
        })
            .map(({cosmetic, primary, skills, traits}) => h('section', [cosmetic, primary, skills, traits])),
        localStorageSink: combineLatestObject({
            cosmetic: cosmeticView.value$.startWith({}),
            primary: primaryAttributeView.value$.startWith({}),
            skills: skillsView.value$,
            traits: traitsView.value$,
        })
            .throttle(200)
            .map(removeEmptyValues)
            .map(JSON.stringify.bind(JSON)),
    };
}
