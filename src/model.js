import { Rx } from '@cycle/core';
import { RACE_STATS, PRIMARY_ATTRIBUTES } from './constants';
import PrimaryAttribute from './PrimaryAttribute';

// import Character from './Character';
//
// function makeModification$(intents) {
//     const nameMod$ = intents.changeName$.map(name => state => state.set('name', name));
//
//     const ageMod$ = intents.changeAge$.map(age => state => state.set('age', age));
//
//     const raceMod$ = intents.changeRace$.map(race => state => state.set('race', race));
//
//     return Rx.Observable.merge(
//         nameMod$,
//         ageMod$,
//         raceMod$
//     );
// }
//
// export default function model(intents) {
//     return makeModification$(intents)
//         .startWith(new Character())
//         .scan((state, mutator) => mutator(state));
// }

function combineLatest(object) {
    const keys = Object.keys(object);
    const observables = keys.map(key => object[key]);
    return Rx.Observable.combineLatest(...observables, function () {
        const result = {};
        const len = keys.length;
        for (let i = 0; i < len; ++i) {
            result[keys[i]] = arguments[i];
        }
        return result;
    });
}

function deserialize(localStorageSource$) {
    return localStorageSource$
        .map(json => {
            try {
                return JSON.parse(json);
            } catch (e) {
                return {};
            }
        });
}

function wrapSavedData(savedData$) {
    return {
        get(key, defaultValue) {
            return savedData$.map(data => data[key] || defaultValue);
        }
    };
}

function getPrimaryStatExtremaByRace(race, attribute) {
    const stats = RACE_STATS[race];
    if (!stats) {
        return [1, 10];
    }
    return stats.primary[attribute];
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

function makePrimary(intents, savedData, race$) {
    const data$ = savedData.get('primary', {});
    const primaryIntents = intents.primary;

    return PRIMARY_ATTRIBUTES.reduce((acc, attribute) => {
        const attribute$ = Rx.Observable.merge(
            Rx.Observable.merge(
                data$.map(p => p[attribute] || 5),
                primaryIntents[`inc${capitalize(attribute)}$`],
                primaryIntents[`dec${capitalize(attribute)}$`])
                .map(change => acc => ({
                            change: change,
                            min: acc.min,
                            max: acc.max
                    })),
            race$
                .map(race => getPrimaryStatExtremaByRace(race, attribute))
                .map(([min, max]) => acc => ({
                            change: 0,
                            min,
                            max
                    })))
            .startWith(new PrimaryAttribute({
                key: attribute
            }))
            .scan((acc, modifier) => {
                const {change, min, max} = modifier(acc);
                return acc.merge({
                    value: Math.min(max, Math.max(min, acc.value + change)),
                    min,
                    max
                });
            })
            .distinctUntilChanged()
            .shareReplay(1);
        acc[`${attribute}$`] = attribute$;
        acc.list.push(attribute$);
        return acc;
    }, {
        list: []
    });
}

export default function model(intents, localStorageSource$) {
    const savedData = wrapSavedData(deserialize(localStorageSource$));

    const name$ = savedData.get('name', '')
        .merge(intents.changeName$);
    const age$ = savedData.get('age', 20)
        .merge(intents.changeAge$);
    const sex$ = savedData.get('sex', '')
        .merge(intents.changeSex$);
    const race$ = savedData.get('race', '')
        .merge(intents.changeRace$);
    const weight$ = savedData.get('weight', 150)
        .merge(intents.changeWeight$);
    const primary = makePrimary(intents, savedData, race$);
    primary.count$ = Rx.Observable.combineLatest(PRIMARY_ATTRIBUTES.map(attribute => primary[attribute + '$']))
        .map(points => points.reduce((x, y) => x + y.value, 0));
    primary.total$ = race$
        .filter(race => RACE_STATS[race])
        .map(race => RACE_STATS[race].primary.total)
        .startWith(40);

    return {
        name$,
        age$,
        sex$,
        race$,
        weight$,
        primary,
        serialize$() {
            return combineLatest({
                name: name$,
                race: race$,
                age: age$,
                sex: sex$,
                weight: weight$,
                primary: combineLatest(PRIMARY_ATTRIBUTES.reduce((acc, attribute) => {
                    acc[attribute] = primary[attribute + '$'].map(a => a.value);
                    return acc;
                }, {}))
            })
                .throttle(500)
                .map(o => JSON.stringify(o));
        }
    };
}
